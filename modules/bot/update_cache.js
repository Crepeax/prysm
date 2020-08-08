const Discord = require('discord.js');
const data = require('../../bot');
const client = data.client;

module.exports.run = function() {
    setInterval(() => {
        if (!require('../../sharding_manager').allReady) return;

        client.shard.fetchClientValues(`guilds.size`).then(guildsArr => {
            let guilds = 0;
            guildsArr.forEach(size => guilds += size);
            data.db.clientCache.guildSize = guilds;
        });
            
        client.shard.fetchClientValues(`users.size`).then(usersArr => {
            let users = 0;
            usersArr.forEach(size => users += size);
            
            data.db.clientCache.userSize = users;
        });
    }, 3000);
}

module.exports.meta = {
    name: 'update_cache',
    priority: 6
}