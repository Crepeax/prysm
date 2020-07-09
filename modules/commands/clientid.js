const Discord = require('discord.js');

module.exports = {
    name: 'clientid',
    description: 'Returns your Account\'s Client ID.',
    aliases: ['cid'],
    syntax: 'clientid [Optional: @User]',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES'],
    execute(message, args) {
        if (!message.mentions.users.first()) {
        message.channel.send('Your Client ID is ' + message.member.id);
        } else {
            message.channel.send(`${message.mentions.users.first().username}'s Client ID is ${message.mentions.users.first().id}`)
        }
    }
}