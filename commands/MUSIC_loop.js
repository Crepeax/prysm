const Discord = require('discord.js');
const client = require('../index').client;

module.exports = {
    name: 'loop',
    description: 'Skip music.',
    syntax: '',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'VIEW_CHANNEL', 'SPEAK'],
    cooldown: 1500,
    aliases: ['l', 'repeat'],
    dev_only: false,
    disabled: false,
    execute(message, args) {
        const manager = require('../music/music');
        
        let vc = manager.getVC(message.guild);
        if (!message.member.voiceChannel) return message.channel.send('You need to be connected to a voice channel.');
        if (message.member.voiceChannel.id != vc) return message.channel.send('You need to be in my voice channel to do this.');

        manager.getLoop(message.guild).then(res => {
            let set;
            set = !res;
            manager.setLoop(message.guild, set).then(r => {
                if (r == true) message.channel.send('Enabled looping.');
                else if (r == false) message.channel.send('Disabled looping.');
                else message.channel.send('An error has occurred.');
            });
        });
    }
}