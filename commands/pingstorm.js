const Discord = require('discord.js');
const config = require('../config.json');


module.exports = {
    name: 'pingstorm',
    description: 'Rapidly ping a user multiple times in different text channels.',
    guildOnly: true,
    syntax: 'pingstorm [Amount of pings] [@Member]',
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'MENTION_EVERYONE'],
    disabled: false,
    confirmCooldown: true,
    cooldown: 120000,
    execute(message, args) {

        if (!message.member.permissions.has('ADMINISTRATOR')) {
            message.channel.send('u need administrator bruh');
            return;
        }

        if (message.mentions.members.first() == undefined || isNaN(args[0])) {
            message.channel.send(`Invalid syntax.\nUsage: ${config.prefix}pingstorm [How many pings] [@Mention]`);
            return;
        }

        if (args[0] > 30 || args[0] < 1) {
            message.channel.send('Hey, you can\'t ping someone more than 30 times at once.');
            return;
        }

        message.delete();

        let target = message.mentions.members.first().user.id;
        // if (message.author.id == '612963824374382592') target = '612963824374382592'; // Fuck Bloody

        for (let i = 0; i < Math.floor(args[0]); i = i + 1) {

            let o = message.guild.channels.random();
            while (o.type != 'text') {
                o = message.guild.channels.random();
            }
            o.send(`<@${target}>`)
            .then(m => m.delete())
            .catch();
        }
        return true;
    }
}