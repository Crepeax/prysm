const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'feedback',
    aliases: ['fb', 'support'],
    guildOnly: false,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'],
    execute(message, args) {

        const client = bot;
        const botOwner = client.users.get('284323826165350400');

        let embed = new Discord.RichEmbed()
        .setTitle('Hey!')
        .setDescription(`If you have a new idea or found a bug, please visit the [support server!](https://discord.gg/aTRHKUY)`)
        .setColor('72769c')
        .setFooter('Your support helps me make this bot better.');
        message.channel.send(embed);
    }
}