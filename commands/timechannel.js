const Discord = require('discord.js');
const fs = require('fs');
const config = require('../config.json');

let replies = {}

    replies.clockSymbol = new Discord.Attachment('./images/clock_symbol.png', 'clock.png');
    replies.invArgs = new Discord.RichEmbed()
    .setTitle('Clock channels!')
    .setDescription(`These channels will automatically display the current time and date. \nUsage: \`${config.prefix}tc [time/date] [create/delete]\`\nWarning: these channels will flood your audit log.\nOnly Administrators will be able to use this command.`)
    .setColor('2f3136')
    .setFooter('You can always remove these channels, using a command or just by deleting the channel itself.')
    .attachFile(replies.clockSymbol)
    .setThumbnail('attachment://clock.png');

    replies.alreadyExists = new Discord.RichEmbed()
    .setTitle('Hmm...')
    .setDescription('This channel already exists. If you\'re having problems, try deleting it.')
    .setColor('ff0000');

    replies.alreadyDeleted = new Discord.RichEmbed()
    .setTitle('Hmm...')
    .setDescription('There is no channel I could delete.')
    .setColor('ff0000');

    replies.invPerms = new Discord.RichEmbed()
    .setTitle('Hey!')
    .setDescription('Only Administrators are able to use this command.')
    .setColor('ff0000');

module.exports = {
    name: 'timechannel',
    description: 'Creates a channel that displays the current time or date.',
    syntax: '[time/clock] [create/delete]',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'MANAGE_CHANNELS', 'EMBED_LINKS'],
    aliases: ['tc', 'clockchannel', 'timechannels', 'clockchannels'],
    cooldown: 2000,
    execute(message, args) {

        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(replies.invPerms);

        let file = JSON.parse(fs.readFileSync("./clock-channels.json", "utf8"));

        function makeChannel() {
            if (target == undefined) return;

            if (target[message.guild.id] != undefined) {
                if (message.guild.channels.get(target[message.guild.id]) == undefined) {
                    target[message.guild.id] == undefined;
                } else {
                    return message.channel.send(replies.alreadyExists);
                }
            }
            message.guild.createChannel(`[${targetName}]`, {
                type: "voice", 
            })
            .then(channel => {
                channel.overwritePermissions(message.guild.defaultRole, {
                    CONNECT: false,
                });
            target[message.guild.id] = channel.id;
            fs.writeFileSync('./clock-channels.json', JSON.stringify(file));
            });
            message.react('✅');
        }

        function delChannel() {
            if (target == undefined) return;

            if (target[message.guild.id] == undefined) return message.channel.send(replies.alreadyDeleted);
            if (message.guild.channels.get(target[message.guild.id]) == undefined) {
                message.channel.send(replies.alreadyDeleted);
                target[message.guild.id] = undefined;
                fs.writeFileSync('./clock-channels.json', JSON.stringify(file));
            }
            if (message.guild.channels.get(target[message.guild.id])) message.guild.channels.get(target[message.guild.id]).delete();
            target[message.guild.id] = undefined;
            fs.writeFileSync('./clock-channels.json', JSON.stringify(file));
            message.react('✅');
        }

        if (!args[0]) return message.channel.send(replies.invArgs);
        if (!args[1]) return message.channel.send(replies.invArgs);

let target;
let targetName;

        switch(args[0]) {
            case 'time':
            case 'clock':
                target = file.time;
                targetName = 'Clock';
            break;

            case 'date':
                target = file.date;
                targetName = 'Date';
            break;

            default: return message.channel.send(replies.invArgs);
        }

        switch(args[1].toLowerCase()) {
            case 'create':
            case 'make':
                makeChannel();
            break;
                delChannel();
            case 'remove':
            case 'delete':
            case 'destroy':
                delChannel();
            break;

            default: return message.channel.send(replies.invArgs);
        }
    }
}