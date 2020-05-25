const Discord = require('discord.js');
const client = require('../index').client;
const ytdl = require('ytdl-core');
const request = require('request');
const config = require('../config.json');

module.exports = {
    name: 'play',
    description: 'Play music.',
    syntax: '',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'],
    cooldown: 1500,
    aliases: ['p'],
    dev_only: false,
    disabled: false,
    execute(message, args) {
        const manager = require('../music/music');
        if (!message.member.voiceChannel) return message.channel.send('No voice connection');

        if (!args[0]) {
            manager.play(message.guild, message.member.voiceChannel, message.channel).then(res => {
                console.log(res);
                     if (res == 0)                   return message.react('👍');
                else if (res == 1)                   return message.channel.send('Connected.');
                else if (res == -1)                  return;
                else if (res == 'no_queue')          return message.channel.send('You need to provide a valid URL.');
                else if (res == 'already_connected') return message.channel.send('Already in a different channel.');
                else                                 return message.channel.send('An error has occurred.');
            });
        } else {

            let input = args.join(' ');
            let url;

            if (!ytdl.validateURL(input)) {
                // YouTube search
                let apiKey = config.googleApiKey;
                
                request.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&key=${apiKey}&maxResults=1&q=${input}`, {json: true}, (err, res, body) => {
                    if (body.error != undefined) {
                    if (body.error['message'].indexOf('quota') > -1) {
                        console.log('[Music] YouTube quota exceeded.');
                        return message.channel.send('Error: Google API Quota exceeded. Please provide a video URL instead.');
                    }}
                    if (!body.items) return message.channel.send('The video could not be found.');
                    if (!body.items[0]) return message.channel.send('The video could not be found.');
                    url = `https://www.youtube.com/watch?v=${body.items[0].id.videoId}`;
                    validate();
                });
            } else {
                url = input
                validate();
            };

            function validate() {
                console.log(url);
                ytdl.getInfo(url).then(info => {

                    if (!info.video_url) {
                        return message.channel.send('The video could not be found.');
                    }

                    manager.addQueue(message.guild, {url: info.video_url, guild: message.guild, vc: message.member.voiceChannel, channel: message.channel}, true).then(res => {
                        console.log(res);
                             if (res == 0)                   return message.react('👍');
                        else if (res == 1)                   return message.channel.send('Connected.');
                        else if (res == -1)                  return;
                        else if (res == 'no_queue')          return message.channel.send('You need to provide a valid URL.');
                        else if (res == 'already_connected') return message.channel.send('Already in a different channel.');
                        else                                 return message.channel.send('An error has occurred.');
                    }); // End of addQueue
                }); // End of ytdl.getInfo
            }; // End of validate() function
        } // End of if/else for args[0]
    } // End of execute() function
} // End of module.exports