module.exports = {
    execute(req, res) {
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
    }
}