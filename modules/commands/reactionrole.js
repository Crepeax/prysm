const Discord = require('discord.js');
const client = require('../../bot').client;
const Enmap = require('enmap');
const mainfile = require('../../bot');
const { compileClientWithDependenciesTracked } = require('pug');
const { arg } = require('mathjs');

let reactionroles = new Enmap({name: 'reactionroles'});

client.on('messageReactionAdd', (reaction, user) => {
    if (user.bot) return;
    let dbEntry = reactionroles.find('messageID', reaction.message.id);
    if (!dbEntry) return;
    let role = reaction.message.guild.roles.get(dbEntry.roleID);
    if (!role) return user.send('The reaction role you requested is no longer available.');
    reaction.message.guild.member(user).addRole(role);
});

client.on('messageReactionRemove', (reaction, user) => {
    if (user.bot) return;
    let dbEntry = reactionroles.find('messageID', reaction.message.id);
    if (!dbEntry) return;
    let role = reaction.message.guild.roles.get(dbEntry.roleID);
    if (!role) return user.send('The reaction role you requested is no longer available.');
    reaction.message.guild.member(user).removeRole(role);
});

client.once('ready', () => {
    setTimeout(function() {
        console.log('\n[Reaction Roles] Caching ' + reactionroles.size + ' messages.');
        reactionroles.forEach(rr => {
            let guild = client.guilds.get(rr.guildID);
            let channel = client.channels.get(rr.channelID);
            if (!guild) return console.log('[Reaction Roles] Failed to fetch guild');
            if (!channel) return console.log('[Reaction Roles] Failed to fetch channel');
            let message = channel.fetchMessage(rr.messageID);
            if (!message) return console.log('[Reaction Roles] Failed to fetch message.'); else console.log('[Reaction Roles] Cached message.');
        });
    }, 2500);
});

module.exports = {
    name: 'reactionrole',
    description: 'Allow users to give roles to themselves when they react to a message.',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],
    aliases: ['rr', 'reactionroles', 'reactrole', 'rrole'],
    cooldown: 5000,
    dev_only: true,
    execute(message, args) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send('You don\'t have permission to use this command on this server.');
        switch(args[0]) {
            case 'create':
            case 'add':
            case 'new':
                let ended = false;
                if (reactionroles.findAll('guildID', message.guild.id) >= 5) return message.channel.send('You can\'t have more than 5 of these at once. If you need more, you can ask on the Discord: https://discord.gg/aTRHKUY')
                let target = 'channel';
                let reactionChannel, reactionMessage, reactionEmote, reactionRole;
                message.channel.send('Please send the channel you want your reaction role to be in. Example: ' + message.channel);
                let collector = new Discord.MessageCollector(message.channel, m => !m.author.bot, {time: 300000});
                collector.on('collect', m => {
                    if (message.content.toLowerCase() == 'cancel') {
                        ended = true;
                        collector.stop();
                        message.channel.send('Cancelled.');
                        return;
                    }
                    if (message.content.startsWith(mainfile.prefix && mainfile.prefix.length > 0)) return collector.stop();
                    if (target == 'channel') {
                        let channel = m.mentions.channels.first();
                        if (!channel) return message.channel.send('I can\'t find that channel. Make sure you put a # in front of the channel name.').then(m => m.delete(10000));
                        reactionChannel = channel;
                        target = 'message';
                        message.channel.send('Please reply with the ID of the message you want to add a reaction role to. If you don\'t know how to get the message ID, check this: https://bit.ly/2ZB08L3');
                    } 
                    else if (target == 'message') {
                        reactionChannel.fetchMessage(m.content).then(msg => {
                            reactionMessage = msg;
                            target = 'emote';
                            message.channel.send('Please react to this message with the emoji you want to use for your reaction ID. Only use emojis from this server!').then(mesg => {
                                let ecollector = new Discord.ReactionCollector(mesg, (reaction) => reaction != undefined /* idk how these filters work */, {time: 300000});
                                ecollector.on('collect', reaction => {
                                    reaction.users.forEach(user => {
                                        if (user.id != bot.user.id && user.id != message.author.id) {
                                            if (message.guild) r.remove(user);
                                        }
                                    });
                                    let emoji = reaction.emoji;
                                    if (!emoji) {
                                        message.channel.send('I can\'t use this emoji. Make sure you only use emojis from this guild.').then(n => n.delete(10000));
                                        reaction.remove();
                                        return;
                                    }
                                    let flag = true;
                                    message.channel.send('OK.').then(mesg => mesg.react(emoji).catch(() => {
                                        flag = false;
                                        return mesg.edit('I can\'t use this emoji. Make sure you only use emojis from this guild.').then(n => n.delete(10000));
                                    }).then(() => {
                                        if (!flag) return;
                                        reactionEmote = emoji;
                                        ecollector.stop();
                                        reaction.remove();
                                        message.channel.send('Please @mention the role you want the reaction role to give to users.');
                                        target = 'role'; 
                                    }));
                                });
                            });
                            
                        }).catch(e => {message.channel.send('I can\'t find that message.')});
                    } else if (target == 'role') {
                        let role = m.mentions.roles.first();
                        if (!role) return message.channel.send('You need to @mention a role.').then(m => m.delete(10000));
                        reactionRole = role;
                        target = 'confirm';
                        message.channel.send(new Discord.RichEmbed().setTitle('Is this correct?').setDescription(`Channel: ${reactionChannel}\nMessage: [This message](${reactionMessage.url})\nRole: ${reactionRole}\nEmoji: ${reactionEmote}\nReply with "yes" or "no".`));
                    } else if (target == 'confirm') {
                        if (m.content.toLowerCase() == 'yes' || m.content.toLowerCase() == 'ye' || m.content.toLowerCase() == 'y' || m.content.toLowerCase() == 'j') {
                            message.channel.send('Saving...').then(msg => {
                                let emIsDefault = false;
                                let emID;
                                if (!reactionEmote.id) emIsDefault = true;
                                if (emIsDefault) emID = reactionEmote.name; else emID = reactionEmote.id;
                                reactionroles.set(reactionMessage.id, {
                                    guildID: message.guild.id,
                                    channelID: reactionChannel.id,
                                    messageID: reactionMessage.id,
                                    roleID: reactionRole.id,
                                    defaultEmote: emIsDefault,
                                    emoteID: emID
                                });
                                reactionMessage.react(reactionEmote);
                                msg.edit('Done!');
                                ended = true;
                                collector.stop();
                                return;
                            })
                        } else if (m.content.toLowerCase() == 'no' || m.content.toLowerCase() == 'n') {
                            message.channel.send('Cancelled.');
                            ended = true;
                            collector.stop();
                            return;
                        } else {
                            message.channel.send('Reply with yes or no.');
                        }
                    }
                    else if (target == 'emote') {
                        message.channel.send('You need to react to the message above.')
                    } else {
                        collector.stop();
                        message.channel.send('Sorry, something went wrong.');
                        return;
                    }
                });
                collector.on('end', () => {
                    if (!ended) {
                        message.channel.send('Cancelled reaction role creation.');
                    }
                });
            break;

            case 'delete':
            case 'remove':
            case 'del':
            case 'rm':
                let t = reactionroles.get(args[1]) || reactionroles.find(rr => rr.messageID == args[1]);
                console.log(t);
                if (!args[1]) return message.channel.send(`You need to specify the reaction role ID. Check \`${mainfile.prefix}rr list\` to see the IDs.`);
                if (!t) return message.channel.send(`I can\'t find that reaction role. Check \`${mainfile.prefix}rr list\` to see the reaction role IDs.`);
                let rguild = client.guilds.get(t.guildID);
                if (!rguild) return message.channel.send(`I can\'t find that reaction role. Check \`${mainfile.prefix}rr list\` to see the reaction role IDs.`);
                if (rguild.id != message.guild.id) return message.channel.send(`I can\'t find that reaction role. Check \`${mainfile.prefix}rr list\` to see the reaction role IDs.`);
                if (reactionroles.get(args[1])) reactionroles.delete(args[1]); else reactionroles.delete(t.messageID);
                message.channel.send('Reaction role deleted.');
            break;

            case 'list':
            case 'show':
                let rrlist = [];
                reactionroles.forEach(item => {
                    if (item.guildID == message.guild.id) rrlist.push(item);
                });
                if (rrlist.length == 0) return message.channel.send('This server does not have any reaction roles.');
                let rrembed = new Discord.RichEmbed()
                .setTitle(`${message.guild.name}'s reaction roles`)
                .setColor('2f3136');
                let guild = message.guild;
                rrlist.forEach(rr => rrembed.addField('ID: ' + rr.messageID, `Where: [${guild.channels.get(rr.channelID)}](https://discordapp.com/channels/${rr.guildID}/${rr.channelID}/${rr.messageID})\nRole: ${guild.roles.get(rr.roleID)}\nEmoji: ${rr.defaultEmote ? rr.emoteID : client.emojis.get(rr.emoteID)}`));
                message.channel.send(rrembed);
            break;

            default: 
                let helpEmbed = new Discord.RichEmbed()
                .setTitle('Reaction Roles!')
                .setDescription(`Let your members give roles to themselves by reacting to a message.\n\n\`${mainfile.prefix}rr create → Create a new reaction role.\`\n\n\`${mainfile.prefix}rr list → List your reaction roles.\`\n\n\`${mainfile.prefix}rr delete <ID> → Delete a reaction role.\nYou can get the ID with ${mainfile.prefix}rr list.\``);
                message.channel.send(helpEmbed);
                return;
        }
    }
}
