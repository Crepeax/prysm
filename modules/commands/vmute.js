const Discord = require('discord.js');
const client = require('../../bot').client;

let permsErrEmbed = new Discord.RichEmbed()
        .setTitle('Insufficient permissions.')
        .setDescription('You need the `Mute Members` permission to use this command.')
        .setColor('ff0000');

let mentionsErrEmbed = new Discord.RichEmbed()
    .setTitle('Invalid Syntax.')
    .setDescription('You need to @mention someone.')
    .setColor('ff0000');

let tooLow1Embed = new Discord.RichEmbed()
    .setTitle('Your role is too low.')
    .setDescription('Your role is too low to mute that person.')
    .setColor('ff0000');

let tooLow2Embed = new Discord.RichEmbed()
    .setTitle('My role is too low.')
    .setDescription('I am unable to mute that person because their highest role is higher than my highest role.')
    .setColor('ff0000');

let noVoiceEmbed = new Discord.RichEmbed()
    .setTitle('That user is not connected to voice.')
    .setDescription('I can only mute users when they are connected to a voice chat.')
    .setColor('ff0000');

module.exports = {
    name: 'vmute',
    description: 'Mute someone in a voice channel.',
    guildOnly: true,
    syntax: 'vmute [@Target]',
    aliases: ['voicemute'],
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'MUTE_MEMBERS'],
    disabled: false,
    execute(message, args) {

        if (!message.member.permissions.has('MUTE_MEMBERS')) return message.channel.send(permsErrEmbed);

        if (message.mentions.members.first() == undefined) return message.channel.send(mentionsErrEmbed);

        // if (message.guild.members.get(client.user.id).highestRole.comparePositionTo(message.mentions.members.first().highestRole) > 0 && message.guild.owner.id != message.author.id) return message.channel.send(tooLow2Embed);
// 
        // if (message.member.highestRole.comparePositionTo(message.mentions.members.first().highestRole) > 0 && message.guild.owner.id != message.author.id) return message.channel.send(tooLow1Embed);
        
        if (!message.mentions.members.first().voiceChannel) return message.channel.send(noVoiceEmbed);

        let mute = false;

        if (message.mentions.members.first().serverMute == false) mute = true;

        message.mentions.members.first().setMute(mute)
        .catch(e => {
            return message.channel.send('An error occured: ' + e);
        });
        message.react('✅');
    }
}