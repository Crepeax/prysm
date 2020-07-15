const Discord = require('discord.js');
const data = require('../../bot');
const client = data.client;
const getPrefix = require('../../functions/getPrefix').getPrefix;
const checkPermissions = require('../../functions/check_permissions');
const { getFlags } = require('../../functions/permission_flags');
const config = require('../../config.json');

module.exports.run = () => {
    
    // Listen for incoming messages
    client.on('message', message => {
        messageReceived(message, false);
    });

    // Listen for message updates
    client.on('messageUpdate', (old, message) => {
        if (!old || !message) return;
        if (old.content == message.content || !message.content) return;
        messageReceived(message, true);
    });

    /**Reveive and handle the message
     * @param {Discord.Message} message The message that was received
     * @param {boolean} wasEdited If the message was received via messageUpdate event or not 
     */
    async function messageReceived(message, wasEdited) {
        if (message.author.bot) return;
        try {
            // Remove duplicate spaces from message
            message.ogContent = message.content;
            message.content = message.content.replace(/\s+/g, ' ');

            const prefix = getPrefix(message.guild ? message.guild.id : undefined);
            if (!message.content.startsWith(prefix) && !message.content.startsWith(`<@${client.user.id}>`) && !message.content.startsWith(`<@!${client.user.id}>`)) return;
            
            let command, commandName, args;

            // Figure out how long the prefix is
            let cutMsgLength = 0;
            let startsWithMention = false;
            if (message.content.startsWith(prefix)) cutMsgLength = prefix.length;
            if (message.content.startsWith(`<@${client.user.id}>`))  { cutMsgLength = `<@${client.user.id}>`.length; startsWithMention = true; }
            if (message.content.startsWith(`<@!${client.user.id}>`)) { cutMsgLength = `<@!${client.user.id}>`.length; startsWithMention = true; }

            // Split the message into command and arguments
            const commands = require('./command_loader').commands;
            message.content = message.content.slice(cutMsgLength);
            if (startsWithMention && message.content.startsWith(' ')) message.content = message.content.slice(1);
            args = message.content.split(' ');
            commandName = args.shift().toLowerCase();
            command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            if (!command) return;
            
            const flags = getFlags(message.author);

            if (flags["BLACKLIST"]) return message.channel.send(`${message.author}, you are currently blacklisted from using this bot.`);
            if (flags["SILENT_BLACKLIST"]) return;
            
            // Increase total command counter
            data.db.stats.inc('total_commands');

            // Check if the command is dev-only or disabled
            if (command.disabled) return message.channel.send('Sorry, this command is currently unfinished, and can\'t be used.');
            if (command.dev_only) {
                if (!flags['EXECUTE_DEV_COMMANDS']) return message.channel.send('Sorry, this command is currently in development, and can only be used by developers.');
            }

            // Check if the bot has the required permissions to execute the command
            if (!checkPermissions.check(command, message.guild, message)) return;
            
            // Finally, let's execute the command.
            try {
                command.execute(message, args);
            } catch(e) {
                console.log('Failed to execute command');
                console.error(e);
                message.channel.send(`Uh-oh. I failed to execute that command.\n\`\`\`js\n${e}\`\`\`If this keeps happening, please contact \`${data.db.botOwner.username}#${data.db.botOwner.discriminator}\``).catch(e => message.channel.send('Uh-oh. Something went wrong.'));
            }
        } catch(e) {
            // Send a message when something bad happens
            console.log('Failed to execute command');
            console.error(e);
            message.channel.send(`Uh-oh. An error has occurred. This is not good.\n\`\`\`js\n${e}\`\`\`If this keeps happening, please contact \`${data.db.botOwner.username}#${data.db.botOwner.discriminator}\``).catch(e => message.channel.send('Uh-oh. Something went wrong.'));
            return;
        }
    }
}

module.exports.meta = {
    name: 'message_handler',
    priority: 2
}