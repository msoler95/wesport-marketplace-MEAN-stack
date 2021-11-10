//jwt per generar el token, jwt_secret es el secret per generar el token.
//Mitjançant express-jwt (passantli aquest jwt_secret) en accedir a qualsevol ruta pot verificar el token que hem generat
var jwt = require('jsonwebtoken');
var jwt_secret = require('../config').jwt_secret;
var User = require('mongoose').model('User');
var authRouter = require('express').Router();
var bcrypt = require('bcrypt-nodejs');

/**
 * This function will generate an authentication token to send to the user. The client uses that token to access
 * the protected routes in the API.
 */
authRouter.post('/', function (req, res, next) {
    req.assert('mail', 'Email is not valid').isEmail();
    req.assert('mail', 'Email cannot be blank').notEmpty();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        return res.json({ success: false, msg: 'Alguno de los campos no es correcto' });
    }

    var mailLogin = req.body.mail;
    var passwordLogin = req.body.password;

    User.findOne({mail: mailLogin}, function (err, user) {
        if (err) throw err;

        if (!user) {                                         //si no existeix
             res.send({ success: false, msg: 'Usuario o contraseña incorrectos' });
        } else {
            //Check passwords. Do with hashes in production!

            bcrypt.compare(passwordLogin, user.password, function (err, correcte) {
                if (!correcte) {                  //comparem passwords
                    res.send({ success: false, msg: 'Usuario o contraseña incorrectos' });
                } else {
                    if (!user.isVerified) return res.json({success: false,  msg: 'Confirma el mail que te enviamos al correo'});
                    else { 
                        var token = jwt.sign(user.toObject(), jwt_secret, {            //donem el token
                            expiresIn: '1440000d' // expires in 24 hours
                        });
                        res.json({ success: true, token: token, name: user.name, avatar: user.avatar, msg: 'Bienvenido de nuevo ' + user.name + "!"  });
                    }
                }
            });

        }
    });
});

module.exports = authRouter;