const Discord = require('discord.js');
const fs = require('fs');
const config = require('../../config.json');
const { exception } = require('console');
const data = require('../../bot');
const client = data.client;
const getPrefix = require('../../functions/getPrefix').getPrefix;

/* Yes I know that there are better ways to do this */
var Developers = [        // People who have access to the #dev Commands.
    '284323826165350400', // Im_Verum
    '345809592422367232', // Crepeax
    // '286195078324813826'  // Toophy
];

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
                        .addField(`${pre}dev reconnect`, 'Disconnect and reconnect the bot to the Discord Servers.')
                        .addField(`${pre}dev terminate`, 'Calls process.exit() and stops the process.')
                        .addField(`${pre}dev leave`, 'Make the bot leave the server. ')
                        .addField(`${pre}dev list`, 'List everyone who is permitted to use these commands.')
                        .addField(`${pre}dev setnick`, `Set the Bot's nickname in this guild.`)
                        .addField(`${pre}dev debugerror`, `Trigger an error. Debug command.`)
                        .addField(`${pre}dev rlcmds`, `Reload all commands.`);
                        if (!(Developers.indexOf(message.author.id) > -1)) DevHelpEmbed.setDescription(`Note: You are not a developer, so you can't use any of these commands.`);
                        message.channel.send(DevHelpEmbed);
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
                if (args[0] == undefined) {
                    const devDeniedEmbed = new Discord.RichEmbed()
                    .setTitle('Dev-only command!')
                    .setDescription('Seems like you found a developer-only command!\nThese commands are not intended for public use, but you can still view them: \n`+dev help` to see all commands or `+dev list` to see all developers.');
                    message.channel.send(devDeniedEmbed);
                } else {
                    const devDeniedEmbed = new Discord.RichEmbed()
                    .setTitle('Dev-Only command!')
                    .setDescription('You are not permitted to use this command.')
                    .setColor('ff0000');
                    message.channel.send(devDeniedEmbed);
                }
            }
        }
    }