const Discord = require('discord.js');

module.exports = {
    name: 'channelManager',
    execute(oldMember, newMember) {

        let newUserChannel = newMember.voiceChannel;
        let oldUserChannel = oldMember.voiceChannel;

        if (newUserChannel != undefined) {
        if (newUserChannel.name.toLowerCase().indexOf('\u231b') > -1) {
            let exec = c.misc.get('tempChannels');
            exec.execute(oldMember, newMember);
        }}

        if (oldUserChannel != undefined) {
        if (oldUserChannel.name.startsWith('\u23F3')) {
            let exec = c.misc.get('tempChannels');
            exec.execute(oldMember, newMember);
        }}

        //if (newUserChannel != undefined) {
        //    if (newUserChannel.name.toLowerCase().indexOf('🔹') > -1) {
        //        let exec = c.misc.get('friendChannels');
        //        exec.execute(oldMember, newMember);
        //    }
        //}
    }
}