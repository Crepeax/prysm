const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('../../config.json');
client.login(config.token);

module.exports = {
    vote(data) {
        if (data.type == 'vote') {
            let voter = client.users.get(data.user);

            let voteDMEmbed = new Discord.RichEmbed()
                .setTitle('Vote received.')
                .setDescription('Thanks for voting for Prysm.')
                .setFooter(`Your vote is number ${data.votes.votes24} today.`)
                .setColor('00ff00');

            let voteEmbed = new Discord.RichEmbed()
                .setTitle(`Thanks for voting, ${voter.username}.`)
                .setDescription(`${voter} just voted for Prysm. Total vote count today: ${data.votes.votes24}.`)
                .setColor('00ff00');

            const voteGuild = client.guilds.get(config.voteGuild);
            const voteChannel = client.guilds.get(config.voteGuild).channels.get(config.voteChannel);

        
            if (voter != undefined) voter.send(voteDMEmbed);
            voteChannel.send(voteEmbed);
        } else if (data.type == 'test') {
            const voteChannel = client.guilds.get(config.voteGuild).channels.get(config.voteChannel);
            let testVoteEmbed = new Discord.RichEmbed()
                .setTitle(`Test vote received.`)
                .setColor('00ff00');
            voteChannel.send(testVoteEmbed);
        }
    }
}