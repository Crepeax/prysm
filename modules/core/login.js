const Discord = require('discord.js');
const config = require('../../config.json');
const data = require('../../bot');
const client = data.client;
const { log } = require('../../functions/logging');

module.exports.run = () => {
    let token = config.token;
    if (config.testingComputers.includes(process.env.LOGONSERVER)) { token = config.test_token; this.testingMode = true; }

    console.log(`[Shard ${client.shard.id}] Logging in...`);
    client.login(token)
    .catch((reason) => {
        console.log(`[Shard ${client.shard.id}] ${'\x1b[31m'}Login failed${'\x1b[0m'}`);
        console.error(reason);
        client.destroy();
    });

    client.once('ready', () => {
        console.log(`[Shard ${client.shard.id}] Successfully logged in as ${client.user.username}`);
        client.shard.broadcastEval(`this.users.cache.get("${config.botOwner}")`).then(owner => data.db.botOwner = owner[0]);
        log(`Shard ${JSON.stringify(client.shard.ids)} Ready`, `Successfully logged in as ${client.user.username}#${client.user.discriminator}.`);
    });
}

module.exports.testingMode = false;
module.exports.meta = {
    name: 'login',
    priority: 3
}