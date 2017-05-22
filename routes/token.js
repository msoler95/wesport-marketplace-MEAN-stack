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


router.post('/confimation/:token', function (req, res, next) {
 
    // Check for validation errors    
    var errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);
 
    // Find a matching token
    Token.findOne({ token: req.params.token }, function (err, token) {
        if (!token) return res.json({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
 
        // If we found a token, find a matching user
        User.findOne({ _id: token._userId }, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
 
            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    });
});
