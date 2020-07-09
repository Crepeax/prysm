const Discord = require('discord.js');
const client = require('../../bot').client;
const ytdl = require('ytdl-core');

module.exports = {
    name: 'queue',
    description: 'Show the current queue.',
    syntax: '',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'VIEW_CHANNEL', 'SPEAK'],
    cooldown: 1500,
    aliases: ['q'],
    dev_only: false,
    disabled: false,
    execute(message, args) {
        const manager = require('../music/music');
        
        let vc = manager.getVC(message.guild);
        if (!message.member.voiceChannel) return message.channel.send('You need to be connected to a voice channel.');
        if (message.member.voiceChannel.id != vc) return message.channel.send('You need to be in my voice channel to do this.');

        function fetch() {
            manager.getQueue(message.guild).then(res => {
                if (!res.queue) res.queue = [];

                let songinfo = res.songinfo;

                let queuedata = [];

                // Push queue in array
                queuedata.push(res.np);
                res.queue.forEach(element => queuedata.push(element));

                console.log(queuedata);

                let i = -1;
                let desc = ``;
                let loopmsg = 'Not looping';
                let end = false;
                let nr = 0;

                if (res.repeat) loopmsg = 'Looping the queue';

                queuedata.forEach(element => {
                    if (end) return;
                    if (!element) return;
                    nr += 1;
                    i += 1;
                    let pre;

                    if (i == 0) pre = '**Now playing:**';
                    else if (i == 1) pre = '\n**Next up:**';
                    else pre = `**${i}:**`;

                    let info = songinfo[element];

                    if (!info) {
                        info = {};
                        info.title = 'Error';
                        info.video_url = 'Error';
                    }

                    let prev = desc;
                    desc += `${pre} [${info.title}](${info.video_url})\n`;
                    if (desc.length > 1980) {
                        desc = prev;
                        desc += `\n${1 + queuedata.length - nr} more songs.`;
                        end = true;
                    }
                });

                if (queuedata[0] == 'none') desc = `The queue is empty!`;

                let embed = new Discord.RichEmbed()
                .setTitle(`${message.guild.name}'s queue`)
                .setDescription(desc)
                .setColor('2f3136')
                .setThumbnail(`https://img.youtube.com/vi/${res.songinfo[res.np].video_id}/hqdefault.jpg`)
                .setFooter(`Requested by ${message.author.username} | ${res.queue.length} songs remaining | ${loopmsg}`, message.author.avatarURL);
                message.channel.send(embed);
            });
        }

        fetch();
    }
}