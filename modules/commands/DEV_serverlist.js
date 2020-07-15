const Discord = require('discord.js');
const client = require('../../bot').client;

module.exports = {
    name: 'serverlist',
    flag: 1000,
    execute(message, args) {
        if (!require('../core/login').testingMode) return message.channel.send('For privacy reasons, this is only available in testing mode.');

        let serverlist = [];
        var i = 0;
        client.guilds.forEach(function(Element) {
           serverlist[i] = Element.name;
           i++;
        });
        let servers = serverlist.join('\n');
        let serverlistEmbed = new Discord.RichEmbed()
        .setTitle('Server List')
        .setDescription(servers)
        .setFooter('I am currently on ' + serverlist.length + ' Servers!')
        .setColor('3333ff');
        message.channel.send(serverlistEmbed);
    }
}

module.exports.devCommand = true;