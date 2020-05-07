const Discord = require('discord.js');

module.exports = {
    name: 'channelview',
    description: 'Get a link that allows you to see details of your current channel. Useless since the last update.',
    guildOnly: true,
    aliases: ['cv', 'cview'],
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'VIEW_CHANNEL'],
    execute(message, args) {
        if (!message.member.voiceChannel) return message.channel.send('You need to join a voice channel for this.');
        let url = `https://discordapp.com/channels/${message.guild.id}/${message.member.voiceChannel.id}/`
        let embed = new Discord.RichEmbed()
        .setTitle('Advanced channel view')
        .setDescription(`Click [here](${url}) to access the detailed channel view.`);
        message.channel.send(embed);
    }
}