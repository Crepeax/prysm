const Discord = require('discord.js');
const fs = require('fs');
const prefix = require('../config.json').prefix;

module.exports = {
    name: 'joinroles',
    description: 'Configure the default roles that are given to new members.',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'MANAGE_ROLES', 'EMBED_LINKS', 'MENTION_EVERYONE'],
    aliases: ['joinrole', 'autorole', 'jr', 'autorole'],
    execute(message, args) {
        if (!(message.member.hasPermission('MANAGE_ROLES' || message.member.hasPermission('ADMINISTRATOR')))) {
            let invPermEmbed = new Discord.RichEmbed()
            .setTitle('Insufficient Permissions.')
            .setDescription('You need the \'Manage Roles\' or \'Administrator\' permission to use this command.')
            .setColor('ff0000')
            .setFooter('This command allows Server Owners to configure the the roles that automatically get assigned to new members.');
            return message.channel.send(invPermEmbed);
        }

let file = JSON.parse(fs.readFileSync("./functions/defaultroles.json", "utf8"));
if (file[message.guild.id] == undefined) file[message.guild.id] = [];

if (file == undefined) return message.channel.send('Something went wrong. Please contact the developer using the `feedback` command.');
let newRoles;

        switch(args[0]) {
            case 'add':
                if (!message.mentions.roles.first()) {
                    let errEmbed = new Discord.RichEmbed()
                    .setTitle('Invalid arguments')
                    .setDescription('You have to @mention the role you want to add!')
                    .setColor('ff0000');
                    return message.channel.send(errEmbed);
                }

                newRoles = file[message.guild.id];
                if (newRoles.length == 0) {
                    newRoles[0] = message.mentions.roles.first().id;
                } else {
                    if (newRoles.indexOf(message.mentions.roles.first().id) > -1) {
                        return message.channel.send('That role is already added.');
                    } else {
                        newRoles.push(message.mentions.roles.first().id);
                    }
                }

                file[message.guild.id] = newRoles;
                fs.writeFileSync('./functions/defaultroles.json', JSON.stringify(file));
                message.react('✅');

            break;

            case 'remove':
            case 'delete':
                if (!message.mentions.roles.first()) {
                    let errEmbed = new Discord.RichEmbed()
                    .setTitle('Invalid arguments')
                    .setDescription('You have to @mention the role you want to remove!')
                    .setColor('ff0000');
                    return message.channel.send(errEmbed);
                }

                newRoles = file[message.guild.id];

                if (newRoles != undefined) {
                    if (newRoles.indexOf(message.mentions.roles.first().id) > -1) {
                        newRoles.splice(newRoles.indexOf(message.mentions.roles.first().id), 1);
                    }
                }

                file[message.guild.id] = newRoles;
                fs.writeFileSync('./functions/defaultroles.json', JSON.stringify(file));
                message.react('✅');

            break;

            case 'clear':
            case 'reset':
                file[message.guild.id] = [];
                fs.writeFileSync('./functions/defaultroles.json', JSON.stringify(file));
                let embed = new Discord.RichEmbed()
                message.react('✅');
            break;

            case undefined:
            case 'list':
            case 'view':
            case 'show':
                if (file[message.guild.id].length > 0) {
                let roleStr = '';
                let delText = '';
                file[message.guild.id].forEach(id => {
                    if (message.guild.roles.get(id) == undefined) {
                        roleStr = roleStr + '[Deleted Role]\n';
                        delText = `\n\n**Remove deleted roles by typing: ${prefix}joinrole cleanup**`;
                     } else roleStr = roleStr + message.guild.roles.get(id) + '\n';
                });
                let s;
                if (file[message.guild.id].length > 1) s = 's'; else s = '';
                let embed = new Discord.RichEmbed()
                .setTitle('Default Roles')
                .setDescription(`New users will receive the following role${s} automatically:\n\n${roleStr}${delText}`)
                .setColor('00ff00')
                .setFooter(`Type '${prefix}joinrole add @Role' to add a role to this list.\nType '${prefix}joinrole remove @Role' to remove a role.\nType '${prefix}joinrole reset' to clear all roles.`);
                message.channel.send(embed);
            } else {
                let embed = new Discord.RichEmbed()
                .setTitle('Default Roles')
                .setColor('ffff00')
                .setDescription(`New members won\'t automatically receive a role.\nType ${prefix}joinrole add to get started.`)
                .setFooter(`Type '${prefix}joinrole add @Role' to add a role to this list.\nType '${prefix}joinrole remove @Role' to remove a role.\nType '${prefix}joinrole reset' to clear all roles.`);
                message.channel.send(embed);
            }
            break;

            case 'cleanup':
                let delFound = 0;
                if (file[message.guild.id] && file[message.guild.id].length > 0) {
                    file[message.guild.id].forEach(id => {
                        if (message.guild.roles.get(id) == undefined) {
                            file[message.guild.id].splice(file[message.guild.id].indexOf(id, 1));
                            delFound++;
                        }
                    })

                    if (delFound == 0) {
                        let embed = new Discord.RichEmbed()
                        .setTitle('Cleanup')
                        .setDescription('I couldn\'t find any deleted roles.')
                        .setColor('00ff00');
                        message.channel.send(embed);
                    } else {
                        let s;
                        if (delFound == 1) s = ''; else s = 's';
                        let embed = new Discord.RichEmbed()
                        .setTitle('Cleanup')
                        .setDescription(`I removed ${delFound} role${s}.`)
                        .setColor('00ff00');
                        message.channel.send(embed);
                    }

                } else {
                    let embed = new Discord.RichEmbed()
                    .setTitle('Cleanup')
                    .setDescription('You haven\'t configured any roles yet.')
                    .setFooter(`Run '${prefix}joinrole add' to get started.`)
                    .setColor('ff0000');
                    message.channel.send(embed);
                }

                fs.writeFileSync('./functions/defaultroles.json', JSON.stringify(file));

            break;

            default:
                let helpembed = new Discord.RichEmbed()
                .setTitle('Invalid arguments')
                .setDescription(`**This command configures the roles that will be automatically given to new users.**\nUsage: \n*${prefix}joinrole add @Role* - Set a role to be automatically given to new users.\n*${prefix}joinrole remove @Role* - Don't automatically give that role to new users\n*${prefix}joinrole reset* - Clear all roles from the auto-grant list. Use if you have issues.\n*${prefix}joinrole list* - List all roles that will be automatically given to new users.`)
                .setColor('2f3136');
                message.channel.send(helpembed);
            break;
        }
    }
}