const Discord = require('discord.js');
const client = require('../../bot').client;

module.exports = {
    name: 'announce',
    description: 'Skip music.',
    syntax: '',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'VIEW_CHANNEL', 'SPEAK'],
    cooldown: 1500,
    dev_only: false,
    disabled: false,
    execute(message, args) {

        if (!message.member.permissions.has('MANAGE_CHANNELS')) return message.channel.send('You need the \'Manage channels\' permission to do this.');

        const manager = require('../music/music');

        manager.getAnnounce(message.guild).then(res => {
            let set;
            set = !res;
            manager.setAnnounce(message.guild, set).then(r => {
                if (r == true) message.channel.send('Announcing tracks is now **enabled**.');
                else if (r == false) message.channel.send('Announcing tracks is now **disabled**.');
                else message.channel.send('An error has occurred.');
            });
        });
    }
}