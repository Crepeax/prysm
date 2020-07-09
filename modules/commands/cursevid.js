const Discord = require('discord.js');
const client = require('../../bot').client;
const checkurl = require('valid-url');
const axios = require('axios').default;
const config = require('../../config.json');
var url = require("url");
var p = require("path");
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

String.prototype.splice = function(start, delCount, newSubStr) {
    return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
};

const conversionFolder = `data-storage/conversions/`;

// Don't convert videos to WEBM in these guilds
let busyGuilds = {}

// Maximum number of conversions at once
let maxConversions = 4;

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

        // Check if a file was provided
        if (args[1] == undefined && message.attachments.first() == undefined) return message.channel.send('You need to either attach a video or add a link to the video you are trying to fuck with.');

        // Get the provided URL or the URL of the file
        let targetURL;
        let targetName;
        if (checkurl.isWebUri(args[1])) {
            // Check if the URL is a Discord URL
            if (!(args[1].startsWith('https://cdn.discordapp.com/attachments/') || args[1].startsWith('https://media.discordapp.net/attachments/'))) return message.channel.send('Sorry, you can only use Discord links.');

            targetURL = args[1];
            targetName = p.basename(url.parse(targetURL).pathname);
        } else {
            targetURL = message.attachments.first().url;
            targetName = message.attachments.first().filename;
        }
        fs.mkdirSync(conversionFolder + '/' + message.id);

        // Download the file
        let isWebm = p.extname(targetName) == '.webm';
        if (!isWebm) targetName += '.webm';

        let writeStream = fs.createWriteStream(conversionFolder + '/' + message.id + '/' + targetName);

        axios({
            method: 'get',
            url: targetURL,
            responseType: 'stream'
        })
        .then(function(res) {
            if (isWebm) {
                res.data.pipe(writeStream);
            } else {
                // Stop when a video is already converting in that guild or too many other videos are converting at once
                if (busyGuilds[message.guild.id]) return message.channel.send('I am already converting a video to another format. Please try again later or provide a .webm video.');
                if (Object.keys(busyGuilds).length > maxConversions) return message.channel.send('I am currently converting other too many videos. Please try again later or provide a .webm video.');
                busyGuilds[message.guild.id] = true;
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
                            // Mark guild as 'available'
                            busyGuilds[message.guild.id] = undefined;
                        }).pipe(writeStream);
                    } catch (e) {
                        // Mark guild as 'available'
                        busyGuilds[message.guild.id] = undefined;
                        // Send an error when FFMPEG fails
                        console.log('FFMPEG error');
                        console.log(e);
                        return message.channel.send('Error: FFMPEG failed to convert the video: ' + e + ' \n Please use a video with the .webm format instead.');
                    }
                });
            }
        });

        // Select the 'curse type'
        let replaceWith;
        switch (args[0].toLowerCase()) {
            case 'increasing_length': 
            case 'inc_length':
            case 'inclength':
            case 'il':
                replaceWith = '4489883ff0000000';
            break;
            case 'zero_length':
            case 'zerolength':
            case 'zl':
                replaceWith = '4489000000000000';
            break;
            case 'negative_length':
            case 'neg_length':
            case 'neglength':
            case 'nl':
                replaceWith = '44898842FFB060';
            break;
            default: 
            return message.channel.send(`Invalid curse type, check ${config.prefix}cursevid help`);
        }

        writeStream.on('close', s => {
            if (!isWebm) console.log('Write Stream closed.');
            if (p.extname(`${conversionFolder}/${message.id}/${targetName}`) != '.webm') return message.channel.send('Invalid file format: Only video files are supported.');

            const size = fs.statSync(conversionFolder + '/' + message.id + '/' + targetName).size / 1000000.0;
            if (size > 8) return message.channel.send('This video is too large.');

            /**This is where the magic happens:
             * Read the file and convert it from buffer to string
             * Then, find the part of the string where the video length is 'stored'
             * Replace the text after that with the new length
             * The new length is saved in the 'replaceWith' variable
             * Convert the video back to buffer and write that buffer to a file: result.webm
             * Finally, after sending result.webm, all files get deleted.
             * */
            let file = fs.readFileSync(`${conversionFolder}/${message.id}/${targetName}`);
            let str = file.toString('hex');
            let ind = str.indexOf('4489');
            if (!ind || ind < 0) return message.channel.send('Can\'t convert this video.');
            let newstr = str.toString().splice(ind, ind + replaceWith.length, replaceWith);
            str = newstr.substr(0, ind + 16) + str.substr(ind + 16);
            let buf = Buffer.from(str, 'hex');
            fs.writeFileSync(`${conversionFolder}/${message.id}/result.webm`, buf, {encoding: 'utf-8'});
            message.channel.sendFile(`${conversionFolder}/${message.id}/result.webm`)
            .then(() => {
                // Delete the files
                if (fs.existsSync(`${conversionFolder}/${message.id}/${targetName}`)) fs.unlinkSync(`${conversionFolder}/${message.id}/${targetName}`);
                if (fs.existsSync(`${conversionFolder}/${message.id}/result.webm`))   fs.unlinkSync(`${conversionFolder}/${message.id}/result.webm`);
                if (fs.existsSync(`${conversionFolder}/${message.id}`))               fs.rmdirSync(`${conversionFolder}/${message.id}`);
            });
            });
    }
}
