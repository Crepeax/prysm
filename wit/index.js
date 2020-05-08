console.log('[Info] Chatbot is starting.');
const Discord = require('discord.js');
const client = require('../index').client;
const {Wit, witlog} = require('node-wit');

const actions = require('./replies.json');

let randomFuncPath = require('../functions/random.js');
function random(low, high) {
    var output = randomFuncPath.execute(low, high);
    return output;
}

module.exports.listening = {};

const wit = new Wit({
    accessToken: "Q7XEQEWYKG7J7ILMPFDIB3W5IJXWODEX"
})

client.on('message', message => {
    const args = message.content.slice(`<@!${client.user.id}>`.length).split(' ');

    if (!message.content.startsWith(`<@!${client.user.id}>`) && !this.listening[message.author.id]) return;

    if (args[0] == undefined && message.content.startsWith(`<@!${client.user.id}>`)) return;
    if ((args[0] == undefined && message.content.startsWith(`<@!${client.user.id}>`)) || (!message.content.startsWith(`<@!${client.user.id}>`) && message.content.length < 1)) return;

    console.log('[AI] Request received: ' + message.content);
    let m;
    if (!message.content.startsWith(`<@!${client.user.id}>`)) m = message; else m = args.join(' ');
    if (m.length < 1) return;
    message.channel.startTyping(10000);    
    wit.message(m).then(res => {
        message.channel.stopTyping(true);
        console.log(res);
        console.log(res.entities.intent);
        if (this.listening[message.author.id]) {
            
            this.listening[message.author.id].emitter.emit('reply-' + this.listening[message.author.id].msg.id, res);
            message.channel.stopTyping(true);

            return;
        }
        if (!res.entities.intent) return message.channel.send('Sorry, I do not understand.');
            // message.channel.send(`\`I am ${Math.round(res.entities.intent[0].confidence * 100)}% sure your intent was "${res.entities.intent[0].value}".\nAll values: ${JSON.stringify(res.entities)}\``);

            if (!res.entities.intent) return;

        if (!actions["intent"][res.entities.intent[0].value]) {
            return message.channel.send('Hm, no action is specified for this intent.');
        } else if (actions["intent"][res.entities.intent[0].value]['action'] == 'execute') {
            require('./' + actions["intent"][res.entities.intent[0].value]['path']).execute(message, res);
        } else if (typeof actions["intent"][res.entities.intent[0].value] == 'object') {
            let str = actions["intent"][res.entities.intent[0].value][random(0, actions["intent"][res.entities.intent[0].value].length - 1)];
            str = str.replace('%username%', message.author.username);
            str = str.replace('%owner%', client.users.get('284323826165350400').username + '#' + client.users.get('284323826165350400').discriminator);
            message.channel.send(str);
        }
    });
})
