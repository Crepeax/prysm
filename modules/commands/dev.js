/**
 * This command executed developer commands.
 * It is not meant to be publicly accessable.
 * It uses the same command loader thing that
 * the "normal" message handler uses, but only
 * loads commands with the "devCommand" flag.
 * Commands can only be ececuted by accounts
 * with the required flag(s) set to "true"
 * using the "setpermissions" dev command.
 */

const Discord = require("discord.js");
const fs = require('fs');
const data = require('../../bot');
const permissionLevels = require('../../permission_levels.json');
const { getFlags, getPermissionLevel } = require('../../functions/permission_flags');

const devCommandFiles = fs.readdirSync('modules/commands').filter(file => file.endsWith('.js'));
let commands = new Discord.Collection();

for (const file of devCommandFiles) {    
    const command = require(`../commands/${file}`);
    if (command.devCommand) {
        commands.set(command.name, command);
    }
}

module.exports = {
    name: 'dev',
    description: 'Developer-only commands.',
    syntax: 'dev [Subcommand]',
    guildOnly: false,
    hidden: true,
    perms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    execute(message, args) {
        if (!args[0]) return message.channel.send('Error: No subcommand provided.\nAvailable commands: `' + commands.keyArray().join('`, `') + '`');
        const commandName = args[0];
        const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName) && cmd.devCommand == true);
        if (!command) return message.channel.send('I can\'t find that command: ' + commandName.toLowerCase());

        let reqLevel = command.flag;

        let exec = false;
        
        let level = getPermissionLevel(message.author);
        if (level >= reqLevel) exec = true;

        if (data.db.botOwner.id == message.author.id) exec = true; // Always let the Bot Owner execute commands
        if (!exec) return message.channel.send(`Missing permission. Required permission level: \`${reqLevel}\``);

        // Execute the command
        args.shift();
        try {
            command.execute(message, args);
        } catch(e) {
            message.channel.send('An error has occurred: ' + e);
        }
    }
}