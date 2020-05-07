const Discord = require('discord.js');
const fs = require('fs');

const bot = require('../index.js').client;

let dRoles = JSON.parse(fs.readFileSync("./functions/defaultroles.json", "utf8"));

module.exports = {
    defaultRoles: dRoles,
    giveRoles(guild, user) {
        if (bot.users.get(user).bot) return;
        this.defaultRoles = JSON.parse(fs.readFileSync("./functions/defaultroles.json", "utf8"));
        if (bot.guilds.get(guild) != undefined) {
            if (bot.guilds.get(guild).members.get(user) != undefined) {
                let u = bot.guilds.get(guild).members.get(user);
                
                let roles = this.defaultRoles;
                if (roles[guild] == undefined) return;
                roles[guild].forEach(r => {
                    u.addRole(r).catch();
                })

            } else {
                return 'errUserNotFound';
            }
        } else {
            return 'errGuildNotFound';
        }
    }
}