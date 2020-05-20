const Discord = require('discord.js');
const client = require('../index').client;
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
        if (!fs.existsSync('joinmsg/msgs.json')) fs.writeFileSync('joinmsg/msgs.json', '{}');

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