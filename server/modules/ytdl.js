const ytdl = require('ytdl-core');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

function checkFileExistsSync(filepath) {
  let flag = true;
  try {
    fs.accessSync(filepath, fs.F_OK);
  } catch(e) {
    flag = false;
  }
  return flag;
}

module.exports = {
    execute(req, res) {
    console.log('YT download for [' + req.query.url + '] requested.');
        if (ytdl.validateURL(req.query.url)) {

          ytdl.getInfo(req.query.url)
          .then(info => {

            let fileType = req.query.format;

            if (checkFileExistsSync('./server/downloads/' + info.video_id + '.' + fileType)) {
              res.download('./server/downloads/' + info.video_id + '.' + fileType);
            } else {
              console.log('Starting download.');
              new ffmpeg(ytdl(req.query.url)).toFormat(fileType).on('error', err => {
                res.sendFile(__dirname + '/responses/error_during_conversion.html');
                console.log('An error occurred: ' + err);
                fs.unlinkSync('./server/downloads/' + info.video_id + '.' + fileType);
              })
              .pipe(fs.createWriteStream('./server/downloads/' + info.video_id + '.' + fileType))

              .on('close', () => {
                setTimeout(function() {res.download('./server/downloads/' + info.video_id + '.' + fileType);}, 1000);
                setTimeout(function() {
                  fs.unlinkSync('./server/downloads/' + info.video_id + '.' + fileType);
                }, 1800000);
              })
            }
          })
          .catch(er => {
            console.error(er);
            if (er) res.sendFile(__dirname + '/responses/invalid-url.html');
            return;
          })


        } else {
          console.log('Invalid URL.');
          res.sendFile(__dirname + '/responses/invalid-url.html');
        }
    }
}