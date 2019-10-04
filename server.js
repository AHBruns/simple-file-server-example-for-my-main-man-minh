const express = require('express')
const Busboy = require('connect-busboy');
const fs = require('fs');


const app  = express()

app.use(Busboy({
    immediate: true
}));

app.route('/upload').post(function (req, res, next) {
    // console.log(req.headers)
    req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.info('Busboy uploading');
        if (filename.length > 0) {
            file.on(
                'limit',
                () => { fs.unlink(__dirname + '/photos/' + filename) }
            )
            const fstream = fs.createWriteStream(__dirname + '/photos/' + filename)
            file.pipe(fstream);
          } else file.resume();
        });
  
    req.busboy.on('finish', () => { res.send('got it') });
})

app.use('/static', express.static(__dirname + '/photos'))

app.listen(2345, () => console.log(`Example app listening on port 2345!`))