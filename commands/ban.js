const Discord = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bans a User from the Server. You need to have a Role higher than the Target.',
	guildOnly: true,
	syntax: 'ban [User] [Reason]',
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'BAN_MEMBERS', 'EMBED_LINKS'],
	aliases: ['permasnap'],
    execute(message, args) {

let member = message.mentions.members.first();

		if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.hasPermission('BAN_MEMBERS')) {
			let embed = new Discord.RichEmbed()
			.setTitle('Insufficient Permission')
			.setDescription('You are not permitted to use this command.')
			.setFooter('You need ADMINISTRATOR or BAN_MEMBERS permissions to use this command.')
			.setColor('ff0000');
			message.channel.send(embed);
			return;
		} else if (!member) {
			let embed = new Discord.RichEmbed()
			.setTitle('Invalid Arguments')
			.setDescription('You have to mention the user you want to ban!')
			.setColor('ff0000');
			message.channel.send(embed);
		} else if (member.id == user.id) {
			let embed = new Discord.RichEmbed()
			.setTitle("Nice try...")
			.setColor('ff0000');
			message.channel.send(embed);
		} else if (member.user.bot == true) {
			let embed = new Discord.RichEmbed()
			.setTitle("I can't ban other bots!")
			.setColor('ff0000');
			message.channel.send(embed);
			return;
		} else if (!member.kickable) {
			let embed = new Discord.RichEmbed()
			.setTitle('Insufficient Permission')
			.setDescription('I am unable to ban that member!')
			.setColor('ff0000');
			message.channel.send(embed);
		} else if (message.author.id == member.id) {

			let embed = new Discord.RichEmbed()
			.setTitle(`You can't ban yourself!`)
			.setColor('ff0000');
			message.channel.send(embed);

		} else if (!(message.member.highestRole.comparePositionTo(message.mentions.members.first().highestRole) > 0) && message.guild.owner.id != message.author.id) {
			let embed = new Discord.RichEmbed()
			.setTitle('Insufficient Permission')
			.setDescription(`That person's highest role is higher than yours.`)
			.setFooter(`You can't ban that person.`)
			.setColor('ff0000');
			message.channel.send(embed);
			return;
		} else {
			let reason = args.slice(1).join(' ');
			if (!reason) { reason = ('banned by user ' + message.author.username);
		} else reason = ('Banned by user ' + message.author.username + ' for reason: ' + reason);
			member.ban(reason)
			.catch(error => message.reply(`An error occured:: ${error}`));
			let embed = new Discord.RichEmbed()
			.setTitle('User banned!')
			.setFooter(reason)
			.setColor('00ff00');
			message.channel.send(embed);
        }
    }
}