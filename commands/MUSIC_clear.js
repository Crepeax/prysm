const Discord = require('discord.js');
const client = require('../index').client;

module.exports = {
    name: 'clear',
    description: '',
    syntax: '',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'VIEW_CHANNEL', 'SPEAK'],
    cooldown: 1500,
    aliases: ['cq', 'clearqueue', 'empty'],
    dev_only: false,
    disabled: false,
    execute(message, args) {
        const manager = require('../music/music');
        
        let vc = manager.getVC(message.guild);
        if (!message.member.voiceChannel) return message.channel.send('You need to be connected to a voice channel.');
        if (message.member.voiceChannel.id != vc) return message.channel.send('You need to be in my voice channel to do this.');
        
        manager.clearQueue(message.guild).then(res => {
            console.log(res);
                 if (res == 0)                   return message.channel.send(new Discord.RichEmbed().setDescription('Queue cleared.').setColor('2f3136'));
            else if (res == 'no_queue')          return message.channel.send(new Discord.RichEmbed().setDescription('This server\'s queue is already empty.').setColor('ff0000'));
            else if (res == 'no_index')          return message.channel.send('No index provided.');
            else if (res == 'not_found')         return message.channel.send('The song could not be found.');
            else                                 return message.channel.send('An error has occurred.');
        });
    }
}