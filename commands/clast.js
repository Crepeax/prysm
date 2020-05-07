const Discord = require('discord.js');

module.exports = {
    name: 'clearlast',
    description: 'Deletes your last message.',
    guildOnly: true,
    syntax: 'ca',
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'MANAGE_MESSAGES'],
    aliases: ['clast', 'cla', 'ca'],
    execute(message, args) {

        message.channel.fetchMessages({limit: 21})
        .then(msgs => {

            let i = true;
            let o = 0;

            while (i == true) {
                o += 1
                if (msgs.array()[o].author.id == message.author.id) i = msgs.array()[o];
                if (o > 19) i = false;
            }

            if (i == false) return message.channel.send('I couldn\'t find any recent messages sent by you.').then(m => {m.delete(10000); message.delete(10000)});

            message.channel.bulkDelete([message, i]).catch(e => {
                if (e == 'DiscordAPIError: You can only bulk delete messages that are under 14 days old.') {
                    return message.channel.send('The message you are trying to delete is older than 2 weeks.').then(m => {m.delete(10000); message.delete(10000)});
                } else {
                    throw new console.error(e);
                }
            });
        })
    }
}