const Discord = require('discord.js');
const client = require('../../bot').client;

const autoroles = require('../../functions/autoroles');

module.exports.run = function() {
    // Give roles to new members
    client.on('guildMemberAdd', member => {
        autoroles.giveRoles(member.guild, member.user);
    });
}

module.exports.meta = {
    name: 'event_handler',
    priority: 4
}