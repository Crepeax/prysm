const Discord = require('discord.js');

const bot = require('../index').client;

module.exports = {
    name: 'tempCreate',
    execute(oldMember, newMember) {
        let newUserChannel = newMember.voiceChannel;
        let oldUserChannel = oldMember.voiceChannel;
if (newUserChannel.name.toLowerCase().indexOf('\u231b') > -1) {
    newUserChannel.guild.createChannel(`\u23F3 [${newMember.user.username}]`, {
        type: "voice", 
        parent: newUserChannel.parentID
    })
    .then(channel => {
        channel.overwritePermissions(newMember, {
            MANAGE_ROLES_OR_PERMISSIONS: false,
            MANAGE_CHANNELS: false,
            CREATE_INSTANT_INVITE: false,
            MANAGE_WEBHOOKS: true,
            VIEW_CHANNEL: true,
            CONNECT: true,
            SPEAK: true,
            MUTE_MEMBERS: true,
            DEAFEN_MEMBERS: true,
            MOVE_MEMBERS: true,
            USE_VAD: true,
            PRIORITY_SPEAKER: true
        });
        channel.overwritePermissions(newMember.guild.defaultRole.id, {
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES_OR_PERMISSIONS: false,
            MANAGE_WEBHOOKS: false,
            PRIORITY_SPEAKER: false
        });
        newMember.setVoiceChannel(channel);
        });
}}}