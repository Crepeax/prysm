const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
let timeout = 0;
let token = config.token;
if (process.env.LOGONSERVER == '\\\\DESKTOP-JAN' || process.env.LOGONSERVER == '\\\\DESKTOP-0R10B5F') timeout = 0;
if (process.env.LOGONSERVER == '\\\\DESKTOP-JAN' || process.env.LOGONSERVER == '\\\\DESKTOP-0R10B5F') token = config.testtoken;
client.login(token);

console.log('Manager is starting.');

client.once('ready', () => {
    console.log('Manager is online!');
    client.user.setStatus('dnd');
    client.user.setActivity('Starting...');
    setTimeout(function() {
        try {
            start();
        } catch {};
    }, timeout);
})

function start() {
    try {
        require('./index');
    } catch (e) {
        console.log('CRASHED');
        console.error(e);
        client.guilds.get(config.errorServer).channels.get(config.errorChannel).send(`**PRYSM CRASHED**\nError: ${e}\nWhen: ${new Date()}\n@everyone`);
        client.user.setStatus('dnd');
        client.user.setActivity('Crashed');
        require.cache = {};
        setTimeout(function() {
            start();
        }, 10000);
    }
}