const Discord = require('discord.js');
const request = require('request');
const url = require('url');

function is_url(str)
{
  regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (regexp.test(str))
        {
          return true;
        }
        else
        {
          return false;
        }
}


const vtApiKey = '0ebf1e27ba0d5e0ac147fed84b1392e92e384195ff87b6b56083d837cc9d87ca';

let timeouts = [];

module.exports = {
    name: 'virustotal',
    description: 'Use virustotal to scan a file or URL for viruses.',
    guildOnly: true,
    perms: ['ADMINISTRATOR'],
    aliases: ['vt', 'virusscan'],
    disabled: false,
    cooldown: 20000,
    execute(message, args) {

        if (args[0] == undefined) {
            return message.channel.send('Please specify the URL.');
        }

        let url;

        if (is_url(args[0])) {
            url = args[0];
        } else {
            return message.channel.send('Please provide a valid URL.');
        }

        if (timeouts[message.author.id]) {
            let now = new Date().getSeconds();
            let then = timeouts[message.author.id].getSeconds();
            let diff = ((now - then) - 60) * -1;

            message.channel.send(`Retry in ${diff} seconds.`);
        } else {
            let time = new Date();
            timeouts[message.author.id] = time;
            setTimeout(function() {
                timeouts[message.author.id] = undefined;
            }, 60000);

            let data = url;

            buff = Buffer.from(data);
            output = buff.toString('base64');

            while (output.slice(-1) == "=") {
                output = output.slice(0, -1);
            }

            request.post(`https://www.virustotal.com/api/v3/urls/?url=aHR0cHM6Ly9pY2h1bi5tZS8`, {json: true, headers: {"x-apikey": vtApiKey}, body: {"url": output}}, (err, res, body) => {
                console.log(err);
                if (err)         return message.channel.send(`VirusTotal replied with an error: \n\`${err}\``);
                if (body.error)  return message.channel.send(`VirusTotal replied with an error: \n\`${body.error.code}: ${body.error.message}\``);
                message.channel.send('Analyzing...');
                console.log(body);
                console.log(err);
            });

        }
    }
}