const Discord = require('discord.js');
const ytdl = require('ytdl-core')

function genQueue(message) {
    let playCmd = require('./play');
    let audioPlayer = require('../functions/audioPlayer');
    if (audioPlayer.connections[message.guild.id] == undefined) {
        return message.channel.send('I am not playing anything right now.');
    }
    let qEmbed = new Discord.RichEmbed()
    .setColor('36393f')
    .setTitle(`${message.guild.name}'s queue`)
    .setTimestamp()
    .setDescription('Use `+disconnect` if the bot does not work as intended.');

    let q = playCmd.currentQueue[message.guild.id];

    console.log(playCmd.currentQueue[message.guild.id]);

    i = 0;
    o = 0;
    uwu = playCmd.currentQueue[message.guild.id].length;

    playCmd.currentQueue[message.guild.id].forEach(t => {
        console.log(`t: ${t}`);
        let desc;
        if (i == 0) desc = 'Now playing:'; else
        if (i == 1) desc = 'Next up:'; else
        desc = `Position ${i + 1} in queue:`;
        i = i + 1;
        ytdl.getInfo(t)
        .then(info => {
            qEmbed.addField(desc, `[${info.title}](${info.video_url})`);
            o = o + 1;
        });
    }); 

    setInterval(function() {
        if (o == uwu) {
            clearInterval(this);
            message.channel.send(qEmbed);
        }
    }, 100);
    
}

module.exports = {
    name: 'queue',
    description: 'Show the current music queue.',
    guildOnly: true,
    aliases: ['q'],
    dev_only: false,
    disabled: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'CONNECT', 'SPEAK', 'EMBED_LINKS'],
    execute(message, args) {

        genQueue(message);        
}
}