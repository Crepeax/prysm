const Discord = require('discord.js');
const client = require('../index').client;
const ytdl = require('ytdl-core');
const ytinfo = require('youtube-info');
const fs = require('fs');
const event = require('events');
const events = new event.EventEmitter();
const config = require('../config.json');

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

let queues = {};
let np = {};
let repeat = {};
let connections = {};
let songinfo = {};
let rmQueueSong = {};
let announce = JSON.parse(fs.readFileSync('music/announce.json'));;

module.exports = { // Müll
    async addQueue(guild, details, autoplay) {
        const manager = require('./music.js');
        console.log('[Music] Queue add requested');
        if (!queues[guild.id]) queues[guild.id] = [];
        if (!queues[guild.id] && !details.url) return 'no_queue';
        queues[guild.id].push(details.url);

        let info = await ytdl.getInfo(details.url);
        if (!info.video_url) {
            return 'no_queue';
        }

        songinfo[info.video_url] = info;

        let res;
        let playing = false;
        if (connections[guild.id]) if (connections[guild.id].speaking) playing = true;
        if (autoplay && !playing) return manager.play(details.guild, details.vc, details.channel);
        else return 0;
    },

    async clearQueue(guild) {
        console.log('[Music] clearQueue requested');
        const manager = require('./music.js');
        if (queues[guild.id]) queues[guild.id] = [];
        return 0;
    },

    async clearFromQueue(guild, index) {
        if (isNaN(index) || index == undefined) return 'no_index';
        const manager = require('./music.js');
        if (!queues[guild.id]) return 'no_queue';
        else if (!queues[guild.id][index]) return 'not_found';
        else queues[guild.id].splice(index, 1);
        return 0;
    },

    async getQueue(guild) {
        if (typeof guild == 'string' || typeof guild == 'number') guild = client.guilds.get(guild);
        if (!guild) return -1;
        if (!np[guild.id]) np[guild.id] = 'none';
        if (!repeat[guild.id]) repeat[guild.id] = false;
        let npinfo = {};
        if (connections[guild.id]) if (connections[guild.id].dispatcher && np[guild.id]) {
            npinfo.playtime = connections[guild.id].dispatcher.streamTime;
            npinfo.endsin = (songinfo[np[guild.id]].length_seconds * 1000) - connections[guild.id].dispatcher.streamTime;
            npinfo.songlength = (songinfo[np[guild.id]].length_seconds * 1000);
            npinfo.channel = connections[guild.id].channel;
        }
        
        npinfo.volume = JSON.parse(fs.readFileSync('music/volumes.json'))[guild.id];

        return ({ "queue" : queues[guild.id] , "np" : np[guild.id] , "songinfo" : songinfo , "repeat" : repeat[guild.id] , guild : guild , np_info : npinfo });
    },

    async getLoop(guild) {
        console.log('[Music] getLoop requested');
        if (repeat[guild.id] == undefined) repeat[guild.id] = false;
        return repeat[guild.id];
    },

    async setLoop(guild, value) {
        console.log('[Music] setLoop requested');
        if (typeof value != 'boolean') return undefined;
        repeat[guild.id] = value;
        return repeat[guild.id];
    },

    async getAnnounce(guild) {
        console.log('[Music] getAnnounce requested');
        if (announce[guild.id] == undefined) announce[guild.id] = true;
        return announce[guild.id];
    },

    async setAnnounce(guild, value) {
        console.log('[Music] setAnnounce requested');
        if (typeof value != 'boolean') return undefined;
        announce[guild.id] = value;
        let file = JSON.parse(fs.readFileSync('music/announce.json'));
        file[guild.id] = announce[guild.id];
        fs.writeFileSync('music/announce.json', JSON.stringify(file));
        return announce[guild.id];
    },

    async skip(guild) {
        if (typeof guild == 'string' || typeof guild == 'number') guild = client.guilds.get(guild);
        if (!guild.members.get(client.user.id).voiceChannel) return 'no_connection';
        events.emit(`skip_${guild.id}`);
        return 0;
    },

    async disconnect(guild) {
        if (typeof guild == 'string') {
            guild = client.guilds.get(guild);
        }
        if (!guild.members.get(client.user.id).voiceChannel) return 'no_connection';
        events.emit(`dc_${guild.id}`);
        return 0;
    },

    async setVolume(guild) {
        if (typeof guild == 'string' || typeof guild == 'number') guild = client.guilds.get(guild);
        events.emit(`vol_${guild.id}`);
        return 0;
    },

    getVC(guild) {
        let vc = guild.members.get(client.user.id).voiceChannel;
        if (!vc) return undefined;
        return vc.id;
    },

    setSongIndex(guild, oldIndex, newIndex) {
        if (typeof guild == 'string' || typeof guild == 'number') guild = client.guilds.get(guild);
        if (typeof oldIndex != 'number') return -1;
        if (typeof newIndex != 'number') return -1;

        if (!queues[guild.id]) return 'no_queue';
        if (!queues[guild.id][0]) return 'no_queue';

        
        if (oldIndex >= queues[guild.id].length) oldIndex = queues[guild.id].length - 1;
        if (oldIndex < 0) oldIndex = 0;

        if (!newIndex || newIndex < 0) newIndex = 0;
        if (newIndex >= queues[guild.id].length) newIndex = queues[guild.id].length - 1;

        let oldItem = queues[guild.id].splice(oldIndex, 1)[0];
        queues[guild.id].splice(newIndex, 0, oldItem);

        return [oldItem, songinfo[oldItem], newIndex];
    },

    async play(guild, vc, channel) {
        // Play the music in the queue
        try {
            console.log('[Music] Play requested')
            const manager = require('./music.js');
            let res;

            if (!queues[guild.id]) queues[guild.id] = [];
            if (!queues[guild.id][0]) {
                channel.send('You need to provide a URL or the name of the song you want to play.');
                return -1;
            }

            // Don't connect when already in a different channel
            if (guild.members.get(client.user.id).voiceChannel) {
                if (guild.members.get(client.user.id).voiceChannel == vc) res = 0;
                else if (guild.members.get(client.user.id).voiceChannel != vc) {
                    if (guild.members.get(client.user.id).voiceChannel.members.size <= 1) res = 1;
                    else return 'already_connected';
                }
            } else res = 1;

            // Remove "undefined" songs
            while (!queues[guild.id][0]) {
                queues[guild.id].shift();
                console.log('[Music] Skipped undefined song');
            }

            // Validating input URL
            if (typeof queues[guild.id][0] != 'string') return;
            if (!ytdl.validateURL(queues[guild.id][0])) {
                channel.send('The video URL is not valid.');
                return -1;
            }
            let info = await ytdl.getInfo(queues[guild.id][0]);
            if (typeof info != 'object'){
                channel.send('The video could not be found.');
                return -1;
            }
            if (typeof info.video_url != 'string') {
                channel.send('The video could not be found.');
                return -1;
            }

            if (!info.video_id) {
                queues[guild.id].shift();
                console.log('[Music] Skipped undefined URL');
                if (queues[guild.id].length == 0) return;
                manager.play(guild, vc, channel);
                return;
            }

            songinfo[queues[guild.id][0]] = info;

            // Remove song from queue or move it to the end
            console.log('[Music] Removing song from queue');
            if (repeat[guild.id] == true) {
                if (rmQueueSong[guild.id]) {
                    rmQueueSong[guild.id] = undefined;
                    np[guild.id] = queues[guild.id][0];
                    queues[guild.id].shift();
                } else {
                    let a = np[guild.id];
                    np[guild.id] = queues[guild.id][0];
                    queues[guild.id].shift();
                    queues[guild.id].push(a);
                }
            }
            else {
                rmQueueSong[guild.id] = undefined;
                np[guild.id] = queues[guild.id][0];
                queues[guild.id].shift();
            }

            // Announce song
            if (announce[guild.id] == undefined) announce[guild.id] = true;
            fs.writeFileSync('music/announce.json', JSON.stringify(announce));
            if (announce[guild.id] == true && channel) {
                let embed = new Discord.RichEmbed()
                .setTitle('Now playing')
                .setDescription(`[${info.title}](${info.video_url})`)
                .setColor('2f3136')
                .setThumbnail(info.thumbnail_url)
                .setFooter(`Disable with ${config.prefix}announce`)
                .setTimestamp();
                channel.send(embed);
            }

            // Getting volume
            let file = JSON.parse(fs.readFileSync('music/volumes.json'));
            if (!file[guild.id]) file[guild.id] = 0.5;
            if (isNaN(file[guild.id])) file = 0.5;
            let volume = file[guild.id];
            fs.writeFileSync('music/volumes.json', JSON.stringify(file));

            // Connect, and play the song
            vc.join().then(connection => {
                console.log('[Music] Joined voice channel: ' + vc.name);
                connections[guild.id] = connection;
                if (connection.speaking) return;
                const streamOptions = { seek: 0, volume: volume };
                if (typeof info.video_url == 'undefined') return;

                console.log(info.video_url);
                let stream = ytdl(info.video_url, {quality : 'highestaudio', highWaterMark: 1024 * 1024 * 10});
                
                const dispatcher = connection.playStream(stream, streamOptions);

                // End dispatcher and send a message when bot gets disconnected
                client.on('voiceStateUpdate', (oldMember, newMember) => {
                    if (oldMember.user.id != client.user.id) return;
                    if (oldMember.voiceChannel != null && newMember.voiceChannel == null && oldMember.voiceChannel == dispatcher.voiceChannel) {
                        connections[newMember.guild.id] = undefined;
                        repeat[newMember.guild.id] = false;
                        if (!dispatcher.destroyed) {
                            dispatcher.end();
                            if (channel) channel.send('Disconnected.');
                        }
                    }
                });

                dispatcher.on('error', error => {
                    channel.send(`The audio dispatcher encountered an error.\nDebug information: \`\`\`${error}\`\`\`\nIf this keeps occurring, please report it using ${config.prefix}support.`);
                    connection.channel.leave();
                    return -1;
                });

                dispatcher.on('failed', error => {
                    channel.send(`The dispatcher failed to connect to your voice channel.\nDebug information: \`\`\`${error}\`\`\`\nIf this keeps occurring, please report it using ${config.prefix}support.`);
                });

                if (require('../index').testingMode) {
                    console.log(`\x1b[36m[Music] [Debug] Logging dispatcher debug messages for '${channel.name}'.\x1b[0m`);
                    dispatcher.on('debug', message => {
                        console.log(`\x1b[36m[Music] [Debug] ${message} [${channel.name}]\x1b[0m`);
                    });
                } else console.log(`\x1b[36m[Music] [Debug] Not logging debug messages.\x1b[0m`);

                let skipEvent = function() {
                    console.log('[Music] Skipping');
                    if (!dispatcher.destroyed) dispatcher.end();
                }

                let volEvent = function() {
                    console.log('[Music] Updating volume');
                    let v = JSON.parse(fs.readFileSync('music/volumes.json'))[guild.id];
                    dispatcher.setVolume(v);
                }

                let dcEvent = function() {
                    console.log('[Music] Disconnecting');
                    manager.clearQueue(guild);
                    vc.leave();
                }

                // Skip song when skip event is emitted
                events.on(`skip_${guild.id}`, skipEvent);

                // Change volume
                events.on(`vol_${guild.id}`, volEvent);

                // Disconnect
                events.on(`dc_${guild.id}`, dcEvent);

                dispatcher.on('end', () => {
                    // Remove listeners
                    console.log('[Music] Clearing listeners');
                    events.removeListener(`skip_${guild.id}`, skipEvent);
                    events.removeListener(`vol_${guild.id}`, volEvent);
                    events.removeListener(`dc_${guild.id}`, dcEvent);
                    // When playback ended...
                    console.log('[Music] Dispatcher ended: ' + vc.name);
                    // Play next song
                    if (queues[guild.id].length > 0) {
                        manager.play(guild, vc, channel);
                    } else {
                        // Push current song to queue if looping is enabled
                        if (repeat[guild.id] == true) {
                            queues[guild.id].push(np[guild.id]);
                            rmQueueSong[guild.id] = true;
                            manager.play(guild, vc, channel);
                        }
                        // Or leave the voice channel
                        else {
                            connection.channel.leave();
                            np[guild.id] = undefined;
                        }
                    }
                });
            
            }).catch(err => console.error(err));
            if (!res) res = 0;
            return res;
        } catch(e) {
            console.error(e);
            channel.send('An error occurred during playback.');
            vc.leave();
        }
    }

    /**
     * --- To do ---
     * Display queue on dashboard
     * Saving/loading queues
     */
}
