const Discord = require('discord.js');
const client = require('../../bot').client;

let randomFuncPath = require('../../functions/random.js');
function randomnum(low, high) {
    var output = randomFuncPath.execute(low, high);
    return output;
}

module.exports = {
    name: 'movespam',
    description: 'Rapidly move a target to other voice channels.',
    guildOnly: true,
    syntax: 'movespam [@Member]',
    aliases: ['mspam', 'msp'],
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'MOVE_MEMBERS'],
    cooldown: 6000,
    execute(message, args) {
        let newMember = message.mentions.members.first();

        if (!message.member.permissions.has('MOVE_MEMBERS')) return message.channel.send('You need MOVE_MEMBERS permission to do that.');

        if (!newMember) return message.channel.send('You need to mention someone!');

        if (!newMember.voiceChannel) return message.channel.send('That user is not connected to a voice channel I can see.');

        let channels = [];
        i = 0;
        j = 0;

        message.guild.channels.forEach(channel => {
            let perms = channel.permissionsFor(newMember);
            if (channel.type != 'voice' || !perms.has('CONNECT')) return;
            if (channel != newMember.voiceChannel) {
                if (!(channel.name.toLowerCase().indexOf('\u231b') > -1 || channel.name.startsWith('\u23F3') || channel.name.toLowerCase().indexOf('🔹') > -1)) channels.push(channel.id);
                i = i + 1;
            }
        })

        if (channels.length < 2) return message.channel.send('There are not enough other channels this user can access.');

        message.react('✅');

        for (let x = 0; x < 8; x += 1) {
            newMember.setVoiceChannel(channels[randomnum(0, channels.length - 1)]);
        }
        newMember.setVoiceChannel(newMember.voiceChannel);
    }
}