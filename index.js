/* Prysm - A Discord Bot
 * Copyright (C) 2019-2020 Im_Verum
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * 
 * Contact: prysmbot@gmail.com or via Discord: https://discord.gg/aTRHKUY
 */


console.log('[Info] Initializing');
const Discord = require('discord.js');
const config = require('./config.json');
let   prefix = config.prefix;
const client = new Discord.Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION']});
const exec = require('child_process').exec;
const fs = require('fs');
const fse = require('fs-extra');
const stats = require('./logStats');
const axios = require('axios').default;
var io = require( '@pm2/io');

let pm2cmds = io.meter({
	name: 'Executed commands',
	id: 'app/commands/meter'
});


/* Handle errors and promise rejections */

function logPromiseRejection(error, promise) {
	try {
		console.log(`Unahndled Promise Rejection : ${JSON.stringify(promise)}\n${error.stack}`)
		axios.post(config.errorWebhookURL, {embeds: [
			new Discord.RichEmbed()
			.setTitle('Unhandled Promise Rejection')
			.setDescription(`\`\`\`js\n---- Promise ----\n${JSON.stringify(promise)}\n\`\`\`\n\`\`\`js\n---- Error ----\n${JSON.stringify(error)}\n\`\`\``)
			.setColor('ff0000')
		]}, {"headers": {"Content-Type": 'application/json'}}).catch(e => console.log('Webhook message failed.'));
	} catch(e) {
		console.log('Failed to post error.');
		console.error(e);
	}
}

function logUncaughtException(error) {
	try {
		console.log(`Unahndled Promise Rejection : ${JSON.stringify(promise)}\n${error.stack}`)
		axios.post(config.errorWebhookURL, {embeds: [
			new Discord.RichEmbed()
			.setTitle('Uncaught Exception')
			.setDescription(`\`\`\`js\n---- Error ----\n${JSON.stringify(error)}\n\`\`\``)
			.setColor('ff0000')
		]}, {"headers": {"Content-Type": 'application/json'}}).catch(e => console.log('Webhook message failed.'));
	} catch(e) {
		console.log('Failed to post error.');
		console.error(e);
	}
}

process.on('unhandledRejection', (error, promise) => logPromiseRejection(error, promise));
process.on('uncaughtException', error => logUncaughtException(error))

/* ------------------------------------ */


let randomFuncPath = require('./functions/random.js');
function random(low, high) {
    var output = randomFuncPath.execute(low, high);
    return output;
}

let showDebugMessages = false;
let testingMode = false; // When set to true, the bot will use the testing account instead.

// This line will put the bot into "Testing" mode automatically when it is running on my PC
if (process.env.LOGONSERVER == '\\\\DESKTOP-JAN' || process.env.LOGONSERVER == '\\\\DESKTOP-0R10B5F') testingMode = true; // Automatically use the test account when running locally.

if (testingMode) prefix = config.testingPrefix;
if (testingMode || process.env.SHOW_DEBUG || config.debugLogs) showDebugMessages = true;
if (testingMode) console.log('[Info] Testing mode enabled!');

module.exports.testingMode = testingMode;
module.exports.prefix = prefix;

// var http = require('http');
// setInterval(() => {
//     http.get('http://botbot-bot.herokuapp.com/');
// }, 1000*60*15);

// Creating missing files and folders
if (!fs.existsSync("./stats.json")) fs.writeFileSync("./stats.json", '{"messages_total": 0, "userstats": {}}');
if (!fs.existsSync("./reminders.json")) fs.writeFileSync("./reminders.json", '{}');
if (!fs.existsSync("./newsletter.json")) fs.writeFileSync("./newsletter.json", '{}');
if (!fs.existsSync("./clock-channels.json")) fs.writeFileSync("./clock-channels.json", '{}');
if (!fs.existsSync('guilddata.json')) fs.writeFileSync('guilddata.json', '{}');
if (!fs.existsSync('music/volumes.json')) fs.writeFileSync('music/volumes.json', '{}');
if (!fs.existsSync('music/announce.json')) fs.writeFileSync('music/announce.json', '{}');
if (fs.existsSync('conversions/')) {fse.emptyDirSync('conversions/'); fs.rmdirSync('conversions/')}
let statsFile = JSON.parse(fs.readFileSync("./stats.json", "utf8"));

/* -- Save total command count to file every 10 seconds -- */
let preCount = statsFile.messages_total;
let msgCount = statsFile.messages_total;

setInterval(function() {
	if (msgCount > preCount) {
		
		statsFile.messages_total = msgCount;
		fs.writeFileSync('./stats.json', JSON.stringify(statsFile));
		preCount = msgCount;
	}
}, 10000);
/* ------------------------------------------------------ */

module.exports.client = client;

dis = 0;

console.log(`[Info] Prefix is ${prefix}`);
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
	if (command.disabled) {
		dis += 1;
		console.log(`\x1b[41m[File Manager] Loaded File commands/${file}\x1b[0m`);
	} else {
		console.log(`[File Manager] Loaded File commands/${file}`);
	}
}

client.misc = new Discord.Collection();
const miscFiles = fs.readdirSync('./misc').filter(file => file.endsWith('.js'));
for (const file of miscFiles) {
	const target = require(`./misc/${file}`);
	console.log(`[File Manager] Loaded File misc/${file}`)
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.misc.set(target.name, target);
}

console.log(`[Info] Loaded ${commandFiles.length + miscFiles.length} Files.`)


	module.exports.commands_total = commandFiles.length,
	module.exports.commands_loaded = commandFiles.length - dis
	module.exports.commands = client.commands;

	/* Functions for the webinterface to function. Also no idea why it's named 'Support' */
	module.exports.support = {
		isOnSupportServer(id) {
			if (client.guilds.get(config.voteGuild).members.get(id)) return true; else return false;
		},
		isOnServer(userID, guildID) {
			let guild = client.guilds.get(guildID);
			if (!guild) return false;
			if (guild.members.get(userID)) return guild.members.get(userID); else return false;
		},
		sendMsg(id) {
			let member = client.guilds.get(config.voteGuild).members.get(id);
			if (member) {
				let embed = new Discord.RichEmbed()
				.setTitle('You were added to the support server.')
				.setDescription(`You were added to \`${member.guild.name}\` because you clicked the "Support Server" button. Please make sure to read the <#702551414219473060> and have fun!`)
				.setColor('2f3136')
				.setFooter('You can leave this server at any time.')
				.setTimestamp();
				member.user.send(embed);
			} else console.log('Could not find user');
		},
		getGuilds() {
			let guilds = client.guilds;
			return guilds;
		},
		canManageGuild(userID, guildID) {
			if (!userID || !guildID) return false;
			if (isNaN(userID))  return false;
			if (isNaN(guildID)) return false;
			let guild = client.guilds.get(guildID);
			let user = client.users.get(userID);
			if (!user || !guild) return false;
			let member = guild.members.get(userID);
			if (!member) return false;
			if (!member.permissions.has('MANAGE_GUILD') && !member.permissions.has('ADMINISTRATOR')) return false;
			return member;
		}
	}
	/* --------------------------------------------------------------------------------- */

client.on('guildMemberAdd', member => {
	let user = member.id;
	let guild = member.guild.id;
	const exec = require('./functions/autoroles');
	exec.giveRoles(guild, user);
})

client.on('guildCreate', guild => {
	console.log('[Info] Added to Server');
	console.log('[Info] Server: ' + guild.name);
	console.log('[Info] Members: ' + guild.memberCount);
	console.log('[Info] Server Owner: ' + guild.owner.user.username);
})

client.on('guildDelete', guild => {
	try {
	console.log('[Info] Removed from Server');
	console.log('[Info] Server: ' + guild.name);
	console.log('[Info] Members: ' + guild.memberCount);
	console.log('[Info] Server Owner: ' + guild.owner.user.username);
	} catch {}
})


// ------------------------------- Debug logging -------------------------------

client.on('debug', (info) => {
	if (showDebugMessages) console.debug('\x1b[34m' + `[Debug] ${info}` + '\x1b[0m');
});



client.on('disconnect', (e) => {
	console.log('\x1b[31m' + `[Error] Client has disconnected: ${e}` + '\x1b[0m');
	console.log('\x1b[31m' + `[Error] Exiting process with code 1.` + '\x1b[0m');
	process.exit(1);
});



client.on('reconnecting', () => {
	console.log('\x1b[33m' + `[Info] Reconnecting` + '\x1b[0m');
});



client.on('guildUnavailable', (guild) => {
	console.log('\x1b[33m' + `[Info] Guild is unavailable: ${guild.name} (${guild.id})` + '\x1b[0m')
});


client.on('rateLimit', (rateLimitInfo) => {
	console.log('\x1b[31m');
	console.log(`[Warn] Client is being rate limited`);
	console.log(`     | Limit: ${rateLimitInfo.limit}`);
	console.log(`     | Time difference: ${rateLimitInfo.timeDifference}`);
	console.log(`     | Path: ${rateLimitInfo.path}`);
	console.log(`     | Method: ${rateLimitInfo.method}`);
	console.log('\x1b[0m');
});


// ------------------------------ /Debug logging -------------------------------


client.once('ready', () => {
	console.log('\n[Setup] Ready');
	console.log('[Setup] Running as ' + client.user.username + ' on ' + client.guilds.size + ' servers.');
	
	console.log('[Voice] Disconnecting all voice connections.');
	client.voiceConnections.forEach(c => {
		console.log('[Voice] Disconnect: ' + c.channel.name);
		c.disconnect();
	})

	try {
		if (!testingMode) require('./clock-module.js');
	} catch(e) {
		client.guilds.get(config.errorServer).channels.get(config.errorChannel).send(`**Time channel script just crashed**\nError: ${e}\nWhen: ${new Date()}\n@everyone`)
	}

	setActivity('WATCHING', 'you | Online!');

	require('./reminders').setTimeouts();

	if (config.sendStatusToWebhook == true && testingMode == false) {
		let whGuild = client.guilds.get(config.webhookGuild);
		if (whGuild == undefined) console.log('[Error] Could not find webhook guild. Please check the config.json "webhookGuild" value.'); else {
		let whChannel = whGuild.channels.get(config.webhookChannel);
		if (whGuild == undefined) console.log('[Error] Could not find webhook channel. Please check the config.json "webhookChannel" value.'); else {
		
			let hook;
			let webhooks = whChannel.fetchWebhooks()
			.then(webhooks => {
				if (webhooks.first() == undefined) {
				console.log('[Info] No webhook found in webhook channel, creating one.');
				whChannel.createWebhook('Prysm Updates', client.user.avatarURL).then(webhook => {
					hook = webhook;
				});
			} else {
				hook = webhooks.first();
			}

			let timeoutCounter = 0;
			let timeoutMS = 5000; // Not actually milliseconds

			setInterval(function() {
			if (hook) {
				let time = new Date();
				let attachment = new Discord.Attachment('./images/online.png', 'image.png');
				let embed = new Discord.RichEmbed()
				.setTitle('Online!')
				.setDescription(`Woops, seems like I just restarted.`)
				.setTimestamp()
				.setThumbnail(client.user.avatarURL)
				.setColor('2f3136');
			hook.send('', {
				username: `${client.user.username} [Online]`,
				avatarURL: 'https://cdn.discordapp.com/attachments/686276234791092268/690233682753224841/image.png',
				embeds: [embed]
			}).catch();
			console.log(`[Info] Webhook message sent to '${whChannel.name}' in guild '${whGuild.name}'`);
			clearInterval(this);
		} else {
			timeoutCounter = timeoutCounter + 1;
		}
		if (timeoutCounter > timeoutMS) {
			clearInterval(this);
			console.log('[Error] Webhook timed out.');
		}
		})}, 1);
			
		}}
	}
	
	console.log(`[Info] Starting webinterface`);
	require('./webinterface/server');

	setInterval(function() {
		setTimeout(function() {
			setActivity('LISTENING', `your commands`);
		setTimeout(function() {
			setActivity('WATCHING', `${client.guilds.size} Servers | Prefix ${prefix}`);
		setTimeout(function() {
			setActivity('WATCHING', `${client.users.size} Users | Prefix ${prefix}`);
		setTimeout(function() {
			setActivity('WATCHING', `you | Prefix ${prefix}`);
		}, 10000)}, 10000)}, 10000)}, 10000);
	}, 40000);
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
	c = client;
	const exec = client.misc.get('channelManager');
	exec.execute(oldMember, newMember);
});

	let guildCooldowns = {}
	let userCooldowns = {}
	let cooldownCooldowns = {}
	

client.on('channelCreate', c => {
	let file = JSON.parse(fs.readFileSync('guilddata.json'));
	if (!c.guild) return;
	if (!file[c.guild.id])			 return;
	if (!file[c.guild.id].mutedRole) return;
	if (!c.manageable) 				 return;
	console.log('New channel created. Denying permissions for muted role');
	c.overwritePermissions(file[c.guild.id].mutedRole, {
		SEND_MESSAGES: false,
		ADD_REACTIONS: false,
		CONNECT: false
	}, 'Denied permissions for muted role.').catch(e => console.error(e));
})


client.on('messageUpdate', (old, message) => {
	if (!old || !message) return;
	if (old.content == message.content || !message.content) return;
	messageReceived(message, 'edit');
});

client.on('message', message => {
	messageReceived(message, 'send');
});

let checkMessage = require('./functions/checkMessage.js');
const { applyTransformDependencies } = require('mathjs');
function messageReceived(message, type) {
	if (!message.author.bot && message.guild) checkMessage.check(message);
	if (!message.guild && !message.author.bot) console.log(`DM MESSAGE: [${message.author.username}#${message.author.discriminator} (${message.author.id})]: ${message.content}`);

	if (!message.author.bot && message.content.startsWith(`<@!${client.user.id}>`)) {	// Check if message starts with mention
		const exec = client.misc.get('mention');										// Check if message starts with mention
		//exec.execute(message);														// Check if message starts with mention
		return;																			// Check if message starts with mention
	}

	if (!message.guild) {
		let inDM = true;
        
            stats.addStats(message.author, message, inDM, 'logDMMsg');
	}

	if (!message.content.startsWith(prefix) || message.author.bot || message.webhookID) {if (message.isMentioned(client.user)) {message.react(client.emojis.get('671389061331812362')); return;} else return;}
	const args = message.content.slice(prefix.length).split(' ');
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) return; 
		else if (command.disabled) {											// Stop disabled commands from getting executed
			let inDM = true;
			if (message.guild) inDM = false;
			require('./logStats.js').addStats(message.author, command, inDM, 'devOnlyError');
			return message.channel.send('This command is currently broken and can\'t be used.');																	// |
		} else if (command.dev_only) {																											// Stop command from getting executed if it is a dev-only command
			let dev = require('./commands/dev.js');																								// |
			if (dev.devlist.indexOf(message.author.id) > -1) {																					// |
				console.log('Dev-only command executed: ' + command.name);																		// |
			} else {
				let inDM = true;
				if (message.guild) inDM = false;
				require('./logStats.js').addStats(message.author, command, inDM, 'devOnlyError');
				return message.channel.send('Sorry, this command is currently in development and can only be used by developers.');				// |
			}
		} else if (command.guildOnly && message.channel.type !== 'text') {		// Stop command from getting executed in DM if it is guild-only
			let inDM = true;
			if (message.guild) inDM = false;
			require('./logStats.js').addStats(message.author, command, inDM, 'notInDMError');
			return message.reply('This command can\'t be used in DMs.');    	// |
		}

		// ---------------------------------------------------------------------------------------------------------- Cooldown stuff

			let guildId;
			if (message.guild == null) guildId = message.author.dmChannel.id; else guildId = message.guild.id;

			if (cooldownCooldowns[message.author.id] == undefined) cooldownCooldowns[message.author.id] = false;
			if (!isNaN(cooldownCooldowns[message.author.id])) if (cooldownCooldowns[message.author.id] < 0) cooldownCooldowns[message.author.id] = false;
			let cdCD = cooldownCooldowns[message.author.id];

			if (userCooldowns[message.author.id] == undefined) userCooldowns[message.author.id] = [];
			if (guildCooldowns[guildId] == undefined) guildCooldowns[guildId] = [];
			if (userCooldowns[message.author.id][command.name] == undefined) userCooldowns[message.author.id][command.name] = false;
			if (guildCooldowns[guildId][command.name] == undefined) guildCooldowns[guildId][command.name] = false;
			if (!isNaN(userCooldowns[message.author.id][command.name])) if (userCooldowns[message.author.id][command.name] < 0) userCooldowns[message.author.id][command.name] = false;
			if (!isNaN(guildCooldowns[guildId][command.name])) if (guildCooldowns[guildId][command.name] < 0) guildCooldowns[guildId][command.name] = false;
			let uCD = userCooldowns[message.author.id][command.name];
			let gCD = guildCooldowns[guildId][command.name];

			if (command.cooldown == undefined) command.cooldown = config.defaultCooldown;

			if ((gCD != false || uCD != false) && (!(require('./commands/dev').devlist.indexOf(message.author.id) > -1))) {
			
				let cdMsg = 0;
			
				if (!isNaN(gCD) && isNaN(uCD)) {
					if (gCD > uCD) cdMsg = gCD; else cdMsg = uCD;
				} else {
					if (!isNaN(gCD)) cdMsg = gCD; else cdMsg = uCD;
				}
			
				let now = Date.now();
				cdMsg = cdMsg - now;
			
				cdMsg = Math.ceil(cdMsg / 100) / 10;
			
				let titleTexts = [
					'Hey, slow it down!',
					'You\'re too fast!',
					'Please wait a moment before doing that.',
					'Cooldown'
				];
			
				let descTexts = [
					`Please wait ${cdMsg} seconds before doing that.`,
					`Hey! Please wait ${cdMsg} seconds before running that command again.`,
					`You are running commands too fast! Please wait ${cdMsg} seconds.`
				];
			
				let titleText = titleTexts[random(0, titleTexts.length - 1)];
				let descText = descTexts[random(0, descTexts.length - 1)];
				let footText = `The command you tried to execute (${command.name}) has a ${command.cooldown / 1000} second cooldown.`;
			
				let cooldownEmbed = new Discord.RichEmbed()
				.setTitle(titleText)
				.setDescription(descText)
				.setFooter(footText, 'https://cdn4.iconfinder.com/data/icons/online-menu/64/attencion_exclamation_mark_circle_danger-512.png')
				.setColor('ff0000');
			
				cooldownCooldowns[message.author.id] = true;
			
				if (!cdCD) message.channel.send(cooldownEmbed).then(m => m.delete(30000));
			
				let inDM = true;
        		if (message.guild) inDM = false;
			
        	    	stats.addStats(message.author, command, inDM, 'cooldown');
			
				setTimeout(function() {
					cooldownCooldowns[message.author.id] = false;
				}, 3000)
			
				return;
			}
		// ---------------------------------------------------------------------------------------------------------- Cooldown stuff

		try { 

			msgCount += 1;

			if (message.guild != null) {

				console.log(`[Info] [COMMAND] : [${message.author.username}#${message.author.discriminator} (${message.author.id})] in [${message.guild.name}]/[${message.channel.name}] : [${message.content}]`);
				
				let reqPerms = new Discord.Permissions(0);
				let reqPermsStr = '';
				if (command.perms == undefined) {reqPerms.add('ADMINISTRATOR'); command.perms = ['ADMINISTRATOR']}
				else if (command.perms.length == 0) {reqPerms.add('ADMINISTRATOR'); command.perms = ['ADMINISTRATOR']}
				command.perms.forEach(p => {
					function check() {if (client.guilds.get(message.guild.id).members.get(client.user.id).permissions.hasPermission(p)) return '✅ '; else return '❌ '}
					reqPerms.add(p);
					reqPermsStr = reqPermsStr + check() + '`' + p + '`\n';
				})
		
				if (client.guilds.get(message.guild.id).members.get(client.user.id).permissions.hasPermissions(reqPerms) || client.guilds.get(message.guild.id).members.get(client.user.id).permissions.hasPermission('ADMINISTRATOR')) {
				} else {
					if (client.guilds.get(message.guild.id).members.get(client.user.id).permissions.hasPermission('SEND_MESSAGES') && client.guilds.get(message.guild.id).members.get(client.user.id).permissions.hasPermission('EMBED_LINKS')) {
						let sendInDMstr = '';
						if (!command.guildOnly) sendInDMstr = '\n**You can try to run this command in DMs instead.**';
						let missingPerms = reqPermsStr
						let embed = new Discord.RichEmbed()
						.setTitle('Missing permissions')
						.setDescription('I require the following permissions to execute this command:\n' + missingPerms + sendInDMstr)
						.setColor('ff0000')
						.setFooter('You need to give these permissions to Prysm if you want to use this command.');
						return message.channel.send(embed);
					} else if (client.guilds.get(message.guild.id).members.get(client.user.id).permissions.hasPermission('SEND_MESSAGES')) {
						return message.channel.send('I am mising the \'Embed links\' permission to function porperly.');
					} else {
						return message.author.send('I don\'t have permission to reply to your command. Please contact an Administrator.'); 
					}
				}
				
			} // else console.log(`[Info] [COMMAND] : [${message.author.username}#${message.author.discriminator} (${message.author.id})] in DIRECT MESSAGES : [${message.content}]`);

			username = client.user.username;
			user = client.user;
			bot = client;
			pre = prefix;
			conf = config;
			pm2cmds.mark();
			let re = command.execute(message, args, username, fs, prefix, pre, user, client, commandName);
			let inDM;
			if (message.guild) inDM = false; else inDM = true;

				stats.addStats(message.author, command, inDM, 'success', undefined, type);

			if (command.confirmCooldown && !re) return console.log('Not setting cooldown.');
			let now = Date.now();
			userCooldowns[message.author.id][command.name] = command.cooldown + now;
			guildCooldowns[guildId][command.name] = (command.cooldown) + now;
			setTimeout(function() {
				userCooldowns[message.author.id][command.name] = false;
				guildCooldowns[guildId][command.name] = false;
			}, command.cooldown);
			execute = exec;
		} catch (error) {
			console.error(error);
			try {
				const efile = require('./error');
				efile.error(message, error, command, type);
			} catch (e) {
				console.error(e);
				message.channel.send('The error handler has encountered an error. This is usually a sign that my code is fucked.');
			}
		}

}

if (config.meaning_of_life != 42) {console.log(`Invalid Configuration: The meaning of Life is not ${config.meaning_of_life}, it is 42!`); return;} else {
	if (testingMode) client.login(config.testtoken); else client.login(config.token);
}


function setActivity(type, activity) {
	client.user.setActivity(activity, {type: type});
}