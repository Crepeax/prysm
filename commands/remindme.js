const Discord = require('discord.js');
const fs = require('fs');
const config = require('../config.json');

module.exports = {
    name: 'remindme',
    description: 'Reminds you to do something after a specific time period.',
    syntax: 'remindme [Time] [Text]',
    guildOnly: false,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'],
    aliases: ['remind', 'reminder', 'reminders'],
    cooldown: 5000,
    execute(message, args) {

if (!args[0]) args[0] = '';

        if (args[0].toLowerCase() == 'delall'
        ||  args[0].toLowerCase() == 'deleteall'
        ||  args[0].toLowerCase() == 'deleteall'
        ) {
            require('../reminders').delAllReminders(message.author);
            return message.channel.send('Deleted all reminders.');
        }

        if (args[0].toLowerCase() == 'help') {
            let embed = new Discord.RichEmbed()
            .setTitle('Remind me')
            .setDescription(`Sends you a message after a specific amount of time.`)
            .addField(`Setting a reminder`, `To set a reminder, simply type \`${config.prefix}remindme [Time] [Text]\`. \nExample: \`${config.prefix}remindme 10m Call Bob\``, false)
            .addField(`Deleting all reminders`, `To delete all reminders, simply type \`${config.prefix}remindme deleteall\`.`, false)
            .setColor('2f3136');
            return message.channel.send(embed);
        }

        if (!args[1]) return message.channel.send(`Usage: ${config.prefix}remindme [Time] [Reminder]\nExample: ${config.prefix}remindme 30m Call Bob\nFor more info, use ${config.prefix}remindme help.`);

        var returntime;
		var timemeasure;
		msg = message.content.split(' ');

		// Sets the return time
		timemeasure = msg[1].substring((msg[1].length - 1), (msg[1].length))
		returntime = msg[1].substring(0, (msg[1].length - 1))

		// Based off the delimiter, sets the time
		switch (timemeasure.toLowerCase()) {
			case 's':
            case 'second':
            case 'seconds':
				returntime = returntime * 1000;
				break;

			case 'm':
            case 'min':
            case 'minute':
            case 'minutes':
				returntime = returntime * 1000 * 60;
				break;

			case 'h':
			case 'hour':
            case 'hours':
				returntime = returntime * 1000 * 60 * 60;
				break;

			case 'd':
			case 'day':
			case 'days':
				returntime = returntime * 1000 * 60 * 60 * 24;
				break;

			default:
				return message.channel.send(`Invalid time: Use one of the following timestamps: [10s/10m/10h/10d]\nExample: ${config.prefix}remindme 5m Change avatar`);
        }

        let file = JSON.parse(fs.readFileSync(`./reminders.json`));

        if (file[message.author.id]) if (file[message.author.id].size >= 5) return message.channel.send('You can\'t have more then 5 reminders at once.');

        msg.shift();
        msg.shift();

        const now = Date.now();

        console.log(now);

        require('../reminders').setReminder(message.author, returntime + now, msg.join(' '), message);
    }
}