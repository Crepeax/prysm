const Discord = require('discord.js');
const client = require('../../bot').client;

module.exports = {
    name: 'invite',
    description: 'Get a Link to invite this Bot to your own Server.',
    guildOnly: false,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'],
    execute(message, args) {
        
        let url = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=`
        let perms = {
            admin: '8',
            recommended: '1073216886',
            limited: '641002824'
        }
        let descs = {
            admin: `Give Prysm full access to your server.\nOnly use this if you want to use private voice channels.`,
            recommended: `It is recommended to use this link.\nUse this if you want to use all commands without giving Prysm Administrator permissions.`,
            limited: `Only give basic permissions to Prysm.\nUse this only if you only want to use chat-based commands.`
        }
        
        let description = 'Use one of these links to invite Prysm.\nUnless you need to, go with "Recommended".\nHover over a link to see more details.\n\n';
        description += `[Recommended](${url}${perms.recommended} "${descs.recommended}") - `;
        description += `[Administrator](${url}${perms.admin} "${descs.admin}") - `;
        description += `[Minimal](${url}${perms.limited} "${descs.limited}")`;

        const invEmbed = new Discord.RichEmbed()
            .setTitle('Invite Prysm to your Server!')
            .setDescription(description)
            .setThumbnail(client.user.avatarURL)
            .setColor('0089d2');

		message.channel.send(invEmbed);
    }
}