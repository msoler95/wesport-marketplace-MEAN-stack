var express = require('express');
var router = express.Router();
var User = require('mongoose').model('User');
var ResetPassword = require('mongoose').model('ResetPassword');
var ObjectId = require('mongoose').Types.ObjectId;
var bcrypt = require('bcrypt-nodejs');
var jwt_secret = require('../config').jwt_secret;
var express_jwt = require('express-jwt');
var multer = require('multer');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var mainUrl = require('../config').mainUrl;

router.post('/', function(req, res, next) {

    // Create a verification token for this user
    var resetPassword = new ResetPassword({ userMail: req.body.mail, token: crypto.randomBytes(16).toString('hex') });

    User.findOne({ mail: req.body.mail }, function(err, user) {
        if (err) res.send({ msg: 'Error' });
        if (!user) res.send({ msg: 'El usuario no existe' });
        else {
            // Save the verification token
            resetPassword.save(function(err) {
                if (err) {
                    console.log(err);
                    return res.json({ success: false, msg: err.message });
                }

                // Send the email
                var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: 'msoler955', pass: 'marcmarc00' } });
                var mailOptions = { from: 'team@wesport.ml', to: req.body.mail, subject: 'Reiniciar mi contraseña', text: 'Hello,\n\n' + 'Haz click en el siguiente enlace para reiniciar la contraseña: \n' + mainUrl + '/resetMyPassword/' + resetPassword.token + '.\n' };
                transporter.sendMail(mailOptions, function(err) {
                    if (err) {
                        console.log(err);
                        return res.json({ success: false, msg: err.message });
                    } else
                        res.json({ success: true, msg: 'Te hemos enviado un correo electronico para que reinicies la contraseña' });
                });
            });
        }
    });

});


router.post('/:token', function(req, res, next) {

    // Check for validation errors    
    var errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);

    // Find a matching token
    ResetPassword.findOne({ token: req.params.token }, function(err, reset) {
        if (!reset) return res.json({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
        if(reset.verified) return res.json({  msg: 'Este token ya ha sido usado' });
        reset.verified = true;
        reset.save(function(err) {
            // If we found a token, find a matching user
            User.findOne({ mail: reset.userMail }, function(err, user) {
                if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
                bcrypt.hash(req.body.newPassword, null, null, function(err, hash) {
                    if (err) res.status(400).send({ msg: 'Error' });
                    user.password = hash;
                    user.save(function(err) {
                        if (err) {
                            return res.status(500).send({ msg: err.message });
                        }
                        res.json({ success: true, msg: user.name + ", hemos reestablecido tu contraseña! " });
                    });
                });

            });
        });

    });
});


module.exports = router;