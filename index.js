console.log('[Info] Initializing');
const Discord = require('discord.js');
const config = require('./config.json');
let   prefix = config.prefix;
const client = new Discord.Client();
const exec = require('child_process').exec;
const fs = require('fs');
const stats = require('./logStats');

let randomFuncPath = require('./functions/random.js');
function random(low, high) {
    var output = randomFuncPath.execute(low, high);
    return output;
}

let testingMode = false; // When set to true, the bot will use the testing account instead.

if (process.env.LOGONSERVER == '\\\\DESKTOP-JAN') testingMode = true; // Automatically use the test account when running locally.

if (testingMode) prefix = '-';
if (testingMode) console.log('[Info] Testing mode enabled!');

// var http = require('http');
// setInterval(() => {
//     http.get('http://botbot-bot.herokuapp.com/');
// }, 1000*60*15);

if (!fs.existsSync("./stats.json")) fs.writeFileSync("./stats.json", '{"messages_total": 0, {userstats: {}}}');
if (!fs.existsSync("./reminders.json")) fs.writeFileSync("./reminders.json", '{}');
if (!fs.existsSync("./newsletter.json")) fs.writeFileSync("./newsletter.json", '{}');
if (!fs.existsSync("./clock-channels.json")) fs.writeFileSync("./clock-channels.json", '{}');
let statsFile = JSON.parse(fs.readFileSync("./stats.json", "utf8"));

let preCount = statsFile.messages_total;
let msgCount = statsFile.messages_total;

setInterval(function() {
	if (msgCount > preCount) {
		
		statsFile.messages_total = msgCount;
		fs.writeFileSync('./stats.json', JSON.stringify(statsFile));
		preCount = msgCount;
	}
}, 10000);

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
 
client.once('ready', () => {
	console.log('\n[Setup] Ready');
	console.log('[Setup] Running as ' + client.user.username + ' on ' + client.guilds.size + ' servers.');
	
	try {
		if (!testingMode) require('./clock-module.js');
		require('./wit/index'); // Start chatbot
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
	})

	let guildCooldowns = {}
	let userCooldowns = {}
	let cooldownCooldowns = {}
	
client.on('messageUpdate', (old, message) => {
	if (!old || !message) return;
	messageReceived(message, 'edit');
})

client.on('message', message => {
	messageReceived(message, 'send');
})

function messageReceived(message, type) {
	if (!message.guild && !message.author.bot) console.log(`DM MESSAGE: [${message.author.username}#${message.author.discriminator} (${message.author.id})]: ${message.content}`);

	if (!message.author.bot && message.content.startsWith(`<@!${client.user.id}>`)) {	// Check if message starts with mention
		const exec = client.misc.get('mention');										// Check if message starts with mention
		//exec.execute(message);															// Check if message starts with mention
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
		if (!command) {												// React to mentions
			message.react(client.emojis.get('671363201706885120'));	// |			
			return;													// |
		} else if (command.disabled) {											// Stop disabled commands from getting executed
			let inDM = true;
			if (message.guild) inDM = false;
			require('./logStats.js').addStats(message.author, command, inDM, 'devOnlyError');
			return message.channel.send('This command is currently disabled.');	// |
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
						.setFooter('Please contact an Administrator.');
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