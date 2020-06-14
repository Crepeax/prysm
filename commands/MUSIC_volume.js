const Discord = require('discord.js');
const client = require('../index').client;
const fs = require('fs');

module.exports = {
    name: 'volume',
    description: '',
    syntax: '',
    aliases: ['v', 'vol'],
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'VIEW_CHANNEL', 'SPEAK'],
    cooldown: 1500,
    dev_only: false,
    disabled: false,
    execute(message, args) {
        const manager = require('../music/music');
        
        let vc = manager.getVC(message.guild);
        if (!message.member.voiceChannel) return message.channel.send('You need to be connected to a voice channel.');
        if (message.member.voiceChannel.id != vc) return message.channel.send('You need to be in my voice channel to do this.');

        let file = JSON.parse(fs.readFileSync('music/volumes.json'));
        if (!file[message.guild.id]) file[message.guild.id] = 0.5;
        if (isNaN(file[message.guild.id])) file[message.guild.id] = 0.5;
        let volume = file[message.guild.id] * 100;
        fs.writeFileSync('music/volumes.json', JSON.stringify(file));

        if (!args[0]) {
            let embed = new Discord.RichEmbed()
            .setTitle(`The volume is set to ${volume}%`)
            .setColor('2f3136');

            let desc = '**0%** **';
            let lvol = Math.round(volume / 10);
            for (let i = 0; i <= 20; i += 1) {
                let char;
                if (i != lvol) char = '=';
                else char = '**⚪';
                desc += char;
            }
            desc += ` **200%**`
            embed.setDescription(desc);
            message.channel.send(embed);
        } else {
            if (isNaN(args[0])) return message.channel.send('You need to provide a number from 0 to 200.');
            let v = Math.round(parseInt(args[0]));
            if (v > 200 || v < 0) return message.channel.send('Please provide a number from 0 to 200.');
            file[message.guild.id] = v / 100;
            fs.writeFileSync('music/volumes.json', JSON.stringify(file));
            let embed = new Discord.RichEmbed()
            .setTitle(`The volume is set to ${v}%`)
            .setColor('2f3136');

            let desc = '**0%** **';
            let lvol = Math.round(v / 10);
            for (let i = 0; i <= 20; i += 1) {
                let char;
                if (i != lvol) char = '=';
                else char = '**⚪';
                desc += char;
            }
            desc += ` **200%**`

            if (volume == 0) desc = '**0%** :white_circle:==================== **200%**'

            embed.setDescription(desc);
            message.channel.send(embed);

            manager.setVolume(message.guild);
        }
    }
}