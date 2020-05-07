const Discord = require('discord.js');

module.exports = {
    name: 'debugcooldown',
    description: 'Just a command used for debugging the cooldown.',
    guildOnly: true,
    cooldown: 30000,
    dev_only: false,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES'],
    execute(message, args) {
        message.channel.send('30 second cooldown set.');
    }
}