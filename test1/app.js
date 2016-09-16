const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var login = require('./app/models/loginSchema');
const app = express();
const mongoUrl = 'mongodb://localhost/todolist';
const routes = require('./app/routes/index');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
mongoose.Promise = global.Promise;
mongoose.connect(mongoUrl, function(err, res){
	if (err) {
		console.log(err);
	}
	else {
		console.log('Mongo connection success');
	}
});


app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(expressValidator());
app.use(expressSession({secret : 'lost',saveUninitialized : true ,resave : false}))
app.use('/',routes);

app.listen(3000, function() {
  console.log("Server Started");
});
