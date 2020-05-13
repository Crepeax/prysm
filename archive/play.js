const Discord = require('discord.js');
const request = require('request');
const sanitizeHtml = require('sanitize-html');
let queues = require('../functions/queues.js');
const ytdl = require('ytdl-core');
const validUrl = require('valid-url');
const cheerio = require('cheerio');
const arrayMove = require('array-move');

var servers = {};

ready = {};

module.exports = {
    name: 'play',
    description: 'Play music from YouTube.',
    guildOnly: true,
    aliases: ['p'],
    disabled: false,
    dev_only: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'CONNECT', 'SPEAK', 'EMBED_LINKS'],
    disconnected: {},
    currentQueue: {},
    execute(message, args) {
        
if (ready[message.guild.id] == false) {
    return message.react('❌');
}

ready[message.guild.id] = false;
console.log('Not ready');
setTimeout(function() {
    ready[message.guild.id] = true;
    console.log('Ready');
    message.react('✅');
}, 15000);

this.disconnected[message.guild.id] = false;

        function yeet(target) {
            server = servers[message.guild.id];
            console.log(server.queue.length);
            console.log(server.queue.push(target));
            console.log(server.queue);
            
            queues.setQueue(message.guild.id, server);
            
            playAudio(server.queue);
        }

        function playAudio(q) {
            server.queue = q;
            let that = require('./play');
            that.currentQueue[message.guild.id] = server.queue;
            message.member.voiceChannel.join().then(connection => {
                if (!server.queue[0]) return console.log(server.queue);
                if (!connection.speaking) {
                    console.log('Playback started');
                    let audioPlayer = require('../functions/audioPlayer');
                    const stream = ytdl(server.queue[0], {quality : 'highestaudio', highWaterMark: 1024 * 1024 * 10});
                    const dispatcher = connection.playStream(stream);
                    audioPlayer.connections[message.guild.id] = connection;
                    audioPlayer.dispatchers[message.guild.id] = dispatcher;
                    dispatcher.setBitrate('auto');
                    dispatcher.setVolume(0.5);
                    console.log(`\nPlayback information:\nQueue : ${server.queue}\nStream : ${stream}\nDispatcher : ${dispatcher}\n`);
                    setTimeout(function() {
                    ready[message.guild.id] = true;
                    console.log('Ready');
                    message.react('✅');
                    }, 3500);
                    connection.on('error', err => {console.error(err)});
                    dispatcher.on("end", end => {

                        if (that.disconnected[message.guild.id] == true) {
                            server.queue = undefined;
                            that.disconnected[message.guild.id] = undefined;
                            connection.disconnect();
                            return;
                        }

                        console.log('Playback ended');
                        setTimeout(function() {
                        let repeats = require('./repeat');
                        if (repeats.repeatguilds[message.guild.id] == true) {
                            console.log(server.queue);
                            arrayMove.mutate(server.queue, 0, server.queue.length - 1);
                            console.log(server.queue);
                        } else {
                            console.log(server.queue);
                            server.queue.splice(0, 1);
                        }
                        if (server.queue.length != 0) {
                            if (!connection) return;
                            setTimeout(function() {
                            console.log('Continuing playback.');
                            connection.speaking = false;
                            that.currentQueue = server.queue;
                            playAudio(server.queue);
                            }, 1000);
                        } else {
                            console.log('Leaving voice channel.');
                            that.currentQueue = server.queue;
                            let muted = require('./mute');
                            let repeats = require('./repeat');
                            if (muted.mutedguilds[message.guild.id] == undefined || muted.mutedguilds[message.guild.id] == true) {
                                muted.mutedguilds[message.guild.id] = false;
                            }
                            if (repeats.repeatguilds[message.guild.id] == undefined || repeats.repeatguilds[message.guild.id] == true) {
                                repeats.repeatguilds[message.guild.id] = false;
                            }
                            that.disconnected[message.guild.id] = undefined;
                            connection.disconnect();
                        }
                    }, 1000);
                    });

                } else {
                    ready[message.guild.id] = true;
                    console.log('Ready');
                    message.react('✅');
                }
            }).catch();
        }

        let servers = queues.getQueues();

            if (!message.member.voiceChannel) {
                ready[message.guild.id] = true;
                return message.channel.send('You need to join a voice channel first!');
            } else if (args[0] == undefined) {
                message.channel.send('You need to write the name of the song or the YouTube URL.');
                ready[message.guild.id] = true;
            } else {
                let target;

                if (ytdl.validateURL(args[0])) {
                    request.get(args[0], (err, response, body) => {
                      if (err) throw err;
                      const $ = cheerio.load(body);
                      const length = $("#unavailable-message").length;
                      if (length > 1) { // if the video is unavailable
                        ready[message.guild.id] = true;
                        return message.channel.send('That URL is not valid.');
                      } else {
                        target = args[0];
                        yeet(target);
                      }
                    });
                } else {

                    let apiKey = 'AIzaSyB3wWQoh-H1X9I7g_GjhmGLIwLll5OddQY';
                
                    request.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&key=${apiKey}&maxResults=1&q=${sanitizeHtml(args.slice(0).join(' '))}`, {json: true}, (err, res, body) => {
                        console.log('Requested');
                        if (body.error != undefined) {
                        if (body.error['message'] == 'The request cannot be completed because you have exceeded your <a href="/youtube/v3/getting-started#quota">quota</a>.') {
                            console.log('YT API is limiting.');
                            ready[message.guild.id] = true;
                            return message.channel.send('Sorry, I am unable to play music right now because YouTube is limiting the amount of search requests I can perform. Please try again tomorrow or write the URL of the video you want to play.');
                        }}
                        let errMsg = 'I couldn\'t find that song.';
                        var cont = false;
                        if (body) {cont = true} else return message.channel.send(errMsg);
                        if (body.items) {cont = true} else return message.channel.send(errMsg);
                        if (body.items[0]) {cont = true} else return message.channel.send(errMsg);
                        if (body.items[0].id) {cont = true} else return message.channel.send(errMsg);
                        if (body.items[0].id.videoId) {cont = true} else return message.channel.send(errMsg);

                        if (cont) {
                            target = `https://www.youtube.com/watch?v=${body.items[0].id.videoId}`;
                            yeet(target);
                        } else {ready[message.guild.id] = true; return message.channel.send('I couldn\'t find anything matching that search term.');}
                    });

                }

            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            
        }
    }
}