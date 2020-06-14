const Discord = require('discord.js');
const fs = require('fs');

const client = require('../index').client;

let activeOperations = {};

module.exports = {
    name: 'analyze',
    description: 'Create a complete chatlog of the current channel.',
    syntax: 'analyze',
    guildOnly: true,
    aliases: ['chatlog'],
    cooldown: 3600000, // 1 Hour
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY'],
    disabled: true,
    execute(message, args) {

        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('Only Administrators can use this command.');
 
        if (activeOperations[message.guild.id + '/' + message.channel.id] != undefined) return message.channel.send('You are already creating an analysis of this channel! Be patient.');

        activeOperations[message.guild.id + '/' + message.channel.id] = true;

        let startMsg;
        message.channel.send('Analyzing channel...\nDepending on he amount of messages in this channel, this can take a long time: 100 messages need 2 seconds to process.\nI will DM you when I\'m done.').then(m => startMsg = m);

        logStr = '';

        let y = message;
        let x = message.id;
        let a = 0;

        let userStats = {};
        let users = [];

    setInterval(function() {
        let interval = this;
        message.channel.fetchMessages({limit: 100, before: x})
            .then(msgs => {
                msgs.forEach(msg => {
                    a += 1;

                    logStr += `${a}: [${msg.createdAt}] [${msg.author.username}#${msg.author.discriminator} (${msg.author.id})]: ${msg.content}\n`;

                    if (!userStats[msg.author.id]) {userStats[msg.author.id] = 0; users.push(msg.author.id)}

                    userStats[msg.author.id] += 1;

                    if (msg.createdAt < y.createdAt) {y = msg; x = msg.id;}
                })

                if (msgs.size != 100) {
                    clearInterval(interval);

                    let str = '####################################################################################################\n';
                    str += `This is an analysis of your guild ${message.guild.name}'s channel ${message.channel.name}.\n`
                    str += '####################################################################################################\n';
                    str += '\n\n'

                    let cusers = client.users;

                    str += 'Messages per user:\n';

                    let avg = 0;
                    let total = users.length;

                    users.forEach(o => {

                        avg += userStats[o];

                        let name;
                        let disc;
                        if (cusers.get(o) == undefined) {name = 'Unknown'; disc = `0000 [${o}]`} else {name = cusers.get(o).username; disc = cusers.get(o).discriminator}
                        str = str + name + '#' + disc + ': ' + userStats[o] + '\n';
                    })

                    str += '\nAverage messages per user: ' + avg / total + '.\n';
                    str += `Total messages: ${a}\n`;
                    str += 'First message (link): ' + y.url + '\n';

                    str += '\n\nFull message log:\n'
                    str += logStr;
                    if (!fs.existsSync(`./guildAnalysisFiles`)) fs.mkdirSync(`./guildAnalysisFiles`);
                    if (!fs.existsSync(`./guildAnalysisFiles/${message.guild.id}`)) fs.mkdirSync(`./guildAnalysisFiles/${message.guild.id}`);
                    if (!fs.existsSync(`./guildAnalysisFiles/${message.guild.id}/${message.channel.id}`)) fs.mkdirSync(`./guildAnalysisFiles/${message.guild.id}/${message.channel.id}`);
                    if (!fs.existsSync(`./guildAnalysisFiles/${message.guild.id}/${message.channel.id}/${message.id}.txt`)) fs.writeFileSync(`./guildAnalysisFiles/${message.guild.id}/${message.channel.id}/${message.id}.txt`, str);
                    let endMsg;
                    message.channel.send('Here is the finished analysis of this channel.', {file: `./guildAnalysisFiles/${message.guild.id}/${message.channel.id}/${message.id}.txt`}).then(m => message.author.send('I finished the analysis of your channel: ' + m.url));
                    startMsg.delete();       

                    activeOperations[message.guild.id + '/' + message.channel.id] = undefined;

                }
            })
    }, 2000)
    }
}