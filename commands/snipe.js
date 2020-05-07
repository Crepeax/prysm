const Discord = require('discord.js');
const client = require('../index').client;

let deletedMessages = {}

client.on('messageDelete', m => {
    if (m.author.bot) return;
    let guildId;
    if (m.guild == undefined || m.guild == null) guildId = m.author.dmChannel.id; else guildId = m.guild.id;

    if (deletedMessages[guildId] == undefined) deletedMessages[guildId] = {};
    if (deletedMessages[guildId][m.channel.id] == undefined) deletedMessages[guildId][m.channel.id] = [];

    if (m.content != '' && m.content != undefined) deletedMessages[guildId][m.channel.id].push(m);

    if (deletedMessages[guildId][m.channel.id].length > 30) deletedMessages[guildId][m.channel.id].shift();
})

module.exports = {
    name: 'snipe',
    description: 'Show the last deleted messages in the current channel.',
    syntax: 'snipe',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'],
    cooldown: 2000,
    execute(message, args) {
        if (!deletedMessages[message.guild.id]) return message.channel.send('No recently deleted messages found.');
        if (!deletedMessages[message.guild.id][message.channel.id]) return message.channel.send('No recently deleted messages found.');
        
        let foundMsgs = [];
        let msgArr = deletedMessages[message.guild.id][message.channel.id];

        if (msgArr.length == 0) return message.channel.send('No recently deleted messages found.');

        if (msgArr.length < 6) foundMsgs = msgArr;
        else {
            foundMsgs.push(msgArr[msgArr.length - 1]);
            foundMsgs.push(msgArr[msgArr.length - 2]);
            foundMsgs.push(msgArr[msgArr.length - 3]);
            foundMsgs.push(msgArr[msgArr.length - 4]);
            foundMsgs.push(msgArr[msgArr.length - 5]);
            foundMsgs.push(msgArr[msgArr.length - 6]);
        }

        let embed = new Discord.RichEmbed()
        .setDescription(`Last ${foundMsgs.length} deleted messages`)
        .setColor('2f3136');

        foundMsgs.forEach(msg => {
            let b = '';
            if (msg.author.bot) b = client.emojis.get('707194782832656446');
            embed.addField(`${msg.author.username}#${msg.author.discriminator} ${b}`, `${msg.content}`, true)
        })
        message.channel.send(embed);
    }
}