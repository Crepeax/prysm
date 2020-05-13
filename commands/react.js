const Discord = require('discord.js');
const fs = require('fs');
const fsextra = require('fs-extra');
const checkurl = require('valid-url');
const axios = require('axios').default;
var url = require("url");
var p = require("path");
const devlist = require('./dev').devlist;
const config = require('../config.json');

function find(obj, tar) {
    let t;
    Object.keys(obj).forEach(o => {
        if (obj[o].toLowerCase() == tar.toLowerCase()) {
            u = false;
            t = o;
        }
    })
    return t;
}

if (!fs.existsSync('./reactions/')) fs.mkdirSync('./reactions/');

module.exports = {
    name: 'react',
    description: 'Save an image and then send it with a command.',
    aliases: ['r', 're', 'img', 'image'],
    guildOnly: false,
    syntax: 'r [[add/save] [Name] [URL to image] or [delete] [Name] or [delall] or [Name of the image]]',
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'],
    dev_only: false,
    cooldown: 3000,
    execute(message, args) {

        const path = `./reactions/${message.author.id}`;
        if (!fs.existsSync(path)) fs.mkdirSync(path);
        if (!fs.existsSync(path + '/files')) fs.mkdirSync(path + '/files');
        if (!fs.existsSync(path + '/cfg.json')) fs.writeFileSync(path + '/cfg.json', '{}');

        const file = JSON.parse(fs.readFileSync(`${path}/cfg.json`));

        if (args[0] == undefined) args[0] = '';

        switch(args[0].toLowerCase()) {
            case 'add':
            case 'save':
                if (args[1] == undefined) return message.channel.send('Missing args[1]');
                if (args[2] == undefined && message.attachments.first() == undefined) return message.channel.send('Missing args[2] or attachment');

                args[1] = args[1].toLowerCase();

                if (args[1] == 'add'
                ||  args[1] == 'save'
                ||  args[1] == 'del'
                ||  args[1] == 'delete'
                ||  args[1] == 'remove'
                ||  args[1] == 'delall'
                ||  args[1] == 'deleteall'
                ||  args[1] == 'list'
                ||  args[1] == 'show'
                ||  args[1] == 'all'
                ||  args[1] == 'help') {
                    return message.channel.send('That name is not available.');
                } else if (file[args[1]] != undefined) {
                    return message.channel.send('You already used that name.');
                }

                let targetURL;
                let targetName;
                let savedAs;

                if (checkurl.isWebUri(args[2])) {

                    if (!args[2].startsWith('https://cdn.discordapp.com/attachments/')) return message.channel.send('Sorry, you can only use Discord links.');

                    targetURL = args[2];
                    targetName = p.basename(url.parse(targetURL).pathname);
                 } else {
                    targetURL = message.attachments.first().url;
                    targetName = message.attachments.first().filename;
                 }

                savedAs = message.id + '-' + targetName;

                 let fileLimit = 10;
                 let maxSize = 5; // in MB
                 let allowedFileTypes = [
                    '.png',
                    '.jpg',
                    '.jpeg',
                    '.jfif',
                    '.gif',
                    '.mp4',
                    '.flv',
                    '.mov',
                    '.webp'
                 ];

                 if (devlist.indexOf(message.author.id) > -1) fileLimit = Number.POSITIVE_INFINITY;
                 if (devlist.indexOf(message.author.id) > -1) maxSize = Number.POSITIVE_INFINITY;

                let totalFiles = 0;
                 fs.readdirSync(path + '/files/').forEach(f => {
                    totalFiles += 1;
                 })

                 if (totalFiles >= fileLimit) return message.channel.send(`You can\'t upload more than ${fileLimit} files.`);

                try { // -------------------------------------------------------------------------------------------------------------------------- Download the file
                    let t;
                    let c = true;
            	    const writeStream = fs.createWriteStream(path + '/files/' + targetName).on('close', s => {
                        clearTimeout(t);
                        const size = fs.statSync(path + '/files/' + targetName).size / 1000000.0;
                        if (size > maxSize) {
                            fs.unlinkSync(path + '/files/' + targetName);
                            if (c) message.channel.send(`Sorry, but you can\'t upload files larger than ${maxSize}MB. (Your file: ${Math.round((size * 100) + Number.EPSILON) / 100}MB)`);
                        } else if (!(allowedFileTypes.indexOf(p.extname(path + '/files' + targetName)) > -1)) {
                            fs.unlinkSync(path + '/files/' + targetName);
                            message.channel.send('That file type is not supported.\nYou can only use images, GIFs and videos.')
                        } else {
                            fs.renameSync(path + '/files/' + targetName, path + '/files/' + savedAs);
                            message.channel.send(`File saved as \`${message.id}-${targetName}\`\nAccess it via \`+r ${targetName}\``);
                            file[args[1]] = savedAs;
                            fs.writeFileSync(path + '/cfg.json', JSON.stringify(file));
                        }
                    })
                    axios({
                        method: 'get',
                        url: targetURL,
                        responseType: 'stream'
                    })
                    .then(function(res) {
                        res.data.pipe(writeStream);
                        t = setTimeout(function() {
                            writeStream.close();
                            c = false;
                            return message.channel.send('File download took too long.');
                        }, 10000)
                    }) 
                    
                } catch(err) {
                    return message.channel.send('An error has occurred:\n' + err);
                } // ------------------------------------------------------------------------------------------------------------------------------ Download the file
            break;

            case 'delall':
            case 'deleteall':
                message.channel.send('Deleting all files...');
                fsextra.emptyDirSync(path);
                fs.rmdirSync(path);
                message.channel.send('Done.');
            break;
            case 'list':
            case 'all':
            case 'show':

                let embed = new Discord.RichEmbed()
                .setTitle('Your images')
                .setColor('00ff00');

                let i = 0;

                Object.keys(file).forEach(f => {
                    i += 1;
                    embed.addField(`${file[f]}`, `\`${f}\``, true);
                })

                if (i == 0) i = 'no';

                embed.setDescription(`You have ${i} saved images.`);

                message.channel.send(embed);

            break;
            case 'del':
            case 'delete':
            case 'rem':
            case 'remove':
                if (args[1] == undefined) return message.channel.send('You have to specify which file you want me to delete.');
                args[1] = args[1].toLowerCase();
                if (file[args[1]] == undefined && find(file, args[1]) == undefined) return message.channel.send('I can\'t find that image.');
                if (file[args[1]]) {
                    fs.unlinkSync(path + '/files/' + file[args[1]]);
                    file[args[1]] = undefined;
                    fs.writeFileSync(path + '/cfg.json', JSON.stringify(file));
                    message.channel.send('Done!');
                } else {
                    fs.unlinkSync(path + '/files/' + file[find(file, args[1])]);
                    file[find(file, args[1])] = undefined;
                    fs.writeFileSync(path + '/cfg.json', JSON.stringify(file));
                    message.channel.send('Done!');
                }
            break;
            case 'help':
                let hembed = new Discord.RichEmbed()
                .setDescription('This command allows you to save images, and then access them with a command.')
                .addField('Usage', `To save an image, type ${config.prefix}r add [Name] [Link to file]. You can also attach the image to your message instead of including a link.\nYou can view all saved images with ${config.prefix}r list. Delete an image with ${config.prefix}r delete, or delete all images with ${config.prefix}r delall.\nMaximum file size is 5MB, and you can store up to 10 images at once. Only images, videos and GIFs are supported.\n\nTo send an image, just type ${config.prefix}r [Name].`)
                message.channel.send(hembed);
            break;
            case undefined:
            case '':
                message.channel.send(`Type ${config.prefix}help to learn about this command.`)
            break;
            default:
                if (file[args[0]]) {

                    function sendHook(webhook) {
                        let nick;
                        if (bot.guilds.get(message.guild.id).members.get(message.author.id).nickname == null) nick = message.author.username; else nick = bot.guilds.get(message.guild.id).members.get(message.author.id).nickname;
                        webhook.send('', {
                            username: nick,
                            avatarURL: message.author.avatarURL,
                            file: path + '/files/' + file[args[0]]
                        });
                        message.delete();
                    }
            
                    message.channel.fetchWebhooks()
                    .then(hooks => {
                    if (hooks.first() == undefined) {
                        message.channel.createWebhook(`${bot.user.username}`, bot.user.avatarURL)
                        .then(hook => {
                            sendHook(hook);
                        })
                        .catch(console.error);
                    } else sendHook(hooks.first());
                })

                } else {
                    message.channel.send(`I couldn\'t find that file. Type '${require('../config.json').prefix}r help' for help.`);
                }
            break;
        }
    }
}