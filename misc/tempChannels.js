const Discord = require('discord.js');

const bot = require('../index').client;

module.exports = {
    name: 'tempChannels',
    execute(oldMember, newMember) {

        if (!bot.guilds.get(newMember.guild.id).members.get(bot.user.id).permissions.has('ADMINISTRATOR')) {
                if (newMember.user.bot) return;
                return newMember.send(`Hey, I am missing permissions to create/delete temporary channels. Please inform an Administrator that to ensure voice channels get created and deleted correctly, I require \`Administrator\` permissions.\nSorry for the inconvenience.`);
            }

        let newUserChannel = newMember.voiceChannel;
        let oldUserChannel = oldMember.voiceChannel;
        if(oldUserChannel !== newUserChannel && newUserChannel !== undefined) {
            try {
            // User Joins a voice channel
            let exec = c.misc.get('tempCreate');
            exec.execute(oldMember, newMember);
        } catch {console.error(Error)}
         } 
         if (oldUserChannel == undefined) return;
        if(newUserChannel == undefined || oldUserChannel.name.startsWith('\u23F3')) {
            try {
           // User leaves a voice channel
            let exec = c.misc.get('tempDelete');
            exec.execute(oldMember, newMember);
            
        } catch {console.error(Error)}
    
        }
    }
}