const data = require('../../bot');
const db = data.db;
const client = data.client;


module.exports = {
    name: 'getpermissions',
    aliases: ["getperms", "getperm"],
    flag: 1000,
    execute(message, args) {
        if (!isNaN(args[1]) ||message.mentions.users.first()) client.fetchUser(message.mentions.users.first() || args[1]).then(user => {
            let perms = db.permissionFlags.get(user.id);
            if (!perms) return message.channel.send('No permission flags set for this user.');
            message.channel.send(`Permissions for ${user.username}#${user.discriminator}\`\`\`json\n${JSON.stringify(perms, null, 4)}\`\`\``);
        }).catch(() => message.channel.send('I can\'t find that user.'));
        else {
            if (!args[1]) return message.channel.send('No user provided.');
            else return message.channel.send('Invalid user ID provided.');
        }   
    }
}

module.exports.devCommand = true;