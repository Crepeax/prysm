const Discord = require('discord.js');

let randomFuncPath = require('../../functions/random.js');
function random(low, high) {
    var output = randomFuncPath.execute(low, high);
    return output;
}

module.exports = {
    name: 'random',
    description: 'Generates a random number.',
	guildOnly: true,
	syntax: 'random [Low] [High]',
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'],
    execute(message, args) {
		const prefix = pre;
		args[2] = Math.round(args[2]);

		let errEmbed = new Discord.RichEmbed()
			.setTitle('Invalid Syntax')
			.setDescription(`Seems like you entered an invalid argument. \nPlease use ${prefix}random <Value 1> <Value 2>`)
			.setColor('ff0000');

		if (args[0] == undefined || args[1] == undefined) {
			message.channel.send(errEmbed);
		} else {

		var sortNumbers = [args[0], args[1]];
		var numbers = [];
		numbers = sortNumbers.sort(function(a, b){return a-b});

		var value1 = numbers[0];
		var value2 = numbers[1];

		number = random(args[0], args[1]);

		if (isNaN(number) == true) {

			message.channel.send(errEmbed);

		} else if (false /*isNaN(args[2]) == false && args[2] > 1 && args[2] < 3*/) {

			return;

			let randomEmbed = new Discord.RichEmbed()
			.setTitle('Random Numbers between ' + value1 + ' and ' + value2)
			.setDescription('Your Numbers are: ' + random(args[0], args[1]) + ' and ' + random(args[0], args[1]))
			.setColor('3333ff');
			message.channel.send(randomEmbed);

		} else if (false /*isNaN(args[2]) == false && args[2] > 2*/) {

			return;

			let waitMessage;

			let waitEmbed = new Discord.RichEmbed()
			.setTitle('Random Numbers between ' + value1 + ' and ' + value2)
			.setDescription('Please wait...')
			.setFooter('This might take up to 10 Seconds.')
			.setColor('ffff00');

			message.channel.send(waitEmbed)
			.then((msg) => {
				waitMessage = msg;
			})
			
			if (args[2] > 100) {
				
				let errEmbed = new Discord.RichEmbed()
				.setTitle('Error: Invalid Arguments')
				.setDescription("You can't generate more than 100 numbers at once.")
				.setTimestamp()
				.setColor('ff0000');
				message.channel.send(errEmbed);

				return;
			}

			var numbers = [];


			setTimeout(function () {
			var i;
			for (i=0; i < args[2]; i++) {

					numbers[i] = random(args[0], args[1]);
				}
			}, 10);
			setTimeout(function () {
			
				var output = numbers.join(', ');

				let test = 'Random Numbers between ' + value1 + ' and ' + value2;
			if (test.length > 250) {
				waitMessage.edit('That number is too long.');
				return;
			}

				let randomEmbed = new Discord.RichEmbed()
				.setTitle('Random Numbers between ' + value1 + ' and ' + value2)
				.setDescription(output)
				.setColor('3333ff');

				waitMessage.edit(randomEmbed);

			}, (args[2] + 6) * 10);

		} else {

			let test = 'Random Number between ' + value1 + ' and ' + value2;
			if (test.length > 250) {
				message.channel.send('That number is too long.');
				return;
			}

			let randomEmbed = new Discord.RichEmbed()
			.setTitle('Random Number between ' + value1 + ' and ' + value2)
			.setDescription('The Number is: ' + number)
			.setTimestamp()
			.setColor('3333ff');
			message.channel.send(randomEmbed)
		}
		}
	}
}