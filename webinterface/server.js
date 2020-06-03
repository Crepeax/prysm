const express = require('express');
const app = express();
const fs = require('fs');
const request = require('request');
const config = require('../config.json');
const axios = require('axios').default;
const bodyParser = require('body-parser');
const audiomanager = require('../music/music');
var path = require('path');
const ejs = require('node-ejs');
var session = require('express-session');
const sda = require('./modules/sessionData.js');

app.set('view engine', 'ejs');

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
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 
app.set('trust proxy', 1);
app.use(session({
  secret: 'creeper, aw man',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

const server = app.listen(port, () => {
    console.log(`[Web] Express running on \x1b[33mPORT ${server.address().port}\x1b[0m`);
});

app.post('/post', function(req, res) { // Push
    console.log(req.query);
    if (req.query.action == 'disconnect') {
        if (!req.query.gid) return res.sendStatus(403);
        audiomanager.disconnect(req.query.gid);
    }
    res.sendStatus(200);
});

app.get('/oauth2/authorized', function (req, res) {
  let code = req.query.code;
  if (!code) return res.sendStatus(403);

  require('./modules/oauth2').exec(req, res, code, function(r) {
    sda.store(req.sessionID, 'signin', true);

    // Fetch user profile
    request.get('https://discord.com/api/users/@me', {
      headers: {
        "Authorization": `Bearer ${r.access_token}`
      }
    }, function(err, resp, body) {
      console.log(body);
      let userobject = JSON.parse(body);
      if (!userobject.id) return console.error('Invalid response');
      sda.store(req.sessionID, 'OAuth', {
        access: r,
        userdata: userobject
      });
      res.redirect('/index.ejs?logged_in=true');
    });
  });
});

app.get('/oauth2/logout', function (req, res) {
  res.redirect('/index.ejs?logout=true');
  sda.store(req.sessionID, 'OAuth', {});
});

app.get('/joinsupport', function (req, res) {
  console.log('[Web] Support Server join requested');
  let cd = sda.get(req.sessionID, 'OAuth').OAuth;
  console.log(cd);
  if (cd) {if (cd.userdata) {
    let id = cd.userdata.id;
    console.log(`Access Token ${cd.access.access_token}\nBot Token ${config.token}\nUser ID ${id}`);
    console.log('Attempting to add user');

    axios.put('https://discord.com/api/guilds/702551414219473056/members/' + id, {
      access_token: cd.access.access_token,
      roles: ['717830976021200980']
    }, {
      headers: {
        Authorization: 'Bot ' + config.token,
        "Content-Type": "application/json"
      }
    }).catch(e => {
      throw e;
    }).then(function(resp) {
      console.log('callback');
      console.log(resp.body);
      res.sendStatus(200);
      require('../index').support.sendMsg(id);
    })
  } else {res.sendStatus(500); console.log('cd.userdata missing')}} else {res.sendStatus(500); console.log('cd missing')}
});

app.get('/', function(req, res) {
  console.log('[Web] Root file requested');
  res.redirect('/index.ejs');
});

app.get(/^(.+)$/, function(req, res) {
  let avatarURL;
  let username;
  let discriminator;
  if (sda.get(req.sessionID).signin == true) {
    if (sda.get(req.sessionID))
    if (sda.get(req.sessionID).OAuth)
    if (sda.get(req.sessionID).OAuth.userdata) {
      username = sda.get(req.sessionID).OAuth.userdata.username;
      discriminator = sda.get(req.sessionID).OAuth.userdata.discriminator;
      avatarURL = `https://cdn.discordapp.com/avatars/${sda.get(req.sessionID).OAuth.userdata.id}/${sda.get(req.sessionID).OAuth.userdata.avatar}.png`;
    }
  };

  let supportEntry = '';
  if (username) {
    if (!require('../index').support.isOnSupportServer(sda.get(req.sessionID).OAuth.userdata.id)) {
      supportEntry = '<img id="joinsprtimage" src="/assets/Discord-Logo-White-Cropped.png" style="height: 16px; position: absolute; margin-left: 20px; margin-top: 14px;"><a id="joinsprt" onclick="joinSupport()" style="margin-left: 20px;">Support Server</a>';
    };
  }

    console.log(`[Web] File request: ` + req.params[0]);
    if (checkFileExistsSync( __dirname + '/views' + req.params[0])) {
      if (path.extname(req.params[0]) == '.ejs') res.render(__dirname + '/views' + req.params[0], {
        avatarURL: avatarURL,
        username: username,
        discriminator: discriminator,
        supportEntry: supportEntry
      });
      else res.sendFile( __dirname + '/views' + req.params[0]);
    } else {
      res.sendFile(__dirname + '/views/404.html');
      console.log('[Web] File not found.');
    }
});

app.use(function(req, res, next) {
  res.sendFile(__dirname + '/views/404.html');
});



