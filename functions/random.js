const Discord = require('discord.js');

/*
let randomFuncPath = require('../functions/random.js');
function random(low, high) {
    var output = randomFuncPath.execute(low, high);
    return output;
}
*/

module.exports = {
    execute(low, high) {
        low = Math.ceil(low);
        high = Math.floor(high);
        high = high + 1;
        rndm = Math.random();
        return Math.floor(rndm * (high - low) + low);
    }
}