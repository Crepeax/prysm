const Discord = require('discord.js');

module.exports = {
    name: 'impersonate',
    description: 'Send a message as someone else.',
    syntax: 'sayas [@Member] [Message]',
	aliases: ['imp', 'sayas', 'as'],
    guildOnly: true,
    cooldown: 6000,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'MANAGE_WEBHOOKS', 'MANAGE_MESSAGES', 'EMBED_LINKS'],
    execute(message, args) {

        let invalidSyntaxEmbed = new Discord.RichEmbed()
        .setTitle('Invalid Syntax')
        .setDescription(`Use impersonate <Target> <Message>`)
        .setFooter('You can set the Target either by pinging the User, or by writing his ID.')
        .setColor('ff0000');

        let invalidUserEmbed = new Discord.RichEmbed()
        .setTitle('Invalid User')
        .setDescription('I can\'t find that User in this Guild. ')
        .setFooter('Make sure to mention the User or write his User ID.')
        .setColor('ff0000');

        message.delete();
        if (args[0] == undefined) {
            message.channel.send(invalidSyntaxEmbed);
            return;
        }
        let target;
        if (message.guild.member(args[0].replace(/[\\<>@#&!]/g, ""))) {
            target = bot.users.get(args[0].replace(/[\\<>@#&!]/g, ""));
        } else {
            message.channel.send(invalidUserEmbed);
            return;
        }

        // if (target.id == '284323826165350400') {
        //     message.channel.send(`You can't imitate that person because he is smarter than you!`);
        //     return;
        // }

        let msg = args.slice(1).join(' ');

        if (msg.length < 1) {
            message.channel.send(invalidSyntaxEmbed);
            return;
        }

        function sendHook(webhook) {
            let nick;
            if (bot.guilds.get(message.guild.id).members.get(target.id).nickname == null) nick = target.username; else nick = bot.guilds.get(message.guild.id).members.get(target.id).nickname;
            webhook.send(msg, {
                username: nick,
                avatarURL: target.avatarURL
            });
        }

        message.channel.fetchWebhooks()
        .then(hooks => {
        if (hooks.first() == undefined) {
            message.channel.createWebhook(`${bot.user.username}`, bot.user.avatarURL)
            .then(hook => {
                console.log(hook);
                sendHook(hook);
            })
            .catch(console.error);
        } else sendHook(hooks.first());
    })
    }
}
