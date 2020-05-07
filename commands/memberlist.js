const Discord = require('discord.js');

module.exports = {
    name: 'memberlist',
    description: 'Returns all members in the Guild.',
    aliases: ['members'],
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'],
    cooldown: 3000,
    execute(message, args) {
        var members = message.guild.members.array();
        if (toString(members).length > 2048) return message.channel.send('Sorry, but this server is too large to show all members in one message.');
		let memberListEmbed = new Discord.RichEmbed()
		.setTitle(message.guild.name + `'s Member List`)
		.setDescription(members)
		.setFooter(members.length + ' users total');
		message.channel.send(memberListEmbed);
    }
}