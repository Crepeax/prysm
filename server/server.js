const express = require('express');
const app = express();
const fs = require('fs');
const fsExtra = require('fs-extra');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const request = require('request');
const config = require('../config.json');
const axios = require('axios').default;
const bodyParser = require('body-parser');
let vote = require('./modules/vote');
app.set('view engine', 'html');

function checkFileExistsSync(filepath) {
  let flag = true;
  try {
    fs.accessSync(filepath, fs.F_OK);
  } catch(e) {
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

app.post('/vote/botsfordiscord', function(req, res) { // BfD vote
  
  console.log(req.body);

  if (req.body.user == undefined || req.headers.authorization == undefined) return res.sendStatus(400);
  if (req.headers.authorization != 'g9JcxmzC9DTU3sknYWjQd6QUitMzyevZtYif52uzQGiH3cn5WkNyBhyRsiHt') return res.status(403).send('Invalid token');
  if (req.body.bot != '656593790177640448') return res.status(404).send('Invalid bot');

  vote.vote(req.body);

  res.sendStatus(200);
});

app.get(/^(.+)$/, function(req, res){ 
  console.log(`[${req.ip}] File request : ` + req.params[0]);

  if (req.params[0] == '/ytdl/download') {
    
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