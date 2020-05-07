// Set "ChannelServer" in config.json to your Server's ID
// Set "timeChannel" to the ID of the Channel which should display the Time
// Set "token" to your Bot's Bot Token

const Discord = require('discord.js');
const config = require('./config.json');
const bot = new Discord.Client();
const fs = require('fs');

bot.login(config.token);

bot.once('ready', () => {

    console.log('[Info] Time script is running.');

    setInterval(function() {
        update();
    }, 5000);
    console.log(`[Clock] Logged in as ${bot.user.username}`);
    });

function update() {
        
    let timeRaw = new Date();        
        
    let time_year = timeRaw.getFullYear().toString();                   // Define Year
    let time_month = (timeRaw.getMonth() + 1).toString();               // Define Month
    let time_day = timeRaw.getDate().toString();                        // Define Day
    let time_hour = timeRaw.getHours().toString();                      // Define Hour
    let time_min = timeRaw.getMinutes().toString();                     // Define Minute

    let week_day;                                                       // Defining Week Day
    let week_day_raw = timeRaw.getDay();                                // Defining Week Day                      
    
    switch(week_day_raw) {
        case 1:
            week_day = 'Monday';
        break;
        case 2:
            week_day = 'Tuesday';
        break;
        case 3:
            week_day = 'Wednesday';
        break;
        case 4:
            week_day = 'Thursday';
        break;
        case 5:
            week_day = 'Friday';
        break;  
        case 6:
            week_day = 'Saturday';
        break;
        case 0:
            week_day = 'Sunday';
        break;
        default:
            week_day = 'ERROR : ' + week_day_raw;
        break;
    }

    let month_name;

    switch(time_month) {
        case '1':
            month_name = 'January';
        break;
        case '2':
            month_name = 'February';
        break;
        case '3':
            month_name = 'March';
        break;
        case '4':
            month_name = 'April';
        break;
        case '5':
            month_name = 'May';
        break;
        case '6':
            month_name = 'June';
        break;
        case '7':
            month_name = 'July';
        break;
        case '8':
            month_name = 'August';
        break;
        case '9':
            month_name = 'September';
        break;
        case '10':
            month_name = 'October';
        break;
        case '11':
            month_name = 'November';
        break;
        case '12':
            month_name = 'December';
        break;
        default:
            month_name = 'ERROR : ' + time_month;
        break;
    }
            
    let seperator;                                                      // Define seperator; Add a 0 if Minute is < 10
    if (time_min > 9) {
    seperator = ':';
    } else {
    seperator = ':0';
    }

    let hourPrefix;                                                      // Define seperator; Add a 0 if Minute is < 10
    if (time_hour > 9) {
    hourPrefix = '';
    } else {
    hourPrefix = '0';
    }
    
let ampm;
if (time_hour > 12) {
    ampm = ' PM';
} else {
    ampm = ' AM';
}

    let time = hourPrefix + time_hour + seperator + time_min + ampm;    // Save Time String to Variable
    let date = time_day + '. ' + time_month + '. ' + time_year;         // Save Date String to Variable

    let file = JSON.parse(fs.readFileSync("./clock-channels.json", "utf8"));
  
        timeChannelLength = Object.keys(file.time).length;
        dateChannelLength = Object.keys(file.date).length;

        for (let [guildID, channelID] of Object.entries(file.time)) {
            if (bot.guilds.get(guildID)) {
                let guild = bot.guilds.get(guildID);
            if (guild.channels.get(channelID)) {
                let channel = guild.channels.get(channelID);
                if (guild.members.get(bot.user.id).permissions.has('MANAGE_CHANNELS')) {
                    channel.setName(`${week_day} ⇼ ${time}`);
                }

            }
            }
        }

        for (let [guildID, channelID] of Object.entries(file.date)) {
            if (bot.guilds.get(guildID)) {
            let guild = bot.guilds.get(guildID);
            if (guild.channels.get(channelID)) {
            let channel = guild.channels.get(channelID);
                if (guild.members.get(bot.user.id).permissions.has('MANAGE_CHANNELS')) {
                    channel.setName(`${month_name}, ${date}`);
                }
            }
        }
    }
}