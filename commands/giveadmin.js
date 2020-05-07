const Discord = require('discord.js');

module.exports = {
    name: 'giveadmin',
    description: 'Get Administrator Permissions by exploiting a root vulnerability in the mainframe.',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'],
    execute(message, args) {
        let attachment = new Discord.Attachment('./images/no_admin_for_you.png', 'vibecheck.png');
		let embed = new Discord.RichEmbed()
		.attachFile(attachment)
		.setImage('attachment://vibecheck.png')
		.setColor('2f3136');
        message.channel.send(embed);
    }
}