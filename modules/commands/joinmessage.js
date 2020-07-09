const Discord = require('discord.js');
const client = require('../../bot').client;
const fs = require('fs');

module.exports = {
    name: 'joinmessage',
    description: '',
    syntax: '',
    guildOnly: true,
    aliases: ['joinmessages', 'jm', 'joinmsg'],
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'],
    cooldown: 1500,
    dev_only: true,
    disabled: false,
    execute(message, args) {
        return message.channel.send('Not programmed yet');

        if (!args[0]) return message.channel.send('Error: args[0] missing');

        switch(args[0]) {
            case 'set':

            break;

            case 'remove':
            case 'delete':

            break;
        }
    }
}