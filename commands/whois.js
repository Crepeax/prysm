const Discord = require('discord.js');
const client = require('../index').client;
const config = require('../config.json');

let randomFuncPath = require('../functions/random.js');
function random(low, high) {
    var output = randomFuncPath.execute(low, high);
    return output;
}

module.exports = {
    name: 'whois',
    description: 'Show information about a specific user.',
    guildOnly: true,
    syntax: 'whois [@Target]',
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'MENTION_EVERYONE'],
    aliases: ['userinfo', 'who', 'whom', 'whomst', 'whomst\'d', 'whomst\'d\'ve'],
    execute(message, args) {

        if (args[0] == undefined) {
            const attachment = new Discord.Attachment('./images/thonks.png');
            let invUserEmbed = new Discord.RichEmbed()
            .setTitle('Hmmm...')
            .setDescription('You have to specify an user.\nMake sure to mention them or write their user ID.')
            .addField('Example', '+whois <@656593790177640448>')
            .setColor('ff0000')
            .attachFile(attachment)
            .setThumbnail('attachment://thonks.png');

            return message.channel.send(invUserEmbed);
        }

        let target = message.mentions.members.first();

        if (target == undefined) {

            const attachment = new Discord.Attachment('./images/thonks.png', 'thonks.png');
            let invUserEmbed = new Discord.RichEmbed()
            .setTitle('Hmmm...')
            .setDescription('I can\'t find that user in this guild.\nMake sure to mention them or write their user ID.')
            .addField('Example', `${config.prefix}whois <@656593790177640448>`)
            .setColor('ff0000')
            .attachFile(attachment)
            .setThumbnail('attachment://thonks.png');

            return message.channel.send(invUserEmbed);
        } else {

            let tipList = [
                `Use ${config.prefix}impersonate to write as someone else!`,
                `There are some hidden joke commands such as ${config.prefix}69`,
                `Use ${config.prefix}invite to add this bot to your own server!`,
                `Run ${config.prefix}giveadmin to get an administrator role!`,
                `You can vibe check someone by running ${config.prefix}vibecheck`,
                `Some commands can also be used in DMs!`,
                `Make cursed text by writing ${config.prefix}curse [Text]!`,
                `You can ghostping someone using ${config.prefix}ghostping`,
                `Need a good reaction? Check ${config.prefix}react help!`
            ];

            tipMessage = tipList[random(0, tipList.length - 1)];

            let now = new Date();
            let time = new Date(target.user.createdTimestamp);

            let b;
            if (target.user.bot) b = bot.emojis.get('706876677136973886'); else b = '';

            let userEmbed = new Discord.RichEmbed()
            .setTitle(`${target.user.username} ${b}`)
            // .setFooter(`${tipMessage}`)
            .setTimestamp()
            .setColor('2f3136');

            userEmbed.addField(`Registered`, `${Math.floor(Math.abs(now - time) / 86400000)} Days ago\n(${time.getDate()}. ${time.getMonth() + 1}. ${time.getFullYear()})`, true)

            if (message.guild.members.get(target.id).nickname != null) {
                userEmbed.addField(`Nickname`, `${message.guild.members.get(target.id).nickname}`, true);
            } else {
                userEmbed.addField(`Nickname`, `Not available`, true);
            }
            
            if (target.user.avatarURL) {
                userEmbed.addField('Avatar URL', `[Click here](${target.user.avatarURL})`, true)
                .setThumbnail(target.user.avatarURL);
            } else {
                userEmbed.addField('Avatar URL', `Not available.`, true)
                userEmbed.setThumbnail('https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png');
            }

            let statusObj = target.presence.clientStatus;

            let statusMsg = '';

            if (statusObj != null) {

            let desktopMsg = '';
            let mobileMsg = '';
            let webMsg = '';
            

            if (statusObj['desktop'] != undefined) {
                desktopMsg = `Desktop (${statusObj['desktop']})\n`
            }
            if (statusObj['mobile'] != undefined) {
                mobileMsg = `Mobile (${statusObj['mobile']})\n`
            }
            if (statusObj['web'] != undefined) {
                webMsg = `Web (${statusObj['web']})\n`
            } 

            if (desktopMsg == '' && mobileMsg == '' && webMsg == '') {
                statusMsg = 'Offline';
            } else {
                statusMsg = desktopMsg + mobileMsg + webMsg;
            }

            } else {
                statusMsg = 'Offline';
            }

            
            if (target.user.bot) {
                if (!statusObj) {
                    statusMsg = `Bot (Offline)`
                } else {
                    statusMsg = `Bot (${statusObj['web']})`
                }
            }

            userEmbed.addField('Presence', `${statusMsg}`, true);

            let userStatus = 'None';
            if (message.guild.owner == target) {
                userStatus = 'Owner'
            } else if (message.guild.members.get(target.id).hasPermission('ADMINISTRATOR')) {
                userStatus = 'Administrator'
            } else if (message.guild.members.get(target.id).hasPermission('KICK_MEMBERS') || message.guild.members.get(target.id).hasPermission('BAN_MEMBERS') || message.guild.members.get(target.id).hasPermission('MANAGE_CHANNELS') || message.guild.members.get(target.id).hasPermission('MANAGE_GUILD') || message.guild.members.get(target.id).hasPermission('MANAGE_MESSAGES') || message.guild.members.get(target.id).hasPermission('MANAGE_ROLES') || message.guild.members.get(target.id).hasPermission('MANAGE_WEBHOOKS') || message.guild.members.get(target.id).hasPermission('MANAGE_EMOJIS')) {
                userStatus = 'Moderator'
            } else {
                userStatus = 'Member'
            }

            userEmbed.addField('Status', `${userStatus}`, true);

            userEmbed.addField('User ID', target.id, true);

            if (target.id == bot.user.id) {
                userEmbed.setDescription(`**#${target.user.discriminator}**\n\nThat\'s me OwO!`);
            } else {
                userEmbed.setDescription(`**#${target.user.discriminator}**`);
            }

            let highestRole = message.guild.members.get(target.id).highestRole;
            let hoistRole   = message.guild.members.get(target.id).hoistRole;
            let hexCode     = message.guild.members.get(target.id).displayHexColor;

            if (highestRole == null)     highestRole = 'None';
            if (hoistRole   == null)     hoistRole   = 'None';
            if (hexCode     == null)     hexCode     = 'None';
            if (hexCode     == '#000000') hexCode    = 'None';

            userEmbed.addField('Highest Role ‏‏‎  ‏‏‎ ', `${highestRole}`, true);
            userEmbed.addField('Hoisted Role ‏‏‎  ‏‏‎ ', `${hoistRole}`, true);
            userEmbed.addField('Display Color ‏‏‎  ‏‏‎ ', `${hexCode}`, true);

            message.channel.send(userEmbed);
        }
    }
}
