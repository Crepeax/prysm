const Discord = require('discord.js');
const data = require('../../bot');
const client = data.client;
const config = require('../../config.json');

const autoroles = require('../../functions/autoroles');

let logDebug = (process.env.LOG_DEBUG || config.logDebug);

module.exports.run = function() {
    // Give roles to new members
    client.on('guildMemberAdd', member => {
        autoroles.giveRoles(member.guild, member.user);
    });


    // Debug logging
    client.on('debug', info => {
        if (logDebug) console.debug(`${colors.fg.blue}[Debug] ${info}${colors.reset}`);
    });

    client.on('reconnecting', () => {
        console.log(`${colors.fg.yellow}[Info] Reconnecting client${colors.reset}`)
    });

    client.on('disconnect', (event) => {
        console.log(`${colors.fg.red}[Error] Client disconnected.${colors.reset}`);
        client.destroy().catch();
    });

    client.on('error', (error) => {
        console.dir(colors.fg.red + error + colors.reset);
    });
}

module.exports.meta = {
    name: 'event_handler',
    priority: -1 // Priority is so high because some debug messages wouldn't get logged otherwise
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