const Discord = require('discord.js');
const client = require('../index').client;
const fs = require('fs');
const config = require('../config.json');

module.exports = {
    name: 'unmute',
    description: '',
    syntax: '',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES', 'MANAGE_CHANNELS'],
    cooldown: 1500,
    dev_only: false,
    disabled: false,
    execute(message, args) {

        if (!message.member.permissions.has('MANAGE_ROLES')) return message.channel.send('You need to have "Manage Roles" permission for this.');

        if (!fs.existsSync('guilddata.json')) fs.writeFileSync('guilddata.json', '{}');
        let file = JSON.parse(fs.readFileSync('guilddata.json'));

        let gid = message.guild.id;

        // Fix data if format is incorrect
        if (typeof file[gid] != 'object') file[gid] = {}
            if (typeof file[gid].mutedRole != 'string') {
            if (typeof file[gid].mutedRole == 'number' || typeof file[gid] == 'bigint')
            file[gid].mutedRole = toString(file[gid].mutedRole);
            else file[gid].mutedRole = undefined;
        }
        if (message.guild.roles.get(file[gid].mutedRole) == undefined) file[gid].mutedRole = undefined;

        fs.writeFileSync('guilddata.json', JSON.stringify(file));
        // ------------------------------


        if (!message.mentions.members.first()) return message.channel.send('You need to mention the user you want to unmute.');
        let target = message.mentions.members.first();

        // Check if the target is muted
        if (!target.roles.get(file[gid].mutedRole) || !file[gid].mutedRole) return message.channel.send(new Discord.RichEmbed()
        .setTitle('Unable to unmute')
        .setDescription(`${target.user.username} isn't muted.`)
        .setTimestamp()
        .setFooter(`Invoked by ${message.author.username}`, target.user.avatarURL)
        );


        // Unmute target
        target.removeRole(message.guild.roles.get(file[gid].mutedRole).id).catch(e => {throw e});
        message.channel.send(new Discord.RichEmbed()
        .setTitle('User unmuted')
        .setDescription(`Successfully unmuted ${target.user.username}#${target.user.discriminator}`)
        .setTimestamp()
        .setFooter(`Invoked by ${message.author.username}`, target.user.avatarURL)
        );
    }
}