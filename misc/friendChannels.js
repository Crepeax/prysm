const Discord = require('discord.js');

let randomFuncPath = require('../functions/random.js');
function random(low, high) {
    var output = randomFuncPath.execute(low, high);
    return output;
}

module.exports = {
    /* No idea why I made this */
    name: 'friendChannels',
    execute(oldMember, newMember) {

        let newUserChannel = newMember.voiceChannel;
        let oldUserChannel = oldMember.voiceChannel;

        let channels = {};
        let populatedChannels = [];
        i = 0;
        j = 0;

        newUserChannel.guild.channels.forEach(channel => {
            let perms = channel.permissionsFor(newMember);
            if (channel.type != 'voice' || !perms.has('CONNECT')) return;
            if (channel != newUserChannel && newUserChannel.name.toLowerCase().indexOf('\u231b') > -1) {
                channels[i] = channel.id;
                i = i + 1;
            }
            if (channel.members != undefined) {
            if (channel.members.size > 0 && channel.id != newUserChannel.id) {
                populatedChannels[j] = channel.id;
                j = j + 1;
            }}
        })



        if (populatedChannels[0] != undefined) {

            let targetChannel = populatedChannels[random(0, populatedChannels.length - 1)];

            newMember.setVoiceChannel(targetChannel);
        } else {
            if (oldUserChannel == undefined) {
                newMember.setVoiceChannel(null);
            } else {
                newMember.setVoiceChannel(oldUserChannel);
            }
        }

    }
}