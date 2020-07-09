const Discord = require('discord.js');
const client = require('../../bot').client;
const config = require('../../config.json');

module.exports = {
    name: 'vote',
    description: 'Like Prysm? Vote to support me!',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'],
    execute(message, args) {
        let embed = new Discord.RichEmbed()
        .setTitle('Vote for Prysm!')
        .setDescription('If you like Prysm, please consider [voting](https://botsfordiscord.com/bot/656593790177640448/vote).')
        .setColor('2f3136');
        message.channel.send(embed);
    },
    vote(data) {

        if (data.type == 'vote') {
            let voter = client.users.get(data.user);

            let voteDMEmbed = new Discord.RichEmbed()
                .setTitle('Vote received.')
                .setDescription('Thanks for voting for Prysm.')
                .setFooter(`You voted ${data.votes.totalVotes} times.`)
                .setColor('00ff00');

            let voteEmbed = new Discord.RichEmbed()
                .setTitle(`Thanks vor voting, ${voter.username}.`)
                .setDescription(`${voter} voted ${data.votes.totalVotes} times.`)
                .setColor('00ff00');

            const voteGuild = client.guilds.get(config.voteGuild);
            const voteChannel = client.guilds.get(config.voteGuild).channels.get(config.voteChannel);

        
            if (voter != undefined) voter.send(voteDMEmbed);
            voteChannel.send(voteEmbed);
        } else if (data.type == 'test') {
            let testVoteEmbed = new Discord.RichEmbed()
                .setTitle(`Test vote received.`)
                .setColor('00ff00');
            voteChannel.send(testVoteEmbed);
        }
    }
}