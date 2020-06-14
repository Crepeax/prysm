const Discord = require('discord.js');
const client = require('../index').client;

module.exports = {
    name: 'move',
    description: 'Moves a track to a new position in te queue.',
    syntax: 'move [Song] [New place in queue]',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'VIEW_CHANNEL', 'SPEAK'],
    cooldown: 1500,
    aliases: ['mv', 'setindex'],
    dev_only: false,
    disabled: false,
    execute(message, args) {
        const manager = require('../music/music');
        
        let vc = manager.getVC(message.guild);
        if (!message.member.voiceChannel) return message.channel.send('You need to be connected to a voice channel.');
        if (message.member.voiceChannel.id != vc) return message.channel.send('You need to be in my voice channel to do this.');

        if (args[0] == undefined || isNaN(args[0])) return message.channel.send('You need to provide the song you want to move. This value should be a number.');

        let oldIndex, newIndex;
        oldIndex = args[0] - 1;
        if (isNaN(args[1]) || args[1] == undefined) newIndex = 0; else newIndex = args[1] - 1;

        let res = manager.setSongIndex(message.guild, oldIndex, newIndex);

        if (res == 'no_queue')              return message.channel.send('I am not currently playing.');
        else if (res == -1)                 return message.channel.send('An error has occurred.');
        else {
            let movedTo = newIndex + 1;

            let embed = new Discord.RichEmbed()
            .setDescription(`Moved to position ${movedTo}: [${res[1].title}](${res[1].video_url})`)
            .setColor('#2f3136');
            message.channel.send(embed);
        }
    }
}