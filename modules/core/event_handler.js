const Discord = require('discord.js');
const data = require('../../bot');
const client = data.client;
const config = require('../../config.json');
const { log } = require('../../functions/logging');

const autoroles = require('../../functions/autoroles');
const { messaging } = require('firebase');

async function getGuildCount() {
    let serverCount = await client.shard.fetchClientValues('guilds.cache.size');
    serverCount = serverCount.reduce((p, n) => p + n, 0);
    return serverCount;
}

let logDebug = (process.env.LOG_DEBUG || config.logDebug);

module.exports.run = function() {
    // Give roles to new members
    client.on('guildMemberAdd', member => {
        autoroles.giveRoles(member.guild, member.user);
    });

    client.on('guildCreate', async function(guild) {
        const count = await getGuildCount();
        log('Added to server', `The bot was added to a new server.\nNew guild size: ${count}${
            // Only log guild details in testing mode
            require('./login').testingMode ? `\nGuild name: ${guild.name}\nMember count: ${guild.memberCount}\nGuild owner: ${guild.owner.user.tag}` : ''
        }`);
    });
    

    client.on('guildDelete', async function(guild) {
        const count = await getGuildCount();
        log('Removed from server', `The bot was removed from a server.\nNew guild size: ${count}${
            // Only log guild details in testing mode
            require('./login').testingMode ? `\nGuild name: ${guild.name}\nMember count: ${guild.memberCount}\nGuild owner: ${guild.owner.user.tag}` : ''
        }`);
    });


    // Debug logging
    client.on('debug', info => {
        if (logDebug) console.debug(`${colors.fg.blue}[Debug] ${info}${colors.reset}`);
    });

    client.on('reconnecting', () => {
        console.log(`${colors.fg.yellow}[Info] Reconnecting client${colors.reset}`);
        log('Client reconnecting', 'The client is reconnecting.');
    });

    client.on('disconnect', (event) => {
        console.log(`${colors.fg.red}[Error] Client disconnected.${colors.reset}`);
        log('Client disconnected', `The client has disconnected and will no longer try to reconnect.\nEvent: ${event}`, true);
        client.destroy().catch();
    });

    client.on('error', (error) => {
        console.dir(colors.fg.red + error + colors.reset);
    });

    client.on('rateLimit', (data) => {
        console.log(colors.fg.yellow + '[Warning] Rate limited\n'+ colors.fg.cyan + `Limit: ${data.limit}\nMethod: ${data.method}\nPath: ${data.path}\nRoute: ${data.route}\nTime Difference: ${data.timeDifference}\nTimeout: ${data.timeout}` + colors.reset)
    });
}

module.exports.meta = {
    name: 'event_handler',
    priority: 0
}


// Console color "codes"
const colors = {
    fg: {
        black: '\x1b[30m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m'
    },
    bg: {
        black: '\x1b[40m',
        red: '\x1b[41m',
        green: '\x1b[42m',
        yellow: '\x1b[43m',
        blue: '\x1b[44m',
        magenta: '\x1b[45m',
        cyan: '\x1b[46m',
        white: '\x1b[47m'
    },
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m'
}
