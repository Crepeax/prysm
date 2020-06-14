let Discord = require('discord.js');
let request = require('request');
const config = require('../config.json');
const lookup = require('safe-browse-url-lookup')({apiKey: config.safeBrowsingKey});

module.exports = {
    check(message) {
        let regex = /(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/g;
        let urls = message.content.match(regex);
        if (!urls) return;

        let dangerous = false;

        lookup.checkMulti(urls).then(res => {
            Object.keys(res).forEach(r => {
                if (res[r] == true || res[r] == 'true') {
                    if (!dangerous) dangerous = 0;
                    dangerous += 1;
                }
            });
            if (dangerous) {
                let s = '';
                if (dangerous > 1) s = 's'; else dangerous = 'a'
                let msg = new Discord.RichEmbed()
                .setTitle('Malicious URL detected')
                .setDescription(`${message.author} has posted ${dangerous} potentially malicious URL${s}.\n[Jump to message](${message.url})`)
                .setColor('ff0000')
                .setFooter('The URLs have been checked using Google\'s Safe Browsing API.');
                message.channel.send(msg).catch();
                message.react('❗').catch();
            }
        });
    }
}
