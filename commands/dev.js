const Discord = require('discord.js');
const fs = require('fs');
const config = require('../config.json');
const client = require('../index').client;

var Developers = [        // People who have access to the #dev Commands.
    '284323826165350400', // Im_Verum
    '345809592422367232' // Crepeax
];

module.exports = {
    name: 'dev',
    description: 'Developer-only commands.',
    guildOnly: false,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'],
    devlist: Developers,
    cooldown: 0,
    execute(message, args) {
            
            if (Developers.indexOf(message.author.id) > -1 || args[0] == 'help' || args[0] == 'list') {
                switch(args[0]) { // --------------------------------------------------------------------------------------------------
                    case 'help':
                        const DevHelpEmbed = new Discord.RichEmbed()
                        .setColor('9d23eb')
                        .setTitle('Developer command overview')
                        //.addField(`${pre}dev serverlist`, `Returns a list of all servers ${bot.user.username} is currently active on.`)
                        .addField(`${pre}dev log <Log Message>`, `Logs a specific message.`)
                        .addField(`${pre}dev reconnect`, 'Disconnect and reconnect the bot to the Discord Servers.')
                        .addField(`${pre}dev restart`, 'Restarts the bot.')
                        .addField(`${pre}dev destroy`, 'Disconnects and stops the Bot.')
                        .addField(`${pre}dev leave`, 'Make the bot leave the server. ')
                        .addField(`${pre}dev list`, 'List everyone who is permitted to use these commands.')
                        .addField(`${pre}dev sendupdate`, `Send a Message to every User who registered using \`${config.prefix}newsletter register\``)
                        .addField(`${pre}dev resetvoice`, `Disconnect the bot from every voice channel and reset the queues.`)
                        .addField(`${pre}dev setnick`, `Set the Bot's nickname in this guild.`)
                        .addField(`${pre}dev debugerror`, `Trigger an error. Debug command.`);
                        if (!(Developers.indexOf(message.author.id) > -1)) DevHelpEmbed.setDescription(`Note: You are not a developer, so you can't use any of these commands.`);
                        message.channel.send(DevHelpEmbed);
                    break;
                    case 'reconnect':
                        const reconnectMsg = new Discord.RichEmbed()
                        .setTitle('Reconnecting...')
                        .setDescription('The Bot will reconnect in 3 Seconds.')
                        .setColor('ff0000');
                        message.channel.send(reconnectMsg);
                        setTimeout(function(){
                            bot.destroy();
                            bot.login(conf.token);
                            const reconnectMsg2 = new Discord.RichEmbed()
                            .setTitle('Done!')
                            .setDescription('Reconnected to the Discord Servers!')
                            .setColor('00ff00');
                            message.channel.send(reconnectMsg2);
                         }, 3000);
                    break;
                    case 'leave':
                        if (message.guild == null) {
                            return message.channel.send('This is not possible here.');
                        }
                        const leaveEmbed = new Discord.RichEmbed()
                        .setTitle('Leaving.')
                        .setColor('ff0000');
                        message.channel.send(leaveEmbed); 
                        message.guild.leave();
                    break;
                    case 'log':
                         let logMsg = args.slice(1).join(' ');
                         if (logMsg.length == 0) {
                            let errEmbed = new Discord.RichEmbed()
                            .setTitle('Invalid Arguments')
                            .setDescription('You need to specify the message!')
                            .setFooter(`${pre}dev log <message>`)
                            .setColor('ff0000');
                            message.channel.send(errEmbed);
                            return;
                         }
                         console.log(`[Log] [${message.author.username}] ${logMsg}`);
                         let logEmbedSuccess = new Discord.RichEmbed()
                         .setTitle('Logged Message!')
                         .setDescription(logMsg)
                         .setColor('00ff00');
                         message.channel.send(logEmbedSuccess);
                    break;
                    /*case 'serverlist':
                         let serverlist = [];
                         var i = 0;
                         bot.guilds.forEach(function(Element) {
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
                    break;*/
                    case 'destroy':
                        let confDestroyEmbed = new Discord.RichEmbed()
                        .setTimestamp()
                        .setTitle('Confirm')
                        .addField(`Please type ${pre}confirm within the next 10 seconds.`, `Please note that this action will shut the bot down.`)
                        .setColor('ff0000');
                        message.channel.send(confDestroyEmbed);
                        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {time: 10000});
                        collector.on('collect', msg => {
                            if (msg.content == `${pre}confirm`) {
                                console.log(`[Info] [${message.author.username}] Destroying...`);
                                let destroyEmbed = new Discord.RichEmbed()
                                .setTitle('Destroyed.');
                                msg.channel.send(destroyEmbed);
                                bot.fetchUser('284323826165350400').then(user => {
                                    let destroyedDMEmbed = new Discord.RichEmbed()
                                    .setTitle('Destroyed')
                                    .setDescription('The Bot has been stopped using the #dev destroy command.')
                                    .addField('Destroyed by:', `<@${message.member.user.id}>`)
                                    .addField('In Server: ', `${message.guild.name} (Owner: <@${message.guild.ownerID}>)`)
                                    .addField('Exact Message: ', `${message.content}`)
                                    .setTimestamp(message.createdTimestamp)
                                    .setColor('ff0000');
                                    user.send(destroyedDMEmbed);
                                })
                                setTimeout(function() {
                                    bot.destroy();
                                }, 1000)
                            }
                        })
                        collector.on('end', reason => {
                            let cancelEmbed = new Discord.RichEmbed()
                            .setTitle('Cancelled.')
                            .setColor('00ff00');
                            message.channel.send(cancelEmbed);
                        })
                    break;
                    case 'restart':

                        return message.channel.send('The restart command is currently disabled.\nIf you need to restart, ask my Owner.');

                        console.log('<><><><><><><><><><><><><><><><><><><><><><><><>');
                        console.log('<The Bot was manually restarted. This Log File >');
                        console.log('<or Console won\'t show the Bot\'s output anymore>');
                        console.log('<><><><><><><><><><><><><><><><><><><><><><><><>');
                        let restartEmbed = new Discord.RichEmbed()
                        .setTitle('The Bot is restarting.')
                        .setFooter('If the Bot replies twice to commands, restart again.')
                        .setTimestamp()
                        .setColor('00ff00')
                        .setDescription(`If something goes wrong, contact <@284323826165350400>!`);
                        message.channel.send(restartEmbed);
                        setTimeout(function() {
                            setTimeout(function() {
                            execute('sh startbot.sh /myDir');
                            }, 1000);
                            bot.destroy();
                            }, 1000);
                    break;
                    case 'list':
                        let devListEmbed = new Discord.RichEmbed()
                        .setTitle(`Dev List | ${Developers.length} total`)
                        .setColor('0000ff');
                        var i;
                        for (i = 0; i < Developers.length; i++) {
                            devListEmbed.addField(`${Developers[i]}`, `${bot.users.get(Developers[i])} | ${bot.users.get(Developers[i]).username}#${bot.users.get(Developers[i]).discriminator}`);
                        }
                        message.channel.send(devListEmbed);
                    break;
                    case 'sendupdate':
                        let title;
                        let content;
                        let waitForTitle = true;
                        let waitForMsg = false;
                        let messageauthor = message.author;

                        message.channel.send('Please reply with the Title of the Message or reply with \'cancel\' to cancel.')
                        const msgCollector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {time: 300000});
                        msgCollector.on('collect', msg => {
                            if (msg.author != messageauthor) return;
                            if (msg == 'cancel') {
                                message.channel.send('Cancelled.');
                                msgCollector.stop();
                                return;
                            } else if (waitForTitle) {
                                if (msg.content.length > 256) return message.channel.send('Your Title is too long, it has to be shorter than 256 characters. Please try again.');
                                waitForTitle = false;
                                waitForMsg = true;
                                title = msg;
                                message.channel.send('I set the Title to `' + title + '`\nPlease reply to this message with the message you want to broadcast or reply with \'cancel\' to cancel.');
                            } else if (waitForMsg) {
                                if (msg.content.length > 1500) return message.channel.send('Your Message is too long, it has to be shorter than 1500 characters. Please try again.');
                                waitForMsg = false;
                                content = msg;
                                let attachemnt = new Discord.Attachment('./images/ping.png', 'ping.png');
                                let preview = new Discord.RichEmbed()
                                    .attachFile(attachemnt)
                                    .setTitle(title)
                                    .setDescription(content)
                                    .setColor('8616E5')
                                    .setThumbnail('attachment://ping.png')
                                    .setFooter('Reply with \'send\' to send this message or with \'cancel\' to cancel.');
                                message.channel.send(preview);
                            } else if (msg == 'send') {
                                let attachemnt = new Discord.Attachment('./images/ping.png', 'ping.png');
                                let message = new Discord.RichEmbed()
                                    .attachFile(attachemnt)
                                    .setTitle(title)
                                    .setDescription(content)
                                    .setColor('8616E5')
                                    .setThumbnail('attachment://ping.png')
                                    .setFooter('You received this message because you registered for them. You can Opt-out at any time by using `#notify unregister`. This Message was sent by ' + messageauthor.username);

                                var error = 0;

                                let newsletter = JSON.parse(fs.readFileSync("./newsletter.json", "utf8"));
                                newsletter.newsletter.forEach(target => {
                                    if (bot.users.get(target) == undefined) {error++;} else {
                                        bot.users.get(target).send(message);
                                    }
                                });

                                let channelMessage = new Discord.RichEmbed()
                                    .attachFile(attachemnt)
                                    .setTitle(title)
                                    .setDescription(content)
                                    .setColor('8616E5')
                                    .setThumbnail('attachment://ping.png')
                                    .setFooter(`If you want to receive these messages in your DMs, type \`${config.prefix}notify register\`.\nThis Message was sent by ${messageauthor.username}.`);

                                let uServer = client.guilds.get(config.updateServer);
                                let uChannel = uServer.channels.get(config.updateChannel);

                                uChannel.send(channelMessage);

                                msg.channel.send('Done!');
                            }
                        })
                    break;
                    case 'resetvoice':
                        if (!message.guild) return message.channel.send('This command is guild-only.');
                        let queues = require('../functions/queues.js');
                        bot.voiceConnections.forEach(connection => {
                            connection.disconnect();
                            queues.setQueue(connection.channel.guild.id, undefined);
                        })
                        let audioPlayers = require('../functions/audioPlayer');
                        audioPlayers.connections = {};
                        audioPlayers.dispatchers = {};
                        message.react('✅');
                    break;
                    case 'setnick':
                        if (args[1] == undefined) {
                            message.guild.members.get(bot.user.id).setNickname('');
                            message.react('✅');
                        } else if (args.slice(1).join(' ').length > 32) {
                            return message.channel.send('That name is too long. Maximum is 32 characters.');
                        } else {
                            message.guild.members.get(bot.user.id).setNickname(args.slice(1).join(' '));
                            message.react('✅');
                        }
                    break;
                    case 'debugerror':
                        throw console.error('Debug error');
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