const Discord = require('discord.js');
const client = require('../index').client;

module.exports = {
    name: 'hixifudu',
    description: 'it just does',
    syntax: '',
    guildOnly: true,
    perms: ['ADMINISTRATOR'],
    cooldown: 69420,
    dev_only: false,
    disabled: false,
    execute(message, args) {
        message.channel.send('hixifudu');
        
    }
}