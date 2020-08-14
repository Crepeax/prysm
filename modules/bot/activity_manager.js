const Discord = require('discord.js');
const data = require('../../bot');
const client = data.client;
const config = require('../../config.json');
const { db } = require('../../bot');

module.exports.run = () => {
    client.once('ready', () => {
        client.user.setActivity(`Shard ${client.shard.ids[0]}: Online!`, {type: 'WATCHING'});

        let index = 0;
        setTimeout(function() {
            // Update the bot's activity every X seconds
            setInterval(() => {
                const guildSize = data.db.clientCache.guildSize;
                const userSize = data.db.clientCache.userSize;

                // Some semi-random status messages
                let activityList = [
                    {name: `on ${guildSize} guilds`, type: "PLAYING"},
                    {name: `you`, type: "WATCHING"},
                    {name: `${userSize} users`, type: "WATCHING"},
                    {name: `with you`, type: "PLAYING"},
                    {name: `with ${userSize} ${Math.floor(Math.random()) == 0 ? 'users' : 'friends'}`, type: "PLAYING"},
                    {name: `${guildSize} guilds`, type: "WATCHING"},
                    {name: `${userSize} ${Math.floor(Math.random()) == 0 ? 'users' : 'people'}`, type: "WATCHING"},
                    {name: `+help`, type: "LISTENING"},
                    {name: `${userSize} children`, type: "LISTENING"},
                    {name: `${userSize} ${Math.floor(Math.random()) == 0 ? 'people' : 'users'} on ${guildSize} ${Math.floor(Math.random()) == 0 ? 'servers' : 'guilds'}`, type: Math.floor(Math.random()) == 0 ? "LISTENING" : "WATCHING"},
                ]

                client.user.setActivity(activityList[index]);

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