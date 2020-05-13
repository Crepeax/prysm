const Discord = require('discord.js');

module.exports = {
    name: 'mute',
    description: 'Mute the bot\'s sound in a voice channel.',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'CONNECT', 'SPEAK', 'EMBED_LINKS'],
    aliases: ['m', 'unmute'],
    disabled: false,
    dev_only: true,
    mutedguilds: {},
    execute(message, args) {
        let audioPlayers = require('../functions/audioPlayer');
        let queues = require('../functions/queues.js');
        if (audioPlayers.connections[message.guild.id] == undefined) {
            return message.channel.send('I am not playing anything right now...');
        }

        if (this.mutedguilds[message.guild.id] == undefined || this.mutedguilds[message.guild.id] == false) {
            this.mutedguilds[message.guild.id] = true;
            audioPlayers.dispatchers[message.guild.id].pause();
            message.react('🔇');
        } else {
            this.mutedguilds[message.guild.id] = false;
            audioPlayers.dispatchers[message.guild.id].resume();
            message.react('🔊');
        }

    }
}