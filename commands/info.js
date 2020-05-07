const Discord = require('discord.js');
const index = require('../index');
const client = index.client;
const fs = require('fs');

module.exports = {
    name: 'info',
    description: 'Get some information about Prysm.',
    guildOnly: false,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'],
    execute(message, args) {
        let embed = new Discord.RichEmbed()
        .setColor('2f3136')
        .setTitle(`Hey there, ${message.author.username}!`)
        .setDescription(`Here is some information about myself.\nUse the \`${pre}help\` command to see all my commands.\nJoin the support server [here](https://discord.gg/aTRHKUY).`);

        embed.addField(`Stats`, `Servers: ${client.guilds.size}\nUsers: ${client.users.size}`, true);
        embed.addField(`Commands`, `Commands total: ${index.commands_total}\nCommands enabled: ${index.commands_loaded}\nCommands ran: ${JSON.parse(fs.readFileSync("./stats.json", "utf8")).messages_total}`, true);
        embed.addField(`Technical`, `Made with [Discord.js](https://discord.js.org)\nDiscord.js: [ver. ${Discord.version}](https://discord.js.org)\nHosted on [Raspberry Pi](https://www.raspberrypi.org/)`, true);
        embed.addField(`Developer`, `${client.user.username} was made by ${client.users.get('284323826165350400').username}#${client.users.get('284323826165350400').discriminator}.\nThanks for using my bot :)`)

        message.channel.send(embed);
    }
}