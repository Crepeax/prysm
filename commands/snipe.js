const Discord = require('discord.js');
const client = require('../index').client;

let deletedMessages = {}

client.on('messageDelete', m => {
    let guildId;
    if (!m.author.bot) {if (m.guild == undefined || m.guild == null) guildId = m.author.dmChannel.id; else guildId = m.guild.id;} else guildId = 0;

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

        foundMsgs = msgArr;

        let e = 0;

        foundMsgs.forEach(i => {
            if (!i) return;
            if (i.content.length > 1024) foundMsgs[e].content = i.substring(0, 1024);
            e += 1;
        })

        let embed = new Discord.RichEmbed()
        .setColor('2f3136');

        let o = 0;

        foundMsgs = foundMsgs.reverse();

        foundMsgs.forEach(msg => {
            if (!msg || o > 14) return;
            o += 1;
            let b = '';
            let ol = o;
            if (msg.author.bot) b = client.emojis.get('707194782832656446');
            //if (o == 1) ol = '(Newest)'; else if (o == foundMsgs.length) ol = '(Oldest)';
            embed.addField(`${ol} ${msg.author.username}#${msg.author.discriminator} ${b}`, `${msg.content}`, true);
        })
        embed.setDescription(`Last ${o} deleted messages`);
        message.channel.send(embed);

        foundMsgs = foundMsgs.reverse();
    }
}