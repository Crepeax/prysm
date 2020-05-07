const Discord = require('discord.js');
const fs = require('fs');
const config = require('../config.json');


const alreadyRegistered = new Discord.RichEmbed()
.setTitle('You are already registered!')
.setDescription('Seems like you are already on my list.')
.setColor('ff0000');

const alreadyUnregistered = new Discord.RichEmbed()
.setTitle('You are not registered.')
.setDescription('I can\'t find you on my List.')
.setColor('ff0000');

const registered = new Discord.RichEmbed()
.setTitle('Registered')
.setDescription('You will now receive a message when I get a new Update and other important messages regarding this Bot!')
.setColor('00ff00');

const unregistered = new Discord.RichEmbed()
.setTitle('Unregistered')
.setDescription('I will no longer send you important messages.')
.setColor('ff0000');

const invalidSyntax = new Discord.RichEmbed()
.setTitle('Be the first to try out new Features!')
.setDescription('Register yourself to get a Message when I get a new Update and be the first to try out new Features!')
.addField(`${config.prefix}notify register`, 'Register for announcements and updates')
.addField(`${config.prefix}notify leave, ${config.prefix}notify unregister`, 'Opt-Out of these Notifications.')
.setColor('2f3136');

module.exports = {
    name: 'newsletter',
    description: 'Register for Announcements and Updates regarding this Bot',
    syntax: 'newsletter [register/unregister]',
    guildOnly: false,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'],
    aliases: ['notify'],
    cooldown: 2500,
    execute(message, args) {
        let newsletter = JSON.parse(fs.readFileSync("./newsletter.json", "utf8"));

        if (args[0] == 'register') {
        if (newsletter.newsletter.indexOf(message.author.id) > -1) {
            message.channel.send(alreadyRegistered);
            return;
        }
        newsletter.newsletter.push(message.author.id);
        message.channel.send(registered);
    } else if (args[0] == 'leave' || args[0] == 'unregister') {
        if (!(newsletter.newsletter.indexOf(message.author.id) > -1)) {
            message.channel.send(alreadyUnregistered);
            return;
        }
        newsletter.newsletter.splice(newsletter.newsletter.indexOf(message.author.id), 1);
        message.channel.send(unregistered);
    } else {
        message.channel.send(invalidSyntax);
        return;
    }

        fs.writeFileSync('./newsletter.json', JSON.stringify(newsletter));
    }
}