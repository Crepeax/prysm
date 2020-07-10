const Discord = require('discord.js');
const fs = require('fs');
const config = require('../../config.json');
const data = require('../../bot');
const client = data.client;
const { getPrefix } = require('../../functions/getPrefix');
const { getFlags, setFlag, clearFlags } = require('../../functions/permission_flags');
const { log } = require('../../functions/logging');
const permissionFlags = require('../../permission_levels.json');
const { db } = require('../../bot');

/* Yes I know that there are better ways to do this */
var Developers = [        // People who have access to the #dev Commands.
    '284323826165350400', // Im_Verum
    '345809592422367232', // Crepeax
    // '286195078324813826'  // Toophy
];

/* To-do
 * Execute dev commands as modules
 * Use permission flags for dev commands
 */

module.exports = {
    name: 'dev',
    description: 'Developer-only commands.',
    guildOnly: false,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'],
    devlist: Developers,
    cooldown: 0,
    /**
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    execute(message, args) {
            let pre = getPrefix(message.guild);
            if (Developers.indexOf(message.author.id) > -1 || args[0] == 'help' || args[0] == 'list') {
                switch(args[0]) { // --------------------------------------------------------------------------------------------------
                    case 'help':
                        const DevHelpEmbed = new Discord.RichEmbed()
                        .setColor('9d23eb')
                        .setTitle('Developer command overview')
                        .addField(`${pre}dev serverlist`, `Returns a list of all servers ${client.user.username} is currently active on.`)
                        .addField(`${pre}dev setpermission [ID]`, `Set a bot permission flag for a specific user.`)
                        .addField(`${pre}dev listpermissions [ID]`, `List all bot permission flags for a specific user.`)
                        .addField(`${pre}dev exportpermissions`, `Export a JSON file with all permission flags for all users.`)
                        .addField(`${pre}dev reconnect`, 'Disconnect and reconnect the bot to the Discord Servers.')
                        .addField(`${pre}dev terminate`, 'Calls process.exit() and stops the process.')
                        .addField(`${pre}dev leave`, 'Make the bot leave the server. ')
                        .addField(`${pre}dev setnick`, `Set the Bot's nickname in this guild.`)
                        .addField(`${pre}dev debugerror`, `Trigger an error. Debug command.`)
                        .addField(`${pre}dev rlcmds`, `Reload all commands.`);
                        if (!(Developers.indexOf(message.author.id) > -1)) DevHelpEmbed.setDescription(`Note: You are not a developer, so you can't use any of these commands.`);
                        message.channel.send(DevHelpEmbed);
                    break;
                    case 'setpermission':
                    case 'setperms':
                    case 'setperm':
                        let mention = message.mentions.users.first();
                        let target;
                        if (mention) {
                            target = mention;
                            cont();
                        }
                        else if (args[1]) {
                            client.fetchUser(args[1], true).then(user => {
                                target = user;
                                cont();
                            }).catch(e => {
                                if (!isNaN(args[1])) {
                                    return message.channel.send('Can\'t set flags for this user: User not found.');
                                } else {
                                    return message.channel.send('The provided user ID is not valid.');
                                }
                            });
                        } else return message.channel.send('Error: No user provided.');

                        function cont() {
                            if (target.bot) return message.channel.send('Can\'t set permission flags for bots.');
                            if (args[2] == 'CLEAR' ||args[2] == 'RESET') {
                                message.channel.send('Clearing all permission flags for that user.');
                                clearFlags(target);
                                log('Permission flags cleared', `Cleared permission flags for ${target.id || target} <@${target.id || target}>\nExecuted by ${message.author.id} <@${message.author.id}>`, true)
                            }
                            else if (args[2] && args[3]) {
                                // Check if author is allowed to change the flag
                                let highest = 0;
                                let userFlags = getFlags(message.author);
                                if (!userFlags) userFlags = {}
                                Object.keys(userFlags).forEach(flag => {
                                    if (userFlags[flag]) {
                                        if (permissionFlags[flag] && message.author.id != data.db.botOwner.id) if (permissionFlags[flag] > highest) highest = permissionFlags[flag];
                                    }
                                });
                                if (permissionFlags[args[2].toUpperCase()] >= highest && message.author.id != data.db.botOwner.id) {
                                    log('Permission flag update failed', `Failed to update flag '${args[2].toUpperCase()}' for ${target.id || target} <@${target.id || target}>:\nThe author has a lower permission level than the target flag (${permissionFlags[args[2].toUpperCase()]} > ${highest})`)
                                    return message.channel.send('You are not permitted to change this flag');
                                }

                                // Update the flag
                                if (!isNaN(args[3])) args[3] = Number(args[3]);
                                if (args[3] == 'true') args[3] = true;
                                if (args[3] == 'false') args[3] = false;
                                if (args[3] == 'undefined' || args[3] == 'clear') args[3] = undefined;
                                setFlag(target, args[2].toUpperCase(), args[3]);
                                log('Permission flags updated', `Permission flag '${args[2].toUpperCase()}' was set to ${args[3]} for user ${target.id || target} <@${target.id || target}>\nExecuted by ${message.author.id} <@${message.author.id}>`)
                                message.channel.send('Permission flag updated.');
                            } else {
                                if (!args[2]) return message.channel.send('No permission flag provided');
                                if (!args[3]) return message.channel.send('No value provided');
                            }
                        }
                    break;
                    case 'listpermissions':
                    case 'listperms':
                    case 'listperm':
                        if (!isNaN(args[1]) ||message.mentions.users.first()) client.fetchUser(message.mentions.users.first() || args[1]).then(user => {
                            let perms = db.permissionFlags.get(user.id);
                            if (!perms) return message.channel.send('No permission flags set for this user.');
                            message.channel.send(`Permissions for ${user.username}#${user.discriminator}\`\`\`json\n${JSON.stringify(perms, null, 4)}\`\`\``);
                        }).catch(() => message.channel.send('I can\'t find that user.'));
                        else {
                            if (!args[1]) return message.channel.send('No user provided.');
                            else return message.channel.send('Invalid user ID provided.');
                        }
                    break;
                    case 'exportpermissions':
                    case 'exportperms':
                    case 'exportperm':
                        message.channel.send('Export started, finished file will be sent to your DMs');
                        let exported_json = {}
                        data.db.permissionFlags.forEach((value, key) => {
                            exported_json[key] = value;
                        });
                        fs.writeFile(`./data-storage/export-files/permission-export-${message.id}.json`, JSON.stringify(exported_json, null, 4), function(err) {
                        message.author.send({file: `./data-storage/export-files/permission-export-${message.id}.json`});
                    });
                    break;
                    case 'reconnect':
                        const reconnectMsg = new Discord.RichEmbed()
                        .setDescription('Reconnecting...');
                        message.channel.send(reconnectMsg);
                        const token = client.token;

                        client.destroy();
                        client.login(token).then(() => {
                            const reconnectMsg2 = new Discord.RichEmbed()
                            .setDescription('Done!');
                            message.channel.send(reconnectMsg2);

                            delete token;
                        });
                    break;
                    case 'leave':
                        if (message.guild == null) {
                            return message.channel.send('This is not possible in direct messages.');
                        }
                        const leaveEmbed = new Discord.RichEmbed()
                        .setTitle('Leaving.')
                        .setColor('ff0000');
                        message.channel.send(leaveEmbed); 
                        message.guild.leave();
                    break;
                    case 'serverlist':
                        if (!require('../core/login').testingMode) return message.channel.send('This is only available in testing mode.');
                         let serverlist = [];
                         var i = 0;
                         client.guilds.forEach(function(Element) {
                            serverlist[i] = Element.name;
                            i++;
                         });
                         let servers = serverlist.join('\n');
                         let serverlistEmbed = new Discord.RichEmbed()
                         .setTitle('Server List')
                         .setDescription(servers)
                         .setFooter('I am currently on ' + serverlist.length + ' Servers!')
                         .setColor('3333ff');
                         message.channel.send(serverlistEmbed);
                    break;
                    case 'list':
                        let devListEmbed = new Discord.RichEmbed()
                        .setTitle(`Dev List | ${Developers.length} total`)
                        .setColor('0000ff');
                        var i;
                        for (i = 0; i < Developers.length; i++) {
                            devListEmbed.addField(`${Developers[i]}`, `${client.users.get(Developers[i])} | ${client.users.get(Developers[i]).username}#${client.users.get(Developers[i]).discriminator}`);
                        }
                        message.channel.send(devListEmbed);
                    break;
                    case 'setnick':
                        if (args[1] == undefined) {
                            message.guild.members.get(client.user.id).setNickname('');
                            message.react('✅');
                        } else if (args.slice(1).join(' ').length > 32) {
                            return message.channel.send('That name is too long. Maximum is 32 characters.');
                        } else {
                            message.guild.members.get(client.user.id).setNickname(args.slice(1).join(' '));
                            message.react('✅');
                        }
                    break;
                    case 'debugerror':
                        throw console.error('Debug error');
                    break;
                    case 'terminate':
                        message.channel.send('Terminating process.')
                        .then(() => {
                            process.exit(0);
                        });
                    break;
                    case 'reloadcommands':
                    case 'rlcmds':
                    case 'rlc':
                        require('../core/command_loader').reloadAll();
                        message.channel.send('Reloading.');
                    break;
                    default:
                        const DevInvalidEmbed = new Discord.RichEmbed()
                        .setTitle('Invalid Argument.')
                        .setDescription(`Use ${pre}dev help for a command list.`)
                        .setColor('ff0000');
                        message.channel.send(DevInvalidEmbed);
                } // -----------------------------------------------------------------------------------------------------------------
            } else {
                const devDeniedEmbed = new Discord.RichEmbed()
                .setTitle('Dev-Only command!')
                .setDescription('You are not permitted to use this command. You need the `BOT_OWNER` or `BOT_DEVELOPER` permission for that.')
                .setColor('ff0000');
                message.channel.send(devDeniedEmbed);
            }
        }
    }