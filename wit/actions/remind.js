let index = require('../index');
const events = require('events');

module.exports = {
    execute(message, res) {
        if (!res.entities['message_body'] || !res.entities['duration']) return message.channel.send('I can\'t remind you of something when you don\'t tell me when and what.');
        message.channel.send('Should I set a reminder to ' + res.entities['message_body'][0].value + ' in ' + res.entities['duration'][0].value + ' ' + res.entities['duration'][0].unit + 's?');

        let time = 0;
        let unit = res.entities['duration'][0].normalized.unit;

        switch(unit) {
            case 'millisecond':
                time = res.entities['duration'][0].normalized.value;
            break;
            case 'second':
                time = res.entities['duration'][0].normalized.value * 1000;
            break;
            case 'minute':
                time = res.entities['duration'][0].normalized.value * 1000 * 60;
            break;
            case 'hour':
                time = res.entities['duration'][0].normalized.value * 1000 * 60 * 60;
            break;
            default:
                return message.channel.send('An error has occurred.');
            break;
        }

        const eventEmitter = new events.EventEmitter();
        eventEmitter.on('reply-' + message.id, r => {
            if (r.entities.yesno) {
                if (r.entities.yesno[0].confidence < 0.65) return message.channel.send('This was a yes or no question.');

                eventEmitter.removeAllListeners();
                index.listening[message.author.id] = undefined;
                clearTimeout(timeout);

                console.log(r.entities.yesno[0].value);

                if (r.entities.yesno[0].value != 'yes') return message.channel.send('Ok, cancelled.');
                    
                message.channel.send('Setting reminder...');
                require('../../reminders').setReminder(message.author, Date.now() + time, res.entities['message_body'][0].value, message);
                //user, time, msg, message
            } else return message.channel.send('This was a yes or no question.');
        });

        index.listening[message.author.id] = {
            "emitter": eventEmitter,
            "msg": message
        };

        let timeout = setTimeout(function() {
            index.listening[message.author.id] = undefined;
            eventEmitter.removeAllListeners();
            message.channel.send('Cancelled.');
        }, 30000);
    }
}