let index = require('../index');
const client = require('../../index').client;
const events = require('events');
const request = require('request');
const fs = require('fs');
const say = require('say');

module.exports = {
    execute(message, res) {
        if (!message.member.voiceChannel) return message.channel.send('Hm, you don\'t seem to be in a voice channel right now...');
        client.guilds.get(message.guild.id).members.get(message.author.id).voiceChannel.join().then(connection => {
            say.export("test test", 'Cellos', 1.0, 'hal.wav', (err) => {
                if (err) return console.error(err);
            });
        })
    }
}