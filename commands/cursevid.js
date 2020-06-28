const Discord = require('discord.js');
const client = require('../index').client;
const checkurl = require('valid-url');
const axios = require('axios').default;
const config = require('../config.json');
var url = require("url");
var p = require("path");
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

String.prototype.splice = function(start, delCount, newSubStr) {
    return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
};

module.exports = {
    name: 'cursevid',
    description: 'ee',
    syntax: 'cursevid',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES'],
    cooldown: 10000,
    dev_only: false,
    disabled: false,
    aliases: ['cursedvid'],
    execute(message, args) {
        if (!fs.existsSync('conversions/')) fs.mkdirSync('conversions');

        if (!args[0]) args[0] = '';

        if (args[0].toLowerCase() == 'help' || args[0].toLowerCase() == 'h' || args[0] == '') {
            let embed = new Discord.RichEmbed()
            .setTitle('Cursed videos')
            .setDescription(`> Cursed videos are videos with an "impossible" length.\n> Please note that only .webm videos are supported.\n\nTo create one, type: ${config.prefix}cursevid [Curse type] [Video link]\nCurse type can be one of the following:`)
            .addField('"increasing_length" or "il', `The videos length will increase as you watch the video.`)
            .addField('"zero_length" or "zl', `The video length will always be zero.`)
            .addField('"negative_length" or "nl', `A really big, cursed, negative number. (-14458517:-23)`)
            .setTimestamp();
            message.channel.send(embed);
            return;
        }

        if (args[1] == undefined && message.attachments.first() == undefined) return message.channel.send('You need to either attach a video or add a link to the video you are trying to fuck with.');

        let targetURL;
        let targetName;
        if (checkurl.isWebUri(args[1])) {

            if (!(args[1].startsWith('https://cdn.discordapp.com/attachments/') || args[1].startsWith('https://media.discordapp.net/attachments/'))) return message.channel.send('Sorry, you can only use Discord links.');

            targetURL = args[1];
            targetName = p.basename(url.parse(targetURL).pathname);
        } else {
            targetURL = message.attachments.first().url;
            targetName = message.attachments.first().filename;
        }
        fs.mkdirSync('conversions/' + message.id);

        let isWebm = p.extname(targetName) == '.webm';
        if (!isWebm) targetName += '.webm';

        let writeStream = fs.createWriteStream('conversions/' + message.id + '/' + targetName);

        axios({
            method: 'get',
            url: targetURL,
            responseType: 'stream'
        })
        .then(function(res) {
            if (isWebm) {
                res.data.pipe(writeStream);
            } else {
                // Convert to .webm file
                console.log('Conversion to WEBM started.');
                message.channel.send('Processing...').then(m => {
                    let lastUpdate = Date.now();
                    try {
                        new ffmpeg(res.data).toFormat('webm').on('error', e => {
                            console.log('FFMPEG error');
                            console.error(e);
                            return message.channel.send(e); 
                        }).on('progress', info => {
                            if (Date.now() > lastUpdate + 2500) {
                                m.edit('Processing... Frame ' + info.frames);
                                lastUpdate = Date.now();
                            }
                        }).on('end', () => {
                            m.delete();
                        }).pipe(writeStream);
                    } catch (e) {
                        /* Send an error when FFMPEG fails */
                        console.log('FFMPEG error');
                        console.log(e);
                        return message.channel.send('Error: FFMPEG failed to convert the video: ' + e + ' \n Please use a video with the .webm format instead.');
                    }
                });
            }
        });

        let repwith;
        switch (args[0].toLowerCase()) {
            case 'increasing_length': 
            case 'inc_length':
            case 'inclength':
            case 'il':
                repwith = '4489883ff0000000';
            break;
            case 'zero_length':
            case 'zerolength':
            case 'zl':
                repwith = '4489000000000000';
            break;
            case 'negative_length':
            case 'neg_length':
            case 'neglength':
            case 'nl':
                repwith = '44898842FFB060';
            break;
            default: 
            return message.channel.send(`Invalid curse type, check ${config.prefix}cursevid help`);
        }

        writeStream.on('close', s => {
            if (!isWebm) console.log('Write Stream closed.');
            if (p.extname(`conversions/${message.id}/${targetName}`) != '.webm') return message.channel.send('Invalid file format: Only video files are supported.');

            const size = fs.statSync('conversions/' + message.id + '/' + targetName).size / 1000000.0;
            if (size > 8) return message.channel.send('This video is too large.');

            // This is where the magic happens
            let file = fs.readFileSync(`conversions/${message.id}/${targetName}`);
            let str = file.toString('hex');
            let ind = str.indexOf('4489');
            if (!ind || ind < 0) return message.channel.send('Can\'t convert this video.');
            let newstr = str.toString().splice(ind, ind + repwith.length, repwith);
            str = newstr.substr(0, ind + 16) + str.substr(ind + 16);
            let buf = Buffer.from(str, 'hex');
            fs.writeFileSync(`conversions/${message.id}/result.webm`, buf, {encoding: 'utf-8'});
            message.channel.sendFile(`conversions/${message.id}/result.webm`);
            });
    }
}
