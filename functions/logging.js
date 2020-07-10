const Discord = require('discord.js');
const config = require('../config.json');
const client = require('../bot').client;
const whClient = new Discord.WebhookClient(config.loggingWebhook.id, config.loggingWebhook.token);

/**
 * @param {string} title 
 * @param {string} description 
 * @param {boolean} important 
 */
module.exports.log = function(title, description, important) {
    const { testingMode } = require('../modules/core/login');
    let embed = new Discord.RichEmbed()
    .setTitle(title)
    .setDescription(description)
    .setAuthor(`Shard ${client.shard.id}${testingMode == true ? ' [Testing mode]' : ''}`, client.user.avatarURL);
    if (important) embed.setColor('ff0000');
    console.log(`${important == true ? '[!] ' : ''}${title}: ${description}`);
    whClient.send(embed)
    .catch(e => {
        console.log('Failed to execute webhook');
        console.log(e);
    });
}