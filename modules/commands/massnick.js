const Discord = require('discord.js');
const config = require('../../config.json');
const client = require('../../bot').client;

module.exports = {
    name: 'massnick',
    description: 'Sets the Nickname of every User in the Guild to a specific Name. Can only affect Users lower than the Bot.',
    aliases: ['mn', 'nickall'],
	guildOnly: true,
	syntax: 'massnick [set/reset] [New name]',
	perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'MANAGE_NICKNAMES', 'EMBED_LINKS'],
	cooldown: 30000,
    execute(message, args, prefix) {

		if (message.guild.members.size > 50) {
			let embed = new Discord.RichEmbed()
			.setTitle('Your server is too large.')
			.setDescription('Due to performance reasons, this command is not available on guilds that have more than 50 members.')
			.setColor('9421ee');
			message.channel.send(embed);
			return;
		}

        let errDeniedEmbed = new Discord.RichEmbed()
					.setTitle('Insufficient permission')
					.setDescription(`You aren't permitted to use this command.`)
					.setFooter(`You need ADMINISTRATOR or MANAGE_NICKNAMES permission to use this command.`)
					.setColor('ff0000');


					if ((message.member.hasPermission("MANAGE_NICKNAMES") || message.member.hasPermission("ADMINISTRATOR"))) {
						switch (args[0]) {
							case 'set':

									var members = message.guild.members.array();
									let newName = args.slice(1).join(' ');
									if (newName.length > 32) {
										let errToLongEmbed = new Discord.RichEmbed()
										.setTitle('Too long')
										.setDescription('The length of the name must be 32 or fewer.')
										.setColor('ff0000');
										message.channel.send(errToLongEmbed);
										break;
									}
									var permissionError = 0;
									var otherError = 0;

									if (args.length > 1) {
										let warnEmbed = new Discord.RichEmbed()
										.setTitle('Mass nick started.')
										.setDescription(`Renaming ${members.length} users to ${newName}. This might take a while.`)
										.setColor('ffff00');
										message.channel.send(warnEmbed);

									
									members.forEach(Element => {
										Element.setNickname(newName)
										.catch(error => {
											if (error == 'DiscordAPIError: Missing Permissions') {
												permissionError++;
											} else if (error != undefined) {
												otherError++;
											}
											
										
										});
										
									})
								} else {
									let errEmbed = new Discord.RichEmbed()
									.setTitle('Invalid Arguments')
									.setDescription(`Use ${config.prefix}massnick help for more information.`)
									.setColor('ff0000');
									message.channel.send(errEmbed);
								}
							break;
							case 'reset':
								var members = message.guild.members.array();
								let warnEmbed = new Discord.RichEmbed()
										.setTitle('Mass reset started.')
										.setDescription(`Resetting username of ${members.length} users. This might take a while.`)
										.setColor('ffff00');
										message.channel.send(warnEmbed);

										var permissionError = 0;
										var otherError = 0;
								
								members.forEach(Element => {
									Element.setNickname('')
									.catch(error => {
										if (error == 'DiscordAPIError: Missing Permissions') {
											permissionError++;
										} else if (error != undefined) {
											otherError++;
										}
									})
								})
								
							break;
							case 'help':
								let massnickhelpembed = new Discord.RichEmbed()
								.setTitle('Massnick help')
								.addField(`${config.prefix}massnick set <username>`, 'Set the username of every user on the Server.')
								.addField(`${config.prefix}massnick reset`, 'Reset the username of every user on the Server.')
								.setFooter('Massnick changes the username of every person in the server to a specific name. Requires ADMINISTRATOR or MANAGE_USERNAMES permission.')
								.setColor('#8648E4');
								message.channel.send(massnickhelpembed);
							break;
							default:
								let embed = new Discord.RichEmbed()
								.setTitle('Invalid Arguments')
								.setDescription(`Type ${config.prefix}massnick help for a list of valid commands.`)
								.setColor('ff0000');
								message.channel.send(embed);
							break;
						}
					} else if (!(message.member.hasPermission("MANAGE_NICKNAMES") || message.member.hasPermission("ADMINISTRATOR"))) {
						message.channel.send(errDeniedEmbed);
					} else {
						message.channel.send(`Error: Permission check failed. Please contact the Developer of this bot using ${config.prefix}feedback.`);
					}

	
    }
}