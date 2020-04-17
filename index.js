// imorting packages
let express = require('express');
let session = require('express-session');
let bodyParser = require('body-parser');
let path = require('path');
let env = require('dotenv');
let router = require('./routes/main.js'); // importing router file
let port = process.env.PORT;

env.config();

let app = express(); // creating express app

// configuring middleware used by routes of the app
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/',router); // router for handling all routes, if '/' was replaced with '/user', it would handle routes starting with '/user'

app.listen(port, console.log(`listening on port ${port}`));