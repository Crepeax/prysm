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
const Discord = require('discord.js');

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

/* Function to get a user's Discord user object */
function getUserObject(sessionID) {
  let data = sda.get(sessionID);
  if (!data) return false;
  if (!data.OAuth) return false;
  if (!data.OAuth.userdata) return false;
  return data.OAuth.userdata;
}

/*POST endpoints for the dashboard*/
/*POST*/
app.post('/post', function(req, res) { // Push
    console.log(req.query);
    let index = require('../index');
    let music = require('../music/music');
    
  /* Return with 403 forbidden when the client can't access the target */
  let userObject = getUserObject(req.sessionID);
  if (!userObject) return res.sendStatus(403);
  if (!userObject.id) return res.sendStatus(403);
  if (!index.support.isOnServer(userObject.id, req.query.gid)) return res.sendStatus(403);

  if (req.query.action == 'disconnect') {
    if (!req.query.gid) return res.sendStatus(400);
    music.disconnect(req.query.gid);
  }
  if (req.query.action == 'skip') {
    if (!req.query.gid) return res.sendStatus(400);
    music.skip(req.query.gid);
  }
  if (req.query.action == 'setvolume') {
    if (!req.query.gid) return res.sendStatus(400);
    if (!req.query.volume) return res.sendStatus(400);
    if (isNaN(req.query.volume)) return res.sendStatus(400);
    if (req.query.volume > 200 || req.query.volume < 0) return res.sendStatus(400);
    let file = JSON.parse(fs.readFileSync('music/volumes.json'));
        if (!file[req.query.gid]) file[req.query.gid] = 0.5;
        if (isNaN(file[req.query.gid])) file[req.query.gid] = 0.5;
        file[req.query.gid] = req.query.volume / 100;
        fs.writeFileSync('music/volumes.json', JSON.stringify(file));
    music.setVolume(req.query.gid);
  }
    res.sendStatus(200);
});
/*GET endpoints for the dashboard*/
app.get('/get', function(req, res) { // Push
  // console.log(req.query);
  let index = require('../index');
  let music = require('../music/music');
  
  /* Return with 403 forbidden when the client can't access the target */
  let userObject = getUserObject(req.sessionID);
  if (!userObject) return res.sendStatus(403);
  if (!userObject.id) return res.sendStatus(403);
  if (!index.support.isOnServer(userObject.id, req.query.gid)) return res.sendStatus(403);

  if (req.query.action == 'getsonginfo') {
    music.getQueue(req.query.gid).then(r => {
      res.json(r);
    });
  }

});


app.get('/oauth2/authorized', function (req, res) {
  let code = req.query.code;
  if (!code) return res.send('No OAuth2 code provided.');

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
      if (!userobject.id) return console.error('Authentification error: Failed to exchange OAuth2 code for access token.');
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

app.get('/dashboard/server/*', function(req, res) {
  let index = require('../index');
  console.log(req.path);

  /* =============================== Verify that a valid guild ID was provided and the user is permitted to access the guild =============================== */
  let sesData = sda.get(req.sessionID);
  if (!sesData.OAuth) return res.sendFile(__dirname + '/views/404.html');
  let uID = sesData.OAuth.userdata.id;

  let query = req.path.slice(1).split('/');

  console.log(query);
  if (isNaN(query[2])) return res.sendFile(__dirname + '/views/404.html');
  let prysmGuilds = [];
  index.support.getGuilds().forEach(g => {
    prysmGuilds.push(g.id);
  });
  if (prysmGuilds.indexOf(query[2]) == -1) return res.sendFile(__dirname + '/views/404.html');
  let member = index.support.isOnServer(uID, query[2]);

  if (!member.permissions.has('ADMINISTRATOR') && !member.permissions.has('MANAGE_GUILD')) return res.send('You are not authorized to view the dashboard.');

  if (member == false) return res.sendFile(__dirname + '/views/404.html');

  /* =============================== Create and send the dashboard =============================== */
  
  /* Create variables for the username, discriminator and the avatar URL */
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
  let guild = member.guild;
  let guildID = guild.id;
  let guildName = guild.name;
  let guildImgURL = guild.iconURL;
  let guildMemberCount = guild.memberCount;

  if (!guildImgURL) guildImgURL = `/assets/no_guild_logo.svg`;

  // Render and send
  let q = query;
  q.shift();
  q.shift();
  q.shift();
  q = q.join('/');
  console.log(q);
  if (checkFileExistsSync( __dirname + '/views/dashboard/server/GUILD_ID/' + q)) {
    if (path.extname(q) == '.ejs') res.render(__dirname + '/views/dashboard/server/GUILD_ID/' + q, {
      avatarURL: avatarURL,
      username: username,
      discriminator: discriminator,
      supportEntry: supportEntry,
      inviteURL: 'https://discordapp.com/oauth2/authorize?client_id=656593790177640448&scope=bot&permissions=758578262',
      guild: guild,
      guildID: guildID,
      guildName: guildName,
      guildImgURL: guildImgURL,
      guildMemberCount: guildMemberCount
    });
    else res.sendFile( __dirname + '/views/' + q);
  } else {
    res.sendFile(__dirname + '/views/404.html');
    console.log('[Web] File not found.');
  }
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

  function respond() {
    console.log(`[Web] File request: ` + req.params[0]);

    
    if (dbServerList == '') dbServerList = `\n<div class="server">\n<a style="width: 750px; margin-left: 37px;">You can't access any servers.</a>\n</div>`;

    if (checkFileExistsSync( __dirname + '/views' + req.params[0])) {
      if (path.extname(req.params[0]) == '.ejs') res.render(__dirname + '/views' + req.params[0], {
        avatarURL: avatarURL,
        username: username,
        discriminator: discriminator,
        supportEntry: supportEntry,
        dbServerList: dbServerList,
        dbUnknownServerList: dbUnknownServerList,
        inviteURL: 'https://discordapp.com/oauth2/authorize?client_id=656593790177640448&scope=bot&permissions=758578262'
      });
      else res.sendFile( __dirname + '/views' + req.params[0]);
    } else {
      res.sendFile(__dirname + '/views/404.html');
      console.log('[Web] File not found.');
    }
  }

  let dbServerList = '';
  let dbUnknownServerList = '';
  if (req.path == '/dashboard/servers.ejs') {
    let data = sda.get(req.sessionID, 'Oauth');
    console.log(data);
    if (data) {if (data.OAuth) {if (data.OAuth.access) {if (data.OAuth.access.access_token) {
      let token = data.OAuth.access.access_token;
      console.log('Found token: ' + token);

      request.get(`https://discord.com/api/users/@me/guilds`, {
        headers: {
          Authorization: 'Bearer ' + token,
          "Content-Type": "x-www-form-urlencoded"
        }
      }, function (err, resp, body) {
        let guilds = JSON.parse(body);

        let prysmGuilds = require('../index.js').support.getGuilds();
        let gArray = [];
        prysmGuilds.forEach(g => {
          gArray.push(g.id);
        });

        Object.keys(guilds).forEach(key => {
          if (!guilds[key].permissions) return;
          let perms = new Discord.Permissions(guilds[key].permissions);
          if (perms.hasPermission('ADMINISTRATOR') || perms.hasPermission('MANAGE_GUILD')) {
            let imgURL = `https://cdn.discordapp.com/icons/${guilds[key].id}/${guilds[key].icon}.webp?size=128`;
            if (!guilds[key].icon) imgURL = `/assets/no_guild_logo.svg`;
            let inviteURL = 'https://discordapp.com/oauth2/authorize?client_id=656593790177640448&scope=bot&permissions=758578262&guild_id=' + guilds[key].id;
            if (gArray.indexOf(guilds[key].id) > -1) dbServerList += `\n<div class="server">\n<div class="dbButton" onclick="window.location='/dashboard/server/${guilds[key].id}/index.ejs'">\n<b>Open</b>\n</div>\n<img src='${imgURL}'>\n<a>${guilds[key].name}</a>\n</div>`;
            else dbUnknownServerList += `\n<div class="server">\n<div class="dbButton" onclick="window.location='${inviteURL}'">\n<b>Setup</b>\n</div>\n<img src='${imgURL}'>\n<a>${guilds[key].name}</a>\n</div>`;
          }
        });
        respond();
      });
    } else respond(); } else respond(); } else respond(); } else respond();
  } else respond();

});

app.use(function(req, res, next) {
  res.sendFile(__dirname + '/views/404.html');
});



