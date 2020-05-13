const Discord = require('discord.js');

module.exports = {
    name: 'leave',
    description: 'Makes the bot leave your current voice channel.',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'CONNECT', 'SPEAK', 'EMBED_LINKS'],
    aliases: ['dc', 'disconnect', 'stop'],
    disabled: false,
    dev_only: true,
    execute(message, args) {
        let audioPlayers = require('../functions/audioPlayer');
        let playCmd = require('./play');
        let queues = require('../functions/queues.js');
        if (audioPlayers.connections[message.guild.id] == undefined) {
            return message.channel.send('I am not playing anything right now...');
        }
        message.react('✅');
        queues.setQueue(message.guild.id, undefined);
        playCmd.disconnected[message.guild] = true;
        audioPlayers.connections[message.guild.id].disconnect();
        audioPlayers.connections[message.guild.id] == undefined;
        audioPlayers.dispatchers[message.guild.id] == undefined;

        let muted = require('./mute');
        muted.mutedguilds[message.guild.id] = undefined;
    }
}