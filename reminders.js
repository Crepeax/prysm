const Discord = require('discord.js');
const client = require('./index').client;
const fs = require('fs');
const config = require('./config.json');

let timeouts = [];

module.exports = {
    setReminder(user, time, msg, message) {
        let file = JSON.parse(fs.readFileSync(`./reminders.json`));
        if (!file[user.id]) file[user.id] = {};
        file[user.id][message.id] = {"time": time, "msg": msg}
        fs.writeFileSync('./reminders.json', JSON.stringify(file));
        this.setTimeouts();
        let doneEmbed = new Discord.RichEmbed()
        .setTitle('Reminder set!')
        .setDescription(`You will receive a DM when your reminder is due.\nTo delete your reminders, type ${config.prefix}remindme delall.`)
        .setThumbnail('https://cdn.discordapp.com/attachments/670669491956482049/705452981101002843/checksecondary61.gif')
        .setColor('04d3c3');
        message.channel.send(doneEmbed);
    },
    listReminders(user) {
        return JSON.parse(fs.readFileSync(`./reminders.json`));
    },
    delReminder(user, time, timer) {

    },
    delAllReminders(user) {
        let file = JSON.parse(fs.readFileSync(`./reminders.json`));
        file[user.id] = undefined;
        fs.writeFileSync('./reminders.json', JSON.stringify(file));
        this.setTimeouts();
    },
    setTimeouts() {
        timeouts.forEach(t => {
            clearTimeout(t);
        })
        timeouts = [];
        let file = JSON.parse(fs.readFileSync(`./reminders.json`));
        Object.keys(file).forEach(u => {
            Object.keys(file[u]).forEach(o => {
                const now = Date.now();
                const timer = file[u][o].time - now;
                timeouts.push(setTimeout(function() {
                    let mesg = new Discord.RichEmbed()
                    .setTitle('Here\'s your reminder')
                    .setDescription(file[u][o].msg)
                    .setFooter(`You received this message because\nyou used the ${config.prefix}remindme command.`)
                    .setTimestamp()
                    .setColor('2f3136');
                    if (client.users.get(u)) client.users.get(u).send(mesg);
                    file[u][o] = undefined;
                    fs.writeFileSync('./reminders.json', JSON.stringify(file));
                }, timer));
            })
        })
    }
}