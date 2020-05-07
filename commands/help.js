const Discord = require('discord.js');
var embedColor = '2f3136';
const client = require('../index').client;
const config = require('../config.json');

let activeHelpWindows = {};

module.exports = {
	name: 'help',
	syntax: `help or ${config.prefix}help commands or ${config.prefix}help [Command name]`,
	guildOnly: false,
	cooldown: 3000,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'ADD_REACTIONS', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY'],
    execute(message, args) {

		let prefix = config.prefix;

		if (!args[0]) {

			if (message.guild) {
				if (!activeHelpWindows[message.channel.id]) activeHelpWindows[message.channel.id] = [];
				if (!activeHelpWindows[message.channel.id][message.author.id]) activeHelpWindows[message.channel.id][message.author.id] = null;

				if (activeHelpWindows[message.channel.id][message.author.id] != null) {
						message.channel.fetchMessage(activeHelpWindows[message.channel.id][message.author.id]).then(msg => {
						activeHelpWindows[message.channel.id][message.author.id] = null;
						if (msg == undefined) throw console.error('Invalid message ID.');
						
						msg.delete();
						activeHelpWindows[message.channel.id][message.author.id] = null;
					})
				};
			}

			let footerText = `This help window was requested by ${message.author.username}.`;

			let cooldown = false;
			function setCooldown() {
				cooldown = true;
				setTimeout(function() {
					cooldown = false;
				}, 2000)
			}
        	const embed = new Discord.RichEmbed()
			.setColor(embedColor)
			.setTitle('❔ Prysm Help')
			.setDescription(`Please select the category you want to see:\n⚒️ → Moderation\n💬 → Chat\n🧿 → Passive Skills\n🌀 → Miscellaneous\n🖼️ → Images\n🔱 → Annoying stuff\n🎵 → Music\n🤖 → Bot related stuff\n❔ → Show this page\n❌ → Delete this message\n\n⚙️ To see the details of a specific\ncommand, type ${config.prefix}help commands.`)
			.setFooter(`Use the reactions below, ${message.author.username}.`)
			.setTimestamp();

			let embeds = {};
//    																											 .addField(`${prefix}`, ``, true)
			embeds.moderation = new Discord.RichEmbed()
				.setTitle('⚒️ Prysm Help - Moderation')
				.setDescription(`You can only use these commands if you have the corresponding permission \n(Kick, Ban, Manage Nicknames, etc).`)
				.addField(`${prefix}\`kick\`, \`snap\`, \`remove\``, `Kicks a member from the server.`, true)
				.addField(`${prefix}\`ban\`, \`permasnap\``, `Bans a member from the server.`, true)
				.addBlankField(true)
				.addField(`${prefix}\`memberlist\``, `Lists all users in the server.`, true)
				.addField(`${prefix}\`massnick\`, \`mn\`, \`nickall\``, `Change everyone's nickname at once.`, true)
				.addBlankField(true)
				.addField(`${prefix}\`clear\`, \`purge\`, \`cl\``, `Deletes a specified amount of messages, up to 100 at once. The user needs \`DELETE_MESSAGES\` permission.`, true)
				.addField(`${prefix}\`timechannel\`, \`tc\``, `Create channels that display the current time or date. Usage: \`${prefix}tc [time/date] [create/delete]\``, true)
				.addBlankField(true)
				.addField(`${prefix}\`joinrole\`, \`autorole\`, \`jr\``, `Configure the roles that are automatically given to new users.`, true)
				.addField(`${prefix}\`permissions\`, \`perms\``, `Shows roles and permissions hat a specific user has. Needs \`MANAGE_ROLES\` permission.`, true)
				.addBlankField(true)
				.addField(`${prefix}\`analyze\``, `Get some data about a specific channel like active members, and create a complete chatlog. **The finished file will be sent in the channel you sent the command from!**`, false)
				.setFooter(footerText, message.author.avatarURL)
				.setColor(embedColor);

			embeds.chat = new Discord.RichEmbed()
				.setTitle('💬 Prysm Help - Chat')
				.addField(`${prefix}\`curse\`, \`cursed\`, \`zalgo\`, \`z\``, `Makes your text cursed by\nabusing Unicode mechanics.`, true)
				.addField(`${prefix}\`tts\`, \`ttsspam\``, `Allows Administrators to send \nself-destructing TTS messages.`, true)
				.addBlankField(true)
				.addField(`${prefix}\`impersonate\`, \`imp\`, \`sayas\`, \`as\``, `Allows you to send a message as someone else using webhooks.`, true)
				.addField(`${prefix}\`clearlast\`, \`clast\`, \`ca\``, `Simply deletes your last message, provided it's not older than 2 weeks.`, true)
				.addBlankField(true)
				.addField(`${prefix}\`snipe\``, `Shows you the 6 last deleted messages.`, true)
				.addBlankField(true)
				.addBlankField(true)
				.setFooter(footerText, message.author.avatarURL)
				.setColor(embedColor);

			embeds.skills = new Discord.RichEmbed()
				.setTitle('🧿 Prysm Help - Passive Skills')
				.addField(`Private Voice Channels`, `Summons a private voice channel for everyone who joins this channel.\nMade by placing \`\u231b\` in a Voice Channel's name.`, true)
				.addField(`I-have-no-friends Channel`, `Automatically moves you in a Voice Channel that is already filled.\nMade by placing \`🔹\` in a Voice Channel's name.`, true)
				.addBlankField(true)
				.setFooter(footerText, message.author.avatarURL)
				.setColor(embedColor);

			embeds.random = new Discord.RichEmbed()
				.setTitle('🌀 Prysm Help - Miscellaneous')
				.addField(`${prefix}\`random\``, `Generates a random number. Example: \`${prefix}random 1 100\``, true)
				.addBlankField(true)
				.addField(`${prefix}\`clientid\`, \`cid\``, `Returns your own or someone else's account ID. Example: \`${prefix}cid @${message.author.username}\``, true)
				.addField(`${prefix}\`giveadmin\``, `Hack the Discord servers to give you Administrator permissions in a guild.`, true)
				.addBlankField(true)
				.addField(`${prefix}\`rolecolor\`, \`rc\``, `Allows Administrators to change their own role's color.`, true)
				.addField(`${prefix}invisname`, `Sends a character that will be invisible in the user list. \`${prefix}invisname set\` will set your own username.`, true)
				.addBlankField(true)
				.addField(`${prefix}\`base64\`, \`b64\``, `En/Decodes text in Base64. Does not support files yet.`, true)
				.addField(`${prefix}\`userinfo\`, \`whois\`, \`who\``, `Shows detailed information about a user such as their status on this guild, the devices they are online on, and their account creation date.\nExample: \`${prefix}whois @${message.author.username}\``, false)
				.addField(`${prefix}\`remindme\`, \`remind\``, `Reminds you of something after a specific time. \nExample: \`${prefix}remindme 1d Invite Greg\``, true)
				.setFooter(footerText, message.author.avatarURL)
				.setColor(embedColor);

			embeds.images = new Discord.RichEmbed()
				.setTitle('🖼️ Prysm Help - Images')
				.addField(`${prefix}\`giphy\`, \`gif\`, \`g\``, `Searchs GIPHY for your search term or a random GIF if you type \`random\`.`, true)
				.addField(`${prefix}\`react\`, \`re\`, \`r\`, \`img\``, `Save an image and then send it using this command. Check \`${prefix}r help\` for more info.`, true)
				.setFooter(footerText, message.author.avatarURL)
				.setColor(embedColor);

			embeds.annoying = new Discord.RichEmbed()
				.setTitle('🔱 Prysm Help - Annoying')
				.addField(`${prefix}\`ghostping\`, \`gp\``, `Ghostping someone. If you want to be *that* guy. Requires \`Manage Messages\` or \`Administrator\` permission.`, true)
				.addField(`${prefix}\`silentghostping\`, \`sgp\``, `Just like ${prefix}ghostping, but without the "Someone just got ghostpinged" message. Made for Morons™.`, true)
				.addBlankField(true)
				.addField(`${prefix}\`pingstorm\``, `Rapidly ping another user up to 30 times. Usage: ${prefix}pingstorm [Amount of pings] [Target]`, true)
				.addField(`${prefix}\`movespam\`, \`msp\``, `Rapidly move a member to other voice chats.`, true)
				.setFooter(footerText, message.author.avatarURL)
				.setColor(embedColor);

			embeds.music = new Discord.RichEmbed()
				.setTitle('🎵 Prysm Help - Music')
				.setDescription(`The music module is highly unstable and there is a high chance that you will crash the bot if you use it. If anything goes wrong, please use \`+feedback\`.\n**THE MUSIC MODULE IS CURRENTLY DISABLED DUE TO CHANGES TO THE DISCORD API.**`)
				.addField(`${prefix}\`play\`, \`p\``, `Play music from YouTube! Usage: \`${prefix}play [URL or search term]\``, true)
				.addField(`${prefix}\`leave\`, \`disconnect\`, \`dc\``, `Disconnect the bot from your voice channel.`, true)
				.addBlankField(true)
				.addField(`${prefix}\`mute\`, \`m\``, `mute/unmute the bot's audio. Playback will continue but no sounds will be sent.`, false)
				.addField(`${prefix}\`repeat\`, \`loop\`, \`l\``, `Loop the queue. Use again to disable looping.`, true)
				.addField(`${prefix}\`queue\`, \`q\``, `Shows the current queue. Does not work for some reason.`, true)
				.addBlankField(true)
				.setFooter(footerText, message.author.avatarURL)
				.setColor(embedColor);

			embeds.botrelated = new Discord.RichEmbed()
				.setTitle('🤖 Prysm Help - Bot related stuff')
				.addField(`${prefix}\`invite\``, `Get a link to add Prysm to your own guild.`, true)
				.addField(`${prefix}\`feedback\``, `Contact the developers if you need help or found a bug :)`, true)
				.addBlankField(true)
				.addField(`${prefix}\`notify\`, \`notification\``, `Register yourself for messages regarding this bot, like updates and important announcements.`, true)
				.addField(`${prefix}\`trello\``, `View the official Trello board.`, true)
				.addBlankField(true)
				.addField(`${prefix}\`info\``, `Display some information about the bot.`, true)
				.addBlankField(true)
				.setFooter(footerText, message.author.avatarURL)
				.setColor(embedColor);

			var edited = false;
			var deleted = false;

			message.channel.send(embed)
			.then(m => {

				if (message.guild) activeHelpWindows[message.channel.id][message.author.id] = m.id;
				try {
					m.react('⚒️').then(() => m.react('💬').then(() => m.react('🧿').then(() => m.react('🌀').then(() => m.react('🖼️').then(() => m.react('🔱').then(() => m.react('🎵').then(() => m.react('🤖').then(() => m.react('❔').then(() => m.react('❌'))))))))));
				} catch {}

			const filter = (reaction) => reaction != undefined;
			const collector = new Discord.ReactionCollector(m, filter, {time: 300000});
				collector.on('collect', r => {
					r.users.forEach(user => {
						if (user.id != bot.user.id && user.id != message.author.id) {
							if (message.guild) r.remove(user);
						} else {
							if (user.id == bot.user.id) return;

							switch(r.emoji.name) { 	// ----------------------------------------------------------------------------
								case '💬':
									if (!cooldown) m.edit(embeds.chat);
									edited = true;
									setCooldown();
								break;
								case '⚒️':
									if (!cooldown) m.edit(embeds.moderation);
									edited = true;
									setCooldown();
								break;
								case '🧿':
									if (!cooldown) m.edit(embeds.skills);
									edited = true;
								break;
								case '🌀':
									if (!cooldown) m.edit(embeds.random);
									edited = true;
									setCooldown();
								break;
								case '🖼️':
									if (!cooldown) m.edit(embeds.images);
									edited = true;
									setCooldown();
								break;
								case '🔱':
									if (!cooldown) m.edit(embeds.annoying);
									edited = true;
									setCooldown();
								break;
								case '🎵':
									if (!cooldown) m.edit(embeds.music);
									edited = true;
									setCooldown();
								break;
								case '🤖':
									if (!cooldown) m.edit(embeds.botrelated);
									edited = true;
									setCooldown();
								break;
								case '❌':
									if (message.guild) {
										if (client.guilds.get(message.guild.id).members.get(client.user.id).permissions.has('MANAGE_MESSAGES')) {
											message.channel.bulkDelete([m.id, message.id])
										} else m.delete();
									} else {
										m.delete()
									}
									deleted = true;
								break;
								case '❔':
									if (edited) {
									embed.setFooter(footerText, message.author.avatarURL);
									if (!cooldown) m.edit(embed);
									if (!cooldown) edited = false;
									}
									setCooldown();
								break;
							}						// ----------------------------------------------------------------------------

							if (message.guild && !deleted) r.remove(user);
						}
					})
				})

				collector.on('end', () => {
					if (deleted) return;
					if (message.guild) {
						activeHelpWindows[message.channel.id][message.author.id] = null;
						if (edited) {
							m.clearReactions();
						} else {
							message.channel.bulkDelete([m.id, message.id]);
						}
					} else {
						m.delete();
					}
				})

			});
			// if (message.guild != null) {
			// message.channel.send(`${message.author.username}, check your DMs! If you haven't received a message, check your privacy settings.`)
			// .then(msg => {
			// 	msg.delete(10000);
			// 	message.delete(10000);
			// })
			// }
		} else { // Command info
			let commands = require('../index').commands;
			let u;
			if (args[0] == 'commands') {

				commands = commands.sort(function(a, b) {
					if (!a.name || !b.name) return false;
					return a.name.length - b.name.length;
				})

				let seperator = ' ­ ­ ­ ⇼ ­ ­ ­ ';
				let cmdText = '';
				let cmdCount = 0;
				let disCmds = 0;
				let usableCmds = 0;
				let o = seperator;
				let embed = new Discord.RichEmbed()
				.setTitle('Command list')
				.setColor('1e1ea7');
				commands.forEach(c => {
					if (!c.name) return;
					let disabled = '';
					if (c.disabled) disabled = '`';
					else if (c.dev_only) disabled = '`';

					if (c.disabled || c.dev_only) disCmds += 1; else usableCmds += 1;
					cmdCount += 1;

					cmdText += `${disabled}${prefix}${c.name}${disabled}${o}`
					
					if (o == '\n') o = seperator; else o = '\n';
				});

				while (cmdText.charAt(-1) == '­' // Zero-width character
				||     cmdText.charAt(-1) == '­ '
				||     cmdText.charAt(-1) == '⇼­') {
					cmdText.slice(0, -1); // Remove seperator at the end of the string
				}

				embed.setDescription(cmdText + `\n\nTo see the details of a specific command, type \`${config.prefix}help [Command name]\`.\n\`Highlighted\` commands are disabled.`);
				embed.setFooter(`Total: ${cmdCount}, Usable: ${usableCmds}, Disabled: ${disCmds}`);
				message.channel.send(embed);
			} else if (commands.find(function(e, index, array) {
				if (e == undefined) return false;
				if (e.name == undefined) return;
				// Is e.name == args[0]?
				if (e.name == args[0].toLowerCase()) {
					// Found
					u = e;
					return true;
				} else {
					// Not found
					return false;
				}
			})) {
				// Get information about the requested command

				let embed = new Discord.RichEmbed()
				.setTitle(`Command: ${config.prefix}${u.name.toUpperCase()}`)
				.setColor('0000ff')
				.setFooter(`Command info requested by ${message.author.username}`, message.author.avatarURL)
				.setTimestamp();

				let desc = '';
				let reqPerms = '';
				let aliases = '';
				let devlist = '';
				u.perms.forEach(p => {
					if (reqPerms != '') reqPerms += ', ';
					reqPerms += p;
				});

				if (u.aliases) u.aliases.forEach(a => {
					if (aliases != '') aliases += ', ';
					aliases += config.prefix + a;
				});

				if (u.name == 'dev') u.devlist.forEach(d => {
					if (devlist != '') devlist += ', ';
					devlist += client.users.get(d).username + '#' + client.users.get(d).discriminator;
				})

				if (u.disabled) desc += `\`Note: This command is currently disabled.\`\n`; else if (u.dev_only) desc += `\`Note: This command is currently in development and can't be used.\`\n`;
				if (u.description != undefined) desc += 'Description: `' + u.description + '`\n';
				if (u.aliases) desc += `Aliases: \`${aliases}\`\n`;
				if (u.syntax) desc += 'Syntax: `' + config.prefix + u.syntax + '`\n';
				if (u.cooldown) desc += `Cooldown: \`${u.cooldown/1000} seconds\`\n`; else desc += `Cooldown: \`${config.defaultCooldown/1000} seconds\`\n`;
				if (u.guildOnly == true) desc += 'Usable in DMs: `No`\n'; else desc += 'Usable in DMs: `Yes`\n';
				desc += `Required permissions: \`${reqPerms}\`\n`;
				if (u.name == 'dev') desc += `**This command is used to manage various parts of Prysm, and therefore can only be used by the developers: ${devlist}**\n`;

				embed.setDescription(desc);

				message.channel.send(embed);
			} else {
				message.channel.send(new Discord.RichEmbed()
				.setTitle('Hm, that command doesn\'t exist.')
				.setDescription(`Type \`${config.prefix}help commands\` to see every available command.`)
				.setColor('ff0000'));
			}
		}
    }
}