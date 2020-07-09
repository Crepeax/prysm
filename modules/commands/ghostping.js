const Discord = require('discord.js');

module.exports = {
    name: 'ghostping',
	description: 'Instantly deletes your message, which is useful for ghostpinging.',
	aliases: ['gp', 'sgp'],
	syntax: 'gp [@Member]',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS'],
    execute(message, args) {
		if (args[0] == undefined) {
		
				message.delete();

				message.channel.send(`<@${message.author.id}>, you have to mention someone for this command to work!`)
				.then(msg => {
				msg.delete(3000);
			});
		} else if (!message.member.hasPermission('MENTION_EVERYONE')) {
				let invPermsEmbed = new Discord.RichEmbed()
				.setTitle('Insufficient Permissions')
				.setDescription('You aren\'t permitted to ghostping. Bitch.')
				.setFooter('You need the MENTION_EVERYONE permissions for that.')
				.setColor('ff0000');
				message.channel.send(invPermsEmbed);
			} else {
				message.delete();
		}
	}
}