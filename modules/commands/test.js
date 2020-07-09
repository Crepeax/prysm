module.exports = {
    name: 'test',
    description: 'Simple test command.',
    syntax: 'test',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES'],
    cooldown: 1500,
    dev_only: false,
    disabled: false,
    execute(message) {
        message.channel.send(`I'm online, ${message.author.username}!`)
    }
}