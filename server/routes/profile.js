const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

module.exports = function (logger, app, io) {

        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, './tmp')
            },
            filename: (req, file, cb) => {
                crypto.pseudoRandomBytes(16, function (err, raw) {
                    if (err) return cb(err);
                    cb(null, req.params.id + '-' + Date.now() + path.extname(file.originalname));
                })
            }
        });

        const imageFilter = function (req, file, cb) {
            //accept image only
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return cb(new Error("Estensione del file non permessa"), false);
            }
            cb(null, true);
        }

        let upload = multer({
            fileFilter: imageFilter,
            storage: storage
        });

        app.post('/user/:id', upload.single('avatar'), async (req, res, next) => {
                if (!req.file) {
                    console.log(req.file);

                    //Error
                    return res.send({
                        success: false
                    });
                } else {
                    io.in('gods').emit('data', '&!imgreq{"uname":"'+req.params.id+'", "f":"' +req.file.filename+'"}!&!!');
                    return res.send({
                        success: true
                    });
                }
        });
    }
        