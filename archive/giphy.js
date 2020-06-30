const GphApiClient = require('giphy-js-sdk-core');
const config = require('../config.json');
const giphyToken = config.giphyToken;
const request = require('request');
const sanitizeHtml = require('sanitize-html');
const Discord = require('discord.js');
let output;

module.exports = {
    name: 'giphy',
    description: 'Search for a GIF on Giphy.',
    guildOnly: false,
    syntax: 'giphy [Search term/random]',
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'],
    aliases: ['gif', 'g'],
    cooldown: 2000,
    execute(message, args) {
        
        let invArgsEmbed = new Discord.RichEmbed()
                    .setTitle('GIPHY')
                    .setDescription('Write `giphy &[Rating] <Search Term>` to search for a specifig GIF or `giphy random` to get a completely random GIF. Rating can either be `G`, `PG`, `PG-13` (NSFW-Only) or `R` (NSFW-Only), but will default to `G` if ignored.')
                    .setColor('880000');
            
            let rating = 'G';
            let search_term;
            if (args[0] == undefined) return message.channel.send(invArgsEmbed);
            if (args[0].startsWith('&')) {
                args[0] = args[0].substr(1);

                if (args[0] == 'G') {rating = 'G';} else
                if (args[0] == 'PG') {rating = 'PG';} else
                if (args[0] == 'PG-13') {rating = 'PG-13';} else
                if (args[0] == 'R') {rating = 'R';} else {
                    let invRating = new Discord.RichEmbed()
                    .setTitle('Invalid Age Rating')
                    .setDescription('Age Rating can be `&P`, `&PG`, `&PG-13` (NSFW_Only) or `&R` (NSFW-Only)')
                    .setColor('ff0000');
                    return message.channel.send(invRating);
                }
                if (args[1] == undefined) {
                    message.channel.send(invArgsEmbed);
                    return;
                }
                search_term = args.slice(1).join(' ');
            } else {
                if (args[0] == undefined) {
                    message.channel.send(invArgsEmbed);
                    return;
                }
            search_term = args.slice(0).join(' ');
            }
            if (args[0] == 'random') {
                request.get(`http://api.giphy.com/v1/gifs/random?api_key=${giphyToken}&limit=1`, {json: true}, (err, res, body) => {
                if (err) {return console.log(err);}
                if (res == undefined) {return message.channel.send('Hmm, seems like I\'m having problems right now. Please try again later.');} else
                if (res.body == undefined) {return message.channel.send('Hmm, seems like I\'m having problems right now. Please try again later.');} else
                if (res.body.data == undefined) {return message.channel.send('Hmm, seems like I\'m having problems right now. Please try again later.');} else
                if (res.body.data.embed_url == undefined) {return message.channel.send('Hmm, seems like I\'m having problems right now. Please try again later.');} else
                {output = res.body.data.embed_url;}
                message.channel.send(output);
            });} else {
                offset = '0';
                if (args.length > 1 && !isNaN(args[args.length-1])) {
                    offset = args[args.length-1];
                }
            request.get(`http://api.giphy.com/v1/gifs/search?q=${sanitizeHtml(search_term)}&api_key=${giphyToken}&limit=1&offset=${offset}&rating=${rating}`, {json: true}, (err, res, body) => {
                if (err) {return console.log(err);}
                if (res == undefined) {return message.channel.send('Hmm... Seems like I couldn\'t find a GIF matching your search.');} else
                if (res.body == undefined) {return message.channel.send('Hmm... Seems like I couldn\'t find a GIF matching your search.');} else 
                if (res.body.data[0] == undefined) {return message.channel.send('Hmm... Seems like I couldn\'t find a GIF matching your search.');} else 
                if (res.body.data[0].embed_url == undefined) {return message.channel.send('Hmm... Seems like I couldn\'t find a GIF matching your search.');} else
                {output = res.body.data[0].embed_url;}
                if (rating == 'R') {
                    if (!message.channel.nsfw) {
                        return message.channel.send('`R` rated content can only be viewed in NSFW channels.');
                    }
                }
                message.channel.send(`${output}\nRating Filter: \`${rating}\``);
            });
        }
    }
}