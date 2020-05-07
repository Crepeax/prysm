const Discord = require('discord.js');
const client = require('../index').client;

let permsErrEmbed = new Discord.RichEmbed()
        .setTitle('Insufficient permissions.')
        .setDescription('You need the `Deafen Members` permission to use this command.')
        .setColor('ff0000');

let mentionsErrEmbed = new Discord.RichEmbed()
    .setTitle('Invalid Syntax.')
    .setDescription('You need to @mention someone.')
    .setColor('ff0000');

let tooLow1Embed = new Discord.RichEmbed()
    .setTitle('Your role is too low.')
    .setDescription('Your role is too low to deafen that person.')
    .setColor('ff0000');

let tooLow2Embed = new Discord.RichEmbed()
    .setTitle('My role is too low.')
    .setDescription('I am unable to deafen that person because their highest role is higher than my highest role.')
    .setColor('ff0000');

let noVoiceEmbed = new Discord.RichEmbed()
    .setTitle('That user is not connected to voice.')
    .setDescription('I can only deafen users when they are connected to a voice chat.')
    .setColor('ff0000');

module.exports = {
    name: 'vdeaf',
    description: 'Deafen someone in a voice chat.',
    syntax: 'vdeaf [@Target]',
    guildOnly: true,
    aliases: ['voicefeaf', 'vdeafen', 'voicedeafen'],
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'DEAFEN_MEMBERS'],
    disabled: false,
    execute(message, args) {

        if (!message.member.permissions.has('DEAFEN_MEMBERS')) return message.channel.send(permsErrEmbed);

        if (message.mentions.members.first() == undefined) return message.channel.send(mentionsErrEmbed);

        // if (message.guild.members.get(client.user.id).highestRole.comparePositionTo(message.mentions.members.first().highestRole) > 0 && message.guild.owner.id != message.author.id) return message.channel.send(tooLow2Embed);
// 
        // if (message.member.highestRole.comparePositionTo(message.mentions.members.first().highestRole) > 0 && message.guild.owner.id != message.author.id) return message.channel.send(tooLow1Embed);
        
        if (!message.mentions.members.first().voiceChannel) return message.channel.send(noVoiceEmbed);

        let mute = false;

        if (message.mentions.members.first().serverDeaf == false) mute = true;

        message.mentions.members.first().setDeaf(mute)
        .catch(e => {
            return message.channel.send('An error occured: ' + e);
        });
        message.react('✅');
    }
}