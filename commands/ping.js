const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'See the bot\'s ping and some other statistics.',
    guildOnly: false,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'],
    aliases: ['latency', 'stats', 'uptime'],
    execute(message, args) {

        let botPing = Math.floor(new Date().getTime() - message.createdTimestamp);
        let msgPing = '...';
        let apiPing = '...';
        let uptime  = Math.floor(bot.uptime);

        let pingEmbed = new Discord.RichEmbed()
        .setTitle('Pong')
        .setColor('ffff00')
        .addField(`Discord API Ping`, `\`${apiPing}ms\``, true)
        .addField(`Message Delay`, `\`${msgPing}ms\``, true)
        .addField(`Bot Ping`, `\`${botPing}ms\``, true)
        .addField(`Uptime`, `\`(${uptime}ms)\``)
        .setTimestamp();
        message.channel.send(pingEmbed)
        .then(m => {
            let date = new Date();
            let uptimeDate = new Date(date - uptime);
            let uptimeStr;

            let d = true;
            if (d == true && uptime < 1000) { 
                uptimeStr = (`${Math.floor(uptime)} Milliseconds`);
                d = false;
            } else {uptime = uptime / 1000}

            if (d == true && uptime < 60) { 
                uptimeStr = (`${Math.floor(uptime)} Seconds`);
                d = false;
            } else {uptime = uptime / 60}
            
            if (d == true && uptime < 60) { 
                uptimeStr = (`${Math.floor(uptime)} Minutes`);
                d = false;
            } else {uptime = uptime / 60}

            if (d == true && uptime < 24) { 
                uptimeStr = (`${Math.floor(uptime)} Hours`);
                d = false;
            } else {uptime = uptime / 24}

            if (d == true && uptime < 7) { 
                uptimeStr = (`${Math.floor(uptime)} Days`);
                d = false;
            } else {uptime = uptime / 7}

            if (d == true && uptime < 4) { 
                uptimeStr = (`${Math.floor(uptime)} Weeks`);
                d = false;
            } else {uptime = uptime / 4}

            if (d == true && uptime < 12) { 
                uptimeStr = (`${Math.floor(uptime)} Months`);
                d = false;
            } 
            
            if (d) {uptimeStr = (`${Math.floor(uptime)} Years`)}

            pingEmbed.fields.splice(0, 4);
            msgPing = (m.createdTimestamp - message.createdTimestamp);
            apiPing = Math.floor(bot.ping);
            pingEmbed.addField(`Discord API Ping`, `\`${apiPing}ms\``, true);
            pingEmbed.addField(`Message Delay`, `\`${msgPing}ms\``, true);
            pingEmbed.addField(`Bot Ping`, `\`${botPing}ms\``, true);
            pingEmbed.addField(`Uptime`, `\`Since ${uptimeDate.getDate()}. ${uptimeDate.getMonth() + 1}. ${uptimeDate.getFullYear()} (${uptimeStr})\``)
            pingEmbed.setColor('00ff00');
            
            m.edit(pingEmbed)
            .catch(Error => {
                m.delete();
                message.channel.send('Oops! An Error occurred.\n' + Error);
            })
        });
    }
}