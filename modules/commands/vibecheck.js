const Discord = require('discord.js');

let randomFuncPath = require('../../functions/random.js');
function random(low, high) {
    var output = randomFuncPath.execute(low, high);
    return output;
}

module.exports = {
    name: 'vibecheck',
    description: '***V  I  B  E  C  H  E  C  K***',
    aliases: ['vc'],
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'MANAGE_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'],
	guildOnly: false,
	cooldown: 5000,
    execute(message, args) {
let attachment = new Discord.Attachment('./images/vibecheck.gif', 'vibecheck.gif');
		let attachment_failed = new Discord.Attachment('./images/vibecheck_failed.png', 'failed.png');
		let attachment_passed = new Discord.Attachment('./images/vibecheck_passed.png', 'passed.png');
		let vibeCheckEmbed = new Discord.RichEmbed()
		.setTitle(`**V I B E  C H E C K**`)
		.setColor('ffff00')
		.attachFile(attachment)
		.setImage('attachment://vibecheck.gif');
		let vibeCheckFailedEmbed = new Discord.RichEmbed()
		.setTitle(`**V I B E  C H E C K**`)
		.setColor('ff0000')
		.attachFile(attachment_failed)
		.setImage('attachment://failed.png');
		let vibeCheckPassedEmbed = new Discord.RichEmbed()
		.setTitle(`**V I B E  C H E C K**`)
		.setColor('00ff00')
		.attachFile(attachment_passed)
		.setImage('attachment://passed.png');
		message.delete();
		message.channel.send(vibeCheckEmbed)
		.then(msg => {
			setTimeout(function() {
			if (random(1, 2) == 1) {
				message.channel.send(vibeCheckFailedEmbed)
				.then(mesg => {
					mesg.delete(60000);
				});
			} else {
				message.channel.send(vibeCheckPassedEmbed)
				.then(mesg => {
					mesg.delete(60000);
				});
			}
			msg.delete();
		}, 5000);
        })
    }
}