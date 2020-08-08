const { Guild } = require("discord.js");
const config = require("../config.json");
const db = require('../bot').db;
const client = require('../bot').client;

/** @param {string | Guild | undefined} guild The guild to get the prefix from. Needs to be on the same shard. 
 */
module.exports.getPrefix = function(guild) {
    if (typeof guild == 'string') guild = client.guilds.get(guild);
    if (!guild) return require('../modules/core/login').testingMode ? config.testPrefix : config.prefix;
    let guildData = db.guild.get(guild.id);

    // Return the prefix (or the testing prefix, if the test account is being used)
    if (!guildData) return require('../modules/core/login').testingMode ? config.testPrefix : config.prefix;
    if (!guildData.prefix) return require('../modules/core/login').testingMode ? config.testPrefix : config.prefix;
}