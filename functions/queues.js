const Discord = require('discord.js');

let queues = {};

/*
let queues = require('../functions/queues.js');
*/

module.exports = {
    getQueues() {
        console.log('Returned: \n' + queues);
        return queues;
    },
    setQueue(server, content) {
        if (!queues[server]) {
            queues[server] = content;
            console.log('Saved queue: \n' + queues);
        }
    }
}