const Discord = require('discord.js');
var hastebin = require("hastebin");

module.exports = {
    name: 'base64',
    description: 'Encode or Decode text in Base64.',
    guildOnly: false,
    syntax: 'base64 [encode/decode] [Text]',
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'],
    aliases: ['base', 'b64'],
    execute(message, args) {

        let invActionEmbed = new Discord.RichEmbed()
        .setTitle('Invalid Arguments')
        .setDescription(`You have to write:\n\`${pre}base64 [encode | en] [message]\` to encode text\n\`${pre}base64 [decode | de] [message]\` to decode text`)
        .setFooter('Encoding/Decoding Files is not supported yet,\nbut will be in a future update. If the output is \ntoo long, you will get a Hastebin Link instead.');

        let invArgsEmbed = new Discord.RichEmbed()
        .setTitle('Invalid Arguments')
        .setDescription(`You have to specify what you want to do! Example: \n\`${pre}base64 encode ABCDEFGH\` \n \`${pre}base64 decode eWVldA==\``)
        .setFooter('Encoding/Decoding Files is not supported yet,\nbut will be in a future update. If the output is \ntoo long, you will get a Hastebin Link instead.');
        if (args[0] == undefined) return message.channel.send(invArgsEmbed);
        if (args[1] == undefined) return message.channel.send(invArgsEmbed);
        let data = args.slice(1).join(' ');
        let buff;
        let output;
        switch(args[0].toLowerCase()) {
            case 'encode':
            case 'enc':
            case 'en':
            case 'e':
                if (args[1] == undefined) return message.channel.send('Invalid');

                buff = Buffer.from(data);
                output = buff.toString('base64');
            break;
            case 'decode':
            case 'dec':
            case 'de':
            case 'd':
                buff = Buffer.from(data, 'base64');
                output = buff.toString('utf-8');
            break;
            default:
            message.channel.send(invActionEmbed);
            return;
            break;
        }

        if (output.length > 2000) {
            hastebin.createPaste(output)
            .then(r => {

                message.channel.send(`Here is the output:\n${r}`);
            })
        } else {
            message.channel.send(output);
        }
    }
}