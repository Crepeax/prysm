const Discord = require('discord.js');
const config = require('../config.json');


module.exports = {
    name: 'pingstorm',
    description: 'Rapidly ping a user multiple times in different text channels.',
    guildOnly: true,
    syntax: 'pingstorm [Amount of pings] [@Member]',
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'MENTION_EVERYONE'],
    disabled: false,
    cooldown: 120000,
    execute(message, args) {

        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('u need administrator bruh');

        if (message.mentions.members.first() == undefined || isNaN(args[0])) {
            return message.channel.send(`Invalid syntax.\nUsage: ${config.prefix}pingstorm [How many pings] [@Mention]`);
        }

        if (args[0] > 30 || args[0] < 1) {
            return message.channel.send('Hey, you can\'t ping someone more than 30 times at once.');
        }

        message.delete();

        for (let i = 0; i < Math.floor(args[0]); i = i + 1) {

            let o = message.guild.channels.random();
            while (o.type != 'text') {
                o = message.guild.channels.random();
            }
            o.send(`<@${message.mentions.members.first().user.id}>`)
            .then(m => m.delete());
        }

    }
}