const Discord = require('discord.js');
const config = require('../../config.json');
const getPrefix = require('../../functions/getPrefix').getPrefix;

module.exports = {
    name: 'invisname',
    description: 'Set an invisible symbol as your nickname.',
    guildOnly: true,
    syntax: `invisname or ${config.prefix}invisname set`,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'MANAGE_NICKNAMES'],
    execute(message, args) {
        const prefix = getPrefix(message.guild);
        if (!message.member.hasPermission('CHANGE_NICKNAME')) return message.channel.send('You are not permitted to use this command.');

        if (args[0] == undefined) args[0] = "";
        if (args[0] == 'set') {
            target = message.member;
            target.setNickname('͔')
            .then(() => {
                message.channel.send('Done!');
            })
            .catch(() => {
                message.channel.send('I am unable to change your nickname. You can manually copy and paste the following message to your username:');
                message.channel.send('`͔`');
            })
        } else {
            message.channel.send('Copy and paste the following message to someone\'s username: (You can write `' + prefix + 'invisname set` to set your own name)');
            message.channel.send('`͔`');
        }
    }
}