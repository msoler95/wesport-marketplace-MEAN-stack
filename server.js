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

//Vigilar amb les fotos al fer el deploy
var port = config.serverPort;	//80 //8080
var adress = config.serverUrl; //var adress = "178.62.35.246"; //localhost 

http.createServer(app).listen(port, adress, function() {
	console.log('Conected on local:8080! :D' + new Date() )
});

