var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var mongoose = require('mongoose');
var models = require('./models');
var express_jwt = require('express-jwt');
var config = require('./config');
var cors = require('cors');
var images = require('images');
var expressValidator = require('express-validator');
mongoose.connect('mongodb://0.0.0.0:27017/DB');


//Initialize models defined.
models.initialize();


var app = express();

app.use(bodyParser.json());
app.use(expressValidator())
//Server routes
var userRouter = require('./routes/userRoute');
var postRouter = require('./routes/postRoute');
var authRouter = require('./routes/authenticationRoute');
var resetPasswordRouter = require('./routes/resetPassword');
app.use(cors());


app.use('/user', userRouter);
app.use('/posts', postRouter);
app.use('/authenticate', authRouter);
app.use('/resetPassword', resetPasswordRouter);

app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res){
  res.sendfile(__dirname + '/public/index.html');
});




http.createServer(app, function() {
	console.log('Conectado!');
}).listen(8080);
