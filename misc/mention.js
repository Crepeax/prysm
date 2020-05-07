const Discord = require('discord.js');
const config = require('../config.json')

module.exports = {
    name: 'mention',
    execute(message) {
        message.channel.send(`Hey! My prefix is \`${config.prefix}\`!\nTo see what I can do, type \`${config.prefix}help\`\nFor some additional information about me, type \`${config.prefix}info\`.`)
    }
}