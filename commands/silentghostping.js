const Discord = require('discord.js');

module.exports = {
    name: 'silentghostping',
	description: 'Ghostping, without the \'Someone just got ghostpinged\' message.',
	aliases: ['sgp', 'silentgp', 'sghostping'],
	syntax: 'sgp [@Member]',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS'],
    execute(message, args) {
		if (args[0] == undefined) {
		
				message.delete();

				message.channel.send(`<@${message.author.id}>, you have to mention someone for this command to work!`)
				.then(msg => {
				msg.delete(3000);
			});
		} else if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.hasPermission('MANAGE_MESSAGES')) {
				let invPermsEmbed = new Discord.RichEmbed()
				.setTitle('Insufficient Permissions')
				.setDescription('You aren\'t permitted to ghostping. Bitch.')
				.setFooter('You need ADMINISTRATOR permissions for that.')
				.setColor('ff0000');
				message.channel.send(invPermsEmbed);
			} else {
				message.delete();
		}
	}
}