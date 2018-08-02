const fs = require('fs');
//const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const bodyParser = require('body-parser');

module.exports = function (logger, app, io) {

    app.post('/user/:id', async (req, res, next) => {
        if (req.session.user == null){
            return res.send({success: false});
        }
        let fullpath = './tmp/' + req.params.id + '.png';
        let bitmap = new Buffer(req.body.avatar, 'base64');
        fs.unlink('path/file.txt', (err) => {});

        fs.writeFile(fullpath, bitmap, function (err) {

            if (!req.body) {
                //Error
                return res.send({
                    success: false
                });
            } else {
                if (err)
                    throw err;

                fs.readFile(fullpath, function (err, file) {

                    if (err) throw err;

                    io.in('gods').emit('avatar', {
                        user: req.params.id,
                        image: true,
                        buffer: file.toString('base64')
                    });
                    return res.send({
                        success: true
                    });

                });
            }
        });
    });
}