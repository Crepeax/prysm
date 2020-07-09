const Discord = require('discord.js');

module.exports = {
    name: 'clear',
    description: 'Clears a given amount of messages.',
    guildOnly: true,
    syntax: 'clear [Number from 1-100]',
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY'],
    aliases: ['bulkdelete', 'del', 'cl', 'c', 'purge'],
    execute(message, args) {
        const pre = require('../../functions/getPrefix').getPrefix(message.guild);

        if (!(message.member.hasPermission('MANAGE_MESSAGES') || message.member.hasPermission('ADMINISTRATOR'))) {
            let errEmbed = new Discord.RichEmbed()
            .setTitle('Insufficient Permissions')
            .setDescription('You need MANAGE_MESSAGES or ADMINISTRATOR permission to use this command.')
            .setFooter('Please contact an Administrator if you believe that this is a mistake.')
            .setColor('ff0000');
            return (message.channel.send(errEmbed))
        }

        if (args[0] == undefined || isNaN(args[0]) == true) {
            let errEmbed = new Discord.RichEmbed()
            .setTitle('Invalid Arguments.')
            .setDescription(`You have to specify how many Messages you want to delete.\nExample: \`${pre}clear 20\``)
            .setFooter('Please note that you can\'t delete more than 100 Messages at once, or Messages that are older than 14 Days. Messages that are pinned will also be ignored.')
            .setColor('ff0000');
            message.channel.send(errEmbed);
            return;
        } else if (args[0] > 100) {
            let errEmbed = new Discord.RichEmbed()
            .setTitle('Invalid Number.')
            .setDescription('You can\'t delete more than 100 Messages at once.')
            .setColor('ff0000');
            message.channel.send(errEmbed);
            return;
        } else if (args[0] < 1) {
            let errEmbed = new Discord.RichEmbed()
            .setTitle('Stop!')
            .setDescription('No, you can\'t delete less than one Message at once.')
            .setColor('ff0000');
            message.channel.send(errEmbed);
            return;
        } else {
            if (Math.floor(args[0]) == 100) args[0] = 99;

            let targets = [];
            var i = 0;

            var count = Math.floor(args[0]) + 1;
            let now = new Date();
            let failedAttempt = false;
            let failedMessages = 0;

            message.channel.fetchMessages({limit: count})
            .then(mesg => {
                mesg.forEach(msg => {
                if (!msg.pinned) {
                    if (now - msg.createdTimestamp >= 1209600000) {
                        failedAttempt = true;
                        failedMessages = failedMessages + 1;
                    } else {
                    targets[i] = msg;
                    i = i + 1;
                    }
                }
                })
                message.channel.bulkDelete(targets);
                if (failedAttempt) {
                let errEmbed = new Discord.RichEmbed()
                    .setTitle('I couldn\'t delete some messages.')
                    .setDescription(`I couldn't delete ${failedMessages} messages because they were more than 14 days old.`)
                    .setFooter('Due to limitations on Discord\'s end, I am not able to clear messages that are older than 14 days.')
                    .setColor('ff0000');
                    message.channel.send(errEmbed)
                    .then(msg => {msg.delete(15000)});
                }
            });
    }
    }
}