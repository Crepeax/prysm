const Discord = require('discord.js');
const data = require('../../bot');
const client = data.client;

const fs = require('fs');

module.exports.commands = new Discord.Collection();
module.exports.available = 0;
module.exports.disabled = 0;
module.exports.run = (verbose = true) => {
    if (verbose) process.stdout.write('Loading commands');

    this.available = 0;
    this.disabled = 0;

    // Load all files in the commands folder
    const commandFiles = fs.readdirSync('modules/commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        if (verbose) process.stdout.clearLine();
        if (verbose) process.stdout.cursorTo(0);
        if (verbose) process.stdout.write(`[Shard ${client.shard.id}] Loading commands ${'\x1b[34m'}modules/commands/${file}${'\x1b[0m'}`);
        
        const command = require(`../commands/${file}`);
        if (!command.devCommand) {
            this.commands.set(command.name, command);
            if (command.disabled || command.dev_only) this.disabled += 1; else this.available += 1;
        }
    }
    if (verbose) process.stdout.clearLine();
    if (verbose) process.stdout.cursorTo(0);
    if (verbose) process.stdout.write(`[Shard ${client.shard.id}] Loaded ${this.commands.size} commands.\n`);
}
module.exports.reloadAll = () => {
    const commandFiles = fs.readdirSync('modules/commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        var name = require.resolve(`../commands/${file}`);
        delete require.cache[name];

        const command = require(`../commands/${file}`);
        if (!command.devCommand) {
            this.commands.set(command.name, command);
        }

        console.log(`[Shard ${client.shard.id}] Reloaded ${file}`);
    }
    console.log(`[Shard ${client.shard.id}] Reloaded all commands.`);
}

module.exports.meta = {
    name: 'command_loader',
    priority: 1
}