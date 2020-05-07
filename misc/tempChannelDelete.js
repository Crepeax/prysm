const Discord = require('discord.js');

module.exports = {
    name: 'tempDelete',
    execute(oldMember, newMember) {
        
        let newUserChannel = newMember.voiceChannel;
        let oldUserChannel = oldMember.voiceChannel;
        
        if (oldUserChannel.name.startsWith('\u23F3')) {
            
            if (oldUserChannel.members.size < 1) {
                try {
                oldUserChannel.delete();
                } catch {
                try {
                    oldUserChannel.delete()
                } catch {
                    newMember.sendMessage(`Hey, I have Problems deleting your channel. Please ask an Administrator to delete the Channel manually. If this keeps happening, check the Bot's permissions and contact me using ${prefix}feedback. Thank you! \nHere is the full error: \n${Error}`);
                }}
            }
        }
    }
}