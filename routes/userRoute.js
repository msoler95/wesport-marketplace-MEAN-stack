var express = require('express');
var router = express.Router();
var User = require('mongoose').model('User');
var Token = require('mongoose').model('Token');
var ObjectId = require('mongoose').Types.ObjectId;
var bcrypt = require('bcrypt-nodejs');
var jwt_secret = require('../config').jwt_secret;
var express_jwt = require('express-jwt');
var multer = require('multer');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var confirmationUrl = require('../config').confirmationUrl;

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

var upload = multer({ storage: storage });


//////  CREATE  /////////
router.post('/register', function(req, res, next) {
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('mail', 'Email is not valid').isEmail();
    req.assert('mail', 'Email cannot be blank').notEmpty();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        return res.json({ success: false, msg: 'Alguno de los campos no es correcto' });
    }

    //VIGILAR SI POSO ADMIN
    var userData = req.body;
    if (userData.mail == undefined || userData.name == undefined || userData.password == undefined)
        res.json({ success: false, msg: 'Información invalida' });


    var new_user = new User(userData);
    var old_pas = new_user.password;
    new_user.avatar = "uploads/invitado.png";
    bcrypt.hash(old_pas, null, null, function(err, hash) {
        new_user.password = hash;
        new_user.save(function(err, user) { //hace el insert
            if (err) {
                console.log(err);
                res.json({ success: false, msg: 'El usuario ya existe' });
            } else {
                // Create a verification token for this user
                var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

                // Save the verification token
                token.save(function(err) {
                    if (err) {
                        console.log(err);
                        return res.json({ success: false, msg: err.message });
                    }

                    // Send the email
                    var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: 'msoler955', pass: 'th1s1smysup3s3cr3tp4ssw0rd' } });
                    console.log('llego')
                    console.log('transporter', transporter)
                    var mailOptions = { from: 'team@wesport.ml', to: user.mail, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + confirmationUrl + '/' + token.token + '.\n' };
                    transporter.sendMail(mailOptions, function(err) {
                        if (err) {
                            console.log(err);
                            return res.json({ success: false, msg: err.message });
                        } else
                            res.json({ success: true, msg: 'Te hemos enviado un correo electronico de confirmación' });
                    });
                });
            }
        });
    });
});

//Token confimation
router.get('/confirmation/:token', function(req, res, next) {


    // Find a matching token
    Token.findOne({ token: req.params.token }, function(err, token) {
        if (!token) return res.json({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

        // If we found a token, find a matching user
        User.findOne({ _id: token._userId }, function(err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

            // Verify and save the user
            user.isVerified = true;
            user.save(function(err) {
                if (err) res.status(500).send({ msg: err.message } )
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    });
});


////////  GET  /////////

//Find information of a User
router.get('/getInfo', express_jwt({ secret: jwt_secret }), function(req, res, next) {
    User.findOne({ "mail": req.user.mail }).exec(function(err, data) {
        if (err) {
            console.log(err)
            res.send(400).json({ success: false, msg: 'Ha ocurrido un error' });
        } else {
            var dadesUsuari = {
                name: data.name,
                surname: data.surname,
                gender: data.gender,
                birthday: data.birthday,
                avatar: data.avatar,
                contact: data.contact
            }
            res.json({ success: true, info: dadesUsuari });
        }
    })
});

router.get('/getPhoto', express_jwt({ secret: jwt_secret }), function(req, res, next) {
    User.findOne({ "mail": req.user.mail }).exec(function(err, data) {
        if (err) {
            console.log(err)
            res.json({ success: false, msg: 'Ha ocurrido un error cargando la imagen' });
        } else res.json({ success: true, info: data.avatar });
    })
});

router.get('/getPhone', express_jwt({ secret: jwt_secret }), function(req, res, next) {
    User.findOne({ "mail": req.user.mail }).exec(function(err, data) {
        if (err) {
            console.log(err)
            res.json({ success: false, msg: 'Ha ocurrido un error' });
        } else res.json({ success: true, phone: data.contact });
    })
});

////////  UPDATE  /////////
router.post('/updateInfo', express_jwt({ secret: jwt_secret }), function(req, res, next) {

    User.findOne({ "mail": req.user.mail }).exec(function(err, user) {
        if (err) {
            console.log(err)
            res.json({ success: false, msg: 'Ha ocurrido un error' });
        } else {
            if (req.body.name) user.name = req.body.name;
            if (req.body.surname) user.surname = req.body.surname;
            if (req.body.contact) user.contact = req.body.contact;
            if (req.body.gender) user.gender = 'girl';
            else user.gender = 'boy';
            if (req.body.birthday) user.birthday = req.body.birthday;

            user.save(function(err, user) {
                if (err) res.json({ success: false, msg: 'Ha ocurrido un error' });
                else res.json({ success: true, msg: 'Tu información ya está a salvo!' });
            });
        }
    })
});


router.post('/updatePhoto', express_jwt({ secret: jwt_secret }), upload.single('file'), function(req, res, next) {
    User.findOne({ "mail": req.user.mail }).exec(function(err, user) {
        if (err) {
            console.log(err)
            res.json({ success: false, msg: 'Ha ocurrido un error' });
        } else {
            user.avatar = "/uploads/" + req.file.filename;
            user.save(function(err, user) {
                if (err) res.json({ success: false, msg: 'Ha ocurrido un error' });
                else {
                    if (user.avatar) res.json({ success: true, msg: 'Tu información ya está a salvo!', img: user.avatar });
                    else res.json({ success: false, msg: 'Ha ocurrido un error' });
                }
            });
        }
    })
});




////////  DELETE  /////////



module.exports = router;