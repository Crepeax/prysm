const Discord = require('discord.js');
const client = require('../../bot').client;
const db = require('../../bot').db;
const fs = require('fs');
const getPrefix = require('../../functions/getPrefix').getPrefix;
const cmdLoader = require('../core/command_loader');

module.exports = {
    name: 'info',
    description: 'Get some information about Prysm.',
    guildOnly: false,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'],
    execute(message, args) {
        const prefix = getPrefix(message.guild);

        let embed = new Discord.RichEmbed()
        .setColor('2f3136')
        .setTitle(`Hey there, ${message.author.username}!`)
        .setDescription(`Here is some information about myself.\nUse the \`${prefix}help\` command to see all my commands.\nJoin the support server [here](https://discord.gg/aTRHKUY).`);

        embed.addField(`Stats`, `Servers: ${db.clientCache.guildSize}\nUsers: ${db.clientCache.userSize}`, true);
        embed.addField(`Commands`, `Commands total: ${cmdLoader.available + cmdLoader.disabled}\nCommands enabled: ${cmdLoader.available}\nCommands ran: ${db.stats.get('total_commands')}`, true);
        embed.addField(`Technical`, `Made with [Discord.js](https://discord.js.org)\nDiscord.js: [ver. ${Discord.version}](https://discord.js.org)\nHosted on [Raspberry Pi](https://www.raspberrypi.org/)`, true);
        embed.addField(`Developer`, `${client.user.username} was made by ${db.botOwner.username}#${db.botOwner.discriminator}.\nThanks for using my bot :)`)

        message.channel.send(embed);
    }
}