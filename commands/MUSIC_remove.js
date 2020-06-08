const Discord = require('discord.js');
const client = require('../index').client;

module.exports = {
    name: 'remove',
    description: '',
    syntax: '',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'VIEW_CHANNEL', 'SPEAK'],
    cooldown: 1500,
    aliases: ['rm'],
    dev_only: false,
    disabled: false,
    execute(message, args) {
        const manager = require('../music/music');
        
        let vc = manager.getVC(message.guild);
        if (!message.member.voiceChannel) return message.channel.send('You need to be connected to a voice channel.');
        if (message.member.voiceChannel.id != vc) return message.channel.send('You need to be in my voice channel to do this.');

        if (!args[0]) return message.channel.send('syntax error');

        manager.getQueue(message.guild).then(q => {

            let index;
            if (!isNaN(args[0]) || args[0] < 1) index = Math.round(args[0]); else return message.channel.send('You didn\'t provide a valid number.');

            let songText = '.';
            let songName = q.songinfo[q.queue[index - 1]].title;
            let songURL = q.songinfo[q.queue[index - 1]].video_url;

            if (q) if (q.queue) if (q.queue[index - 1]) if (q.songinfo) if (q.songinfo[q.queue[index - 1]]) if (songName) songText = `: [${songName}](${songURL})`;
            
            manager.clearFromQueue(message.guild, index - 1).then(res => {
                console.log(res);
                     if (res == 0)                   return message.channel.send(new Discord.RichEmbed().setDescription(`Song removed${songText}`).setColor('2f3136'));
                else if (res == 'no_queue')          return message.channel.send(new Discord.RichEmbed().setDescription('This server\'s queue is already empty.').setColor('ff0000'));
                else if (res == 'no_index')          return message.channel.send('No index provided.');
                else if (res == 'not_found')         return message.channel.send('The song could not be found.');
                else                                 return message.channel.send('An error has occurred.');
            });
        });
    }
}