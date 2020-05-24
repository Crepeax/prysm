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

            let toMP4 = false;
            let fileType = req.query.format;
            if (!fileType || fileType == 'mp4') throw 'No/invalid file format provided';

            if (checkFileExistsSync('./server/downloads/' + info.video_id + '.' + fileType)) {
              res.download('./server/downloads/' + info.video_id + '.' + fileType);
            } else {
            if (fileType == 'mp4') {
              fileType = 'webm';
              toMP4 = true;
            }
            console.log('Starting download.');
              new ffmpeg(ytdl(req.query.url)).toFormat(fileType).on('error', err => {
                res.sendFile(__dirname + '/responses/error_during_conversion.html');
                console.log('An error occurred');
                console.error(err);
                if (checkFileExistsSync('./server/downloads/' + info.video_id + '.' + fileType)) fs.unlinkSync('./server/downloads/' + info.video_id + '.' + fileType);
              })
              .pipe(fs.createWriteStream('./server/downloads/' + info.video_id + '.' + fileType))

              .on('close', () => {
                console.log('Done');
                if (toMP4) {
                  console.log('Converting to mp4...');
                  new ffmpeg('../downloads/' + info.video_id + '.' + fileType).toFormat('mp4').on('error', err => {
                    res.sendFile(__dirname + '/responses/error_during_conversion.html');
                    console.log('An error occurred');
                    console.error(err);
                    if (checkFileExistsSync('./server/downloads/' + info.video_id + '.' + fileType)) fs.unlinkSync('./server/downloads/' + info.video_id + '.' + fileType);
                    if (checkFileExistsSync('./server/downloads/' + info.video_id + '.' + 'mp4')) fs.unlinkSync('./server/downloads/' + info.video_id + '.' + 'mp4');
                  })
                  .pipe(fs.createWriteStream('./server/downloads/' + info.video_id + '.' + 'mp4'))
                  .on('close', () => {
                    console.log('Done');
                  fileType = 'mp4';
                  setTimeout(function() {res.download('./server/downloads/' + info.video_id + '.' + fileType);}, 1000);
                  setTimeout(function() {
                    fs.unlinkSync('./server/downloads/' + info.video_id + '.' + fileType);
                  }, 1800000);
                });
                } else {
                  setTimeout(function() {res.download('./server/downloads/' + info.video_id + '.' + fileType);}, 1000);
                  setTimeout(function() {
                    fs.unlinkSync('./server/downloads/' + info.video_id + '.' + fileType);
                  }, 1800000);
                }
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