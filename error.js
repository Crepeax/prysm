const Discord = require('discord.js');
const client = require('./index').client;
const config = require('./config.json');

module.exports = {
    error(message, error) {
        let canDelete = false;
        let done = false;
        let me;
        if (message.guild) if (message.guild.members.get(client.user.id).permissions.has('MANAGE_MESSAGES')) canDelete = true;
		let embed = new Discord.RichEmbed()
		    .setTitle('An error has occurred.')
		    .setDescription('An error has occurred while executing your command, ' + message.author.username + `.\nTo report this error, react with ✅`)
		    .setFooter(`Error ID: ${message.id}`)
            .setColor('ff0000');
            message.channel.send(embed).then(m => {
                me = m;
                m.react('✅');
                const filter = (reaction) => reaction != undefined;
                const collector = new Discord.ReactionCollector(m, filter, {time: 300000});
                collector.on('collect', r => {
                    if (r.emoji == '✅') {
                        r.users.forEach(user => {
					if (user.id == message.author.id) {
                        let newEmbed = new Discord.RichEmbed()
		                    .setTitle('An error has occurred.')
		                    .setDescription('An error has occurred while executing your command, ' + message.author.username + `.\nThe error has been successfully reported.`)
		                    .setFooter(`Error ID: ${message.id}`)
                            .setColor('ff0000');
                        
                        done = true;

                        let whereText;

                        if (message.guild) whereText = `${message.guild.name}\` | \`${message.channel.name}\`\nBot perms: \`${message.guild.members.get(client.user.id).permissions.raw}`; else whereText = 'Direct messages'; 

                        let errReportEmbed = new Discord.RichEmbed()
                            .setTitle(`Error ${message.id}`)
                            .setDescription(`Message: \`${message.content}\`\nError: \`${error}\`\nWhere: \`${whereText}\`\nAuthor: \`${message.author.username}#${message.author.discriminator}\` ${message.author}`)
                            .setTimestamp();

                            client.guilds.get(config.errorServer).channels.get(config.errorChannel).send(client.guilds.get(config.errorServer).roles.get('703348209400938497'), errReportEmbed);

                        if (canDelete) r.message.clearReactions();
                        r.message.edit(newEmbed);
					} else if (user.id != client.user.id) {
						if (message.guild) r.remove(user);
                    }})
                } else r.remove();
            })
                collector.on('end', c => {
                    let endEmbed = new Discord.RichEmbed()
		                    .setTitle('An error has occurred.')
		                    .setDescription('An error has occurred while executing your command, ' + message.author.username + `.`)
		                    .setFooter(`Error ID: ${message.id}`)
                            .setColor('ff0000');
                    if (!done) m.edit(endEmbed);
                    if (canDelete) m.clearReactions();
                })
            })
    }   
}