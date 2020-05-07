const Discord = require('discord.js');

module.exports = {
    name: 'repeat',
    description: 'Sets the current song to loop.',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'CONNECT', 'SPEAK', 'EMBED_LINKS'],
    aliases: ['loop', 'r', 'l'],
    disabled: true,
    dev_only: false,
    repeatguilds: {},
    execute(message, args) {
        let audioPlayers = require('../functions/audioPlayer');
        let queues = require('../functions/queues.js');
        if (audioPlayers.connections[message.guild.id] == undefined) {
            return message.channel.send('I am not playing anything right now...');
        }
        if (this.repeatguilds[message.guild.id] == undefined || this.repeatguilds[message.guild.id] == false) {
            this.repeatguilds[message.guild.id] = true;
            message.react('🔁');
        } else {
            this.repeatguilds[message.guild.id] = false;
            message.react('⏩');
        }
    }
}