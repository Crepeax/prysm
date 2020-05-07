const Discord = require('discord.js');

const permArray = [
    'ADMINISTRATOR',
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS'
];

module.exports = {
    name: 'perms',
    description: 'See your own or someone else\'s permissions in a guild.',
    guildOnly: true,
    syntax: 'perms [Optional: @Member]',
    aliases: ['permissions', 'permission'],
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'],
    execute(message, args) {

        // if (!message.member.permissions.has('MANAGE_ROLES')) return message.channel.send('You need `MANAGE_ROLES` or `ADMINISTRATOR` permission to use this command.');

        let target = message.author;
        let targetMember = message.member;

        if (message.mentions.users.first() != undefined) target = message.mentions.users.first();
        if (message.mentions.members.first() != undefined) targetMember = message.mentions.members.first();

        let permsStr = '\n';
        let rolesStr = `${target.username} has the following roles:\n`;

        permArray.forEach(p => {
            function check() {if (bot.guilds.get(message.guild.id).members.get(target.id).permissions.hasPermission(p)) return '✅ '; else return '❌ '}
            permsStr = permsStr + check() + '`' + p + '`\n';
        })

        let i = 0;
        targetMember.roles.forEach(r => {
            if (r != message.guild.roles.defaultRole)  {rolesStr = rolesStr + r + '\n'; i++;}
        });

        if (i == 1 || i == 0) rolesStr = `${target.username} has no roles in this guild.`;


        let embed = new Discord.RichEmbed()
        .setTitle(`${target.username}'s permissions`)
        .setDescription(`${target.username} has the following permissions:${permsStr}\n${rolesStr}`)
        .setColor('00ff00');

        message.channel.send(embed);

    }
}