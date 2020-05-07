const Discord = require('discord.js');

module.exports = {
    name: 'ghostping',
    description: 'Ghostping someone. Requires Manage Messages permission.',
    aliases: ['gp'],
    syntax: 'ghostping [@Mention]',
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS'],
    guildOnly: true,
    cooldown: 5000,
    execute(message, args) {

        if (args[0] == undefined) {
        
            message.delete();
        
            message.channel.send(`<@${message.author.id}>, you have to mention someone for this command to work!`);
        } else if (!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.hasPermission('ADMINISTRATOR')) {
            let invPermsEmbed = new Discord.RichEmbed()
            .setTitle('Insufficient Permissions')
            .setDescription('You aren\'t permitted to ghostping.')
            .setFooter('You need MANAGE_MESSAGES or ADMINISTRATOR permissions for that.')
            .setColor('ff0000');
            message.channel.send(invPermsEmbed);
        } else {
            message.delete();
            let attachment = new Discord.Attachment('./images/ping.png', 'ping.png');
            let pingEmbed = new Discord.RichEmbed()
            .setTitle('Ping, Pong, Ping, Pong, Ping, Pong')
            .setDescription('Someone just got\n***G H O S T P I N G E D***')
            .setColor('ff0000')
            .attachFile(attachment)
            .setThumbnail('attachment://ping.png');
            message.channel.send(pingEmbed)
            .then(m => {
                m.delete(3000);
            });
        }
    }
}