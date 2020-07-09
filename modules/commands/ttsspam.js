const Discord = require('discord.js');




module.exports = {
    name: 'ttsspam',
    description: 'Honestly, I don\'t even know what this command was supposed to do.',
    guildOnly: true,
    disabled: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'MANAGE_MESSAGES', 'MANAGE_WEBHOOKS', 'SEND_TTS_MESSAGES', 'EMBED_LINKS'],
    aliases: ['tts', 'ttspam'],
    execute(message, args) {

        message.delete();

        var pre = '+';

        const invArgsEmbed = new Discord.RichEmbed()
        .setTitle('TTS Spam')
        .setColor('ffff00')
        .setDescription(`${pre}tts sends a TTS (Text to speech) message. This command is exclusive to Administrators.\nTo send a normal TTS message, use \`${pre}tts [Text]\`.\nTo send a message as someone else begin the message with their name in brackets. Example: \`${pre}tts (Joe) Hello\` will send a TTS message as 'Joe'.\n(The Name can't contain spaces.)`);

        const invPermsEmbed = new Discord.RichEmbed()
        .setTitle('You are not permitted to use this command.')
        .setDescription('I\'m sorry, but only Administrators can use this command.')
        .setColor('ff0000');

        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(invPermsEmbed).then(m => {m.delete(10000);});
        if (!args[0]) return message.channel.send(invArgsEmbed).then(m => {m.delete(60000);});

        let targetName = message.author.username;

        if (args[0].startsWith('(')) {

            for (var i = 0; i < message.content.length; i++) {
                if (message.content.charAt(i) == '(') {
                    nameStart = i;
                }
            }

            for (var i = nameStart + 1; i < message.content.length; i++) {
                if (message.content.charAt(i) == ')') {
                    sendAsSomeoneElse = true;
                    i = message.length;
                } else if (message.content.charAt(i) == ' ') {
                    return message.channel.send('Sorry, you can\'t use spaces in the name. Try using underscores.').then(m => {m.delete(10000);});
                } else {
                targetName += message.content.charAt(i);
                }
              }
              targetName.trimLeft(1);
        }

        let hook;

        if (message.channel.webhooks.first() == undefined) message.channel.createWebhook('TTS Webhook')
        .then(h => {
            hook = message.channel.webhooks.first();
        }); else hook = message.channel.webhooks.first();

        hook.send(message.content);                  // Change this

    }
}