const Discord = require('discord.js');
const client = require('../index').client;

module.exports = {
    name: 'test',
    description: 'Simple test command.',
    syntax: 'test',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES'],
    cooldown: 1500,
    dev_only: false,
    disabled: false,
    execute(message, args) {
        message.channel.send(`I'm here, ${message.author.username}!`)
    }
}