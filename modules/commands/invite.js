const Discord = require('discord.js');
const { client, db, modules } = require('../../bot');

module.exports.name         = 'invite';
module.exports.description  = 'Invite Prysm to your server!';
module.exports.syntax       = 'invite';
module.exports.guildOnly    = false;
module.exports.dev_only     = false;
module.exports.disabled     = false;
module.exports.hidden       = false;
module.exports.botPerms     = ['SEND_MESSAGES', 'EMBED_LINKS'];
module.exports.userPerms    = [];

/**
 * @param {Discord.Message} message 
 * @param {Array} args 
 */
module.exports.execute = (message, args) => {
    const invEmbed = new Discord.MessageEmbed()
        .setTitle('Invite Prysm to your Server!')
        .setDescription(description.replace('%%%CLIENTID%%%', require('../core/login').testingMode ? client.user.id : '656593790177640448'))
        .setThumbnail(client.user.avatarURL)
        .setColor('0089d2');

    message.channel.send(invEmbed);
}


let url = `https://discord.com/oauth2/authorize?client_id=%%%CLIENTID%%%&scope=bot&permissions=`
let perms = {
    admin: '8',
    recommended: '1073216886',
    limited: '641002824'
}
let descs = {
    admin: `Give Prysm full (Administrator) permissions on your server.`,
    recommended: `It is recommended to use this link.\nUse this if you want to use all commands without giving Prysm Administrator permissions.`,
    limited: `Only give basic permissions to Prysm.\nUse this if you don't want to use moderation commands.`
}

let description = 'Use one of these links to invite Prysm.\nUnless you need to, go with "Recommended".\nHover over a link to see more details.\n\n';
description += `[Recommended](${url}${perms.recommended} "${descs.recommended}") - `;
description += `[Administrator](${url}${perms.admin} "${descs.admin}") - `;
description += `[Minimal](${url}${perms.limited} "${descs.limited}")`;

