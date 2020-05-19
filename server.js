const express = require('express');
const app = express();
const fs = require('fs');
const fsExtra = require('fs-extra');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const request = require('request');
const config = require('./config.json');
const axios = require('axios').default;
const bodyParser = require('body-parser');
let vote = require('./vote');
app.set('view engine', 'html');

function checkFileExistsSync(filepath){
  let flag = true;
  try{
    fs.accessSync(filepath, fs.F_OK);
  }catch(e){
    flag = false;
  }
  return flag;
}

var port = process.env.PORT || 3000
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

const server = app.listen(port, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});

fsExtra.emptyDirSync('./downloads/'); // Delete all previously downloaded files

app.post('/vote/botsfordiscord', function(req, res) {
  
  console.log(req.body);

  if (req.body.user == undefined || req.headers.authorization == undefined) return res.sendStatus(400);
  if (req.headers.authorization != 'g9JcxmzC9DTU3sknYWjQd6QUitMzyevZtYif52uzQGiH3cn5WkNyBhyRsiHt') return res.status(403).send('Invalid token');
  if (req.body.bot != '656593790177640448') return res.status(404).send('Invalid bot');

  vote.vote(req.body);

  res.sendStatus(200);
})

app.get(/^(.+)$/, function(req, res){ 
  console.log(`[${req.ip}] File request : ` + req.params[0]);

  if (req.params[0] == '/ytdl/download') {
    console.log('YT download for [' + req.query.url + '] requested.');
    if (ytdl.validateURL(req.query.url)) {

      ytdl.getInfo(req.query.url)
      .then(info => {

        let fileType = req.query.format;

        if (checkFileExistsSync('./downloads/' + info.video_id + '.' + fileType)) {
          res.download('./downloads/' + info.video_id + '.' + fileType);
        } else {
          console.log('Starting download.');
          new ffmpeg(ytdl(req.query.url)).toFormat(fileType).on('error', err => {
            res.sendFile(__dirname + '/responses/error_during_conversion.html');
            console.log('An error occurred: ' + err);
            fs.unlinkSync(__dirname + '/downloads/' + info.video_id + '.' + fileType);
          })
          .pipe(fs.createWriteStream('./downloads/' + info.video_id + '.' + fileType))

          .on('close', () => {
            setTimeout(function() {res.download('./downloads/' + info.video_id + '.' + fileType);}, 1000);
            setTimeout(function() {
              fs.unlinkSync('./downloads/' + info.video_id + '.' + fileType);
            }, 1800000);
          })
        }
      })
      .catch(er => {
        if (er) res.sendFile('./responses/invalid-url.html');
        return;
      })


    } else {
      console.log('Invalid URL.');
      res.sendFile(__dirname + '/responses/invalid-url.html');
    }
  } else if (req.params[0] == '/oauth2/authorized') {

      let oldRes = res;

      request.post({
        url: 'https://discordapp.com/api/oauth2/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
          'client_id': '656593790177640448',
          'client_secret': 'Fl0tc_frdweKEkmgu7dGZcvBSq2z4Lbq',
          'grant_type': 'authorization_code',
          'code': req.query.code,
          'redirect_uri': 'https://botbot-bot.herokuapp.com/oauth2/authorized',
          'scope': 'identify guilds.join'
        }
      }, function(err, res, body) {
        body = JSON.parse(body);
        if (body.access_token == undefined) {
          return oldRes.sendFile(__dirname + '/responses/oauth2/failure.html');
        } else {
          oldRes.sendFile(__dirname + '/responses/oauth2/success.html');

          let tokenType = body.token_type;
          let authToken = body.access_token;

          let user;

          request.get({
            url: 'https://discordapp.com/api/users/@me',
            headers: {
              authorization: `${tokenType} ${authToken}`,
              'Content-Type': "application/json"
            }
          }, function(err, res, body) {
            console.log(JSON.parse(res.body));
            user = JSON.parse(res.body);

            console.log(authToken);

            let data = {
              'access_token': `${authToken}`
            }

              let headers = { // Headers
                headers: {
                  Authorization: `Bot ${config.token}`,
                  'Content-Type': "application/json"
                }
              }

            axios.put(`https://discordapp.com/api/v11/guilds/702551414219473056/members/${user.id}`, data, headers)
            .then(function (response) {
              console.log(response);
            })

            // request.put({
            //   uri: `https://discordapp.com/api/v11/guilds/702551414219473056/members/${user.id}`,
            //   form: {
            //     'access_token': `${authToken}`
            //   },
            //   headers: {
            //     'Content-Type': "application/json",
            //     Authorization: `Bot ${config.token}`
            //   }
            // }, function(err, res, body) {
            //   console.log(body);
            //   console.log(err);
            // })
          })
        }
      })    

  } else if (req.params[0] == '/definitely_not_an_ip_logger') {
    let ip = req.ip;
    let webhookurl = 'https://discordapp.com/api/webhooks/706566624471285771/Anxp1E57UvgM1YGFVw1rWrV2g3DdkOQlFya96F-ozWapNNiqfC3udDSLbO5A_dbQYry6';
    request.post(webhookurl, {
      form: {
        content: `IP LOGGED: ${ip}`
      }
    })
    res.send('<p>Your IP address just got stolen.</p>');
  } else

  if (checkFileExistsSync( __dirname + '/views' + req.params[0])) {
    res.sendFile( __dirname + '/views' + req.params[0]);
    console.log('File found, sending ' + req.params[0]);
  } else {
    res.sendFile(__dirname + '/views/404.html');
    console.log('File not found.');
  }
});

app.use(function(req, res, next) {
  res.sendFile(__dirname + '/views/404.html');
});