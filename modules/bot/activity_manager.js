const Discord = require('discord.js');
const data = require('../../bot');
const client = data.client;
const config = require('../../config.json');
const { db } = require('../../bot');

module.exports.run = () => {
    client.once('ready', () => {
        client.user.setActivity(`Shard ${client.shard.id}: Online!`, {type: 'WATCHING'});

        let index = 0;
        setTimeout(function() {
            // Update the bot's activity every X seconds
            setInterval(() => {
                const guildSize = data.db.clientCache.guildSize;
                const userSize = data.db.clientCache.userSize;
                let activityList = [
                    {name: `you`, type: "WATCHING"},
                    {name: `${guildSize} guilds`, type: "WATCHING"},
                    {name: `${userSize} users`, type: "WATCHING"},
                    {name: `with you`, type: "PLAYING"},
                    {name: `+help`, type: "LISTENING"}
                ]

                client.user.setActivity(activityList[index].name, {type: activityList[index].type});

                index += 1;
                if (index == activityList.length) index = 0;
            }, 20000);
        }, 30000);
    });
}

module.exports.meta = {
    name: 'activity_manager',
    priority: 5
}