const Discord = require('discord.js');
const fs = require('fs');
const client = require('../bot').client;

let dRoles = JSON.parse(fs.readFileSync("./data-storage/defaultroles.json", "utf8"));

module.exports = {
    defaultRoles: dRoles,
    /**
     * @param {Discord.Guild} guild 
     * @param {Discord.User} user 
     */
    giveRoles(guild, user) {
        // More trash code
        try {
            dRoles = JSON.parse(fs.readFileSync("./data-storage/defaultroles.json", "utf8"));
            this.defaultRoles = dRoles;

            if (user.bot) return;
            
            if (!guild.members.cache.get(client.user.id).permissions.has('MANAGE_ROLES')) return console.log('Missing permissions.');

            let u = guild.members.cache.get(user.id);

            let roles = dRoles;
            if (roles[guild.id] == undefined) return;
            roles[guild.id].forEach(r => {
                u.addRole(r).catch();
            });

        } catch(e) {
            console.log(`[Shard ${client.shard.ids[0]}] Failed to give autorole: ${e}`);
        }
    }
}