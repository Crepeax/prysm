const Discord = require('discord.js');
const client = require('../../bot').client;
const math = require('mathjs');

module.exports = {
    name: 'calc',
    description: '',
    syntax: '',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'],
    cooldown: 1500,
    dev_only: false,
    disabled: false,
    execute(message, args) {
        if (!args[0]) return message.channel.send('You need to provide a calculation!');

        if (args.join(' ').length > 1024) return message.channel.send('The expression may not exceed 1024 characters.');

        let startingTime = Date.now();

        let res;
        try {
            res = math.evaluate(args.join(' '));

        if (res.length > 1024) throw 'The result is too large to display.';
        } catch (e) {

            let endingTime = Date.now();

            let embed = new Discord.RichEmbed()
                .setTitle('Calculation')
                .setDescription('An error has occurred.')
                .addField('Expression', `\`\`\`js\n${args.join(' ')}\`\`\``)
                .addField('Error', `\`\`\`js\n${e}\`\`\``)
                .setFooter(`Calculation completed in ${endingTime - startingTime} ms`)
                .setColor('2f3136');

            return message.channel.send(embed);
        }

        let endingTime = Date.now();

        let embed = new Discord.RichEmbed()
            .setTitle('Calculation')
            .addField('Expression', `\`\`\`js\n${args.join(' ')}\`\`\``)
            .addField('Result', `\`\`\`js\n${res}\`\`\``)
            .setFooter(`Calculation completed in ${endingTime - startingTime} ms`)
            .setColor('2f3136')

        message.channel.send(embed);
    }
}