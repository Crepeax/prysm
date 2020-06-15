const Discord = require('discord.js');
const client = require('../index').client;

module.exports = {
    name: 'disconnect',
    description: '',
    syntax: '',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'VIEW_CHANNEL', 'SPEAK'],
    cooldown: 1500,
    aliases: ['dc', 'dis', 'die', 'bye', 'leave', 'reset'],
    dev_only: false,
    disabled: false,
    execute(message, args) {
        const manager = require('../music/music');
        
        let vc = manager.getVC(message.guild);
        if (!message.member.voiceChannel) return message.channel.send('You need to be connected to a voice channel.');
        if (message.member.voiceChannel.id != vc) return message.channel.send('You need to be in my voice channel to do this.');

        manager.setLoop(message.guild, false); // Disable looping to prevent the bot from reconnecting after leaving

        manager.disconnect(message.guild).then(res => {
            console.log(res);
                 if (res == 0)                   return message.react('👋');
            else if (res == 'no_connection')     return message.channel.send('I am not currently in a voice channel.');
            else                                 return message.channel.send('An error has occurred.');
        });
    }
}