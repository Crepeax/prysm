const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'trello',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'],
    execute(message, args) {
        if (args[0] != 'link') {
        let attachment = new Discord.Attachment('./images/trello.png');
        let embed = new Discord.RichEmbed()
        .setTitle('Trello list!')
        .setColor('007ac1')
        .attachFile(attachment)
        .setThumbnail('attachment://trello.png')
        .setTimestamp()
        .setDescription('Click [here](https://trello.com/b/1yB6Ctkd) to access the official Trello board!')
        .setFooter(`If that link doesn\'t work, type '${config.prefix}trello link' instead.`);
        message.channel.send(embed);
    } else {
        message.channel.send('Use this link to access the public Trello board: https://trello.com/b/1yB6Ctkd');
    }
    }
}