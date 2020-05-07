const Discord = require('discord.js');

module.exports = {
    name: 'invite',
    description: 'Get a Link to invite this Bot to your own Server.',
    guildOnly: false,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'],
    execute(message, args) {
        const invEmbed = new Discord.RichEmbed()
		.setTitle('Invite ' + username + ' to your Server!')
        .addField('Because, why not?', 'Use [this](https://discordapp.com/oauth2/authorize?client_id=656593790177640448&scope=bot&permissions=758578262) Link to add me to your Server!')
        .setThumbnail(bot.user.avatarURL)
        .setColor('0089d2');
		message.channel.send(invEmbed);
    }
}