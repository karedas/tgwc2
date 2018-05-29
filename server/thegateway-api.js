
const http = require('http');
const connect = require('connect');
const express = require('express');

const passport = require('passport');
// const mailer = require('./libs/mailer');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

const moment = require('moment');
const dotenv = require('dotenv');

// Loggers
const winston = require('winston');
const expressWinston = require('express-winston');

// Load config file .
dotenv.load({
	path: '.env'
});



let fileLogger = new winston.transports.File({
	level: 'info',
	timestamp: true,
	filename: 'thegateway-api',
	dirname: './logs',
	maxsize:100*1024*1024,
	maxFiles:4,
	json: false
});

/*
var consoleLogger = new winston.transports.Console({
	colorize: true,
	level: 'debug',
	timestamp: true
});
*/

let logger = new (winston.Logger)({
	transports: [
		fileLogger
	],
	exceptionHandlers: [
		fileLogger
	],
	exitOnError: false
});


// var sessionStore = new connect.middleware.session.MemoryStore();
let SQLiteStore  = require('connect-sqlite3')(session);
let sessionStore = new SQLiteStore();




let db = require('./models')({
	storage: process.env.DATABASEPATH,
	logging: logger.debug
});

// Init the database
db.sequelize.sync().done(function(err) {

	let app = express();
	app.set('max_requests_per_ip', 20);
	app.set('port', process.env.API_PORT);
	app.set('client_url', process.env.CLIENTURL);

	app.enable('trust proxy');
	app.use(expressWinston.logger({
		transports: [ fileLogger ],
		meta: false,
		msg: "HTTP {{res.statusCode}} {{req.method}} {{req.url}}"
    }));
	
	app.use(cookieParser(process.env.SESSION_SECRET));
	app.use(session({
		secret: process.env.SESSION_SECRET,
		store: new SQLiteStore,
		resave: true,
		saveUninitialized: true
	}));
	app.use(passport.initialize());
	app.use(passport.session());

	app.use(bodyParser.json());
	
	// require('./routes')(logger, app, db, passport, mailer);
	require('./config/passport')(logger, passport, db);
	require('./routes')(logger, app, db, passport);
	
	app.use(expressWinston.errorLogger({
		transports: [ fileLogger ],
		meta: false
    }));


	app.locals.moment = moment;
   
	// Start the HTTP serverclear
	http.createServer(app).listen(process.env.API_PORT, function(){
		console.log('server api avviato su porta %d', process.env.API_PORT);
		logger.info('Express server listening on port %d', process.env.API_PORT);
	});
});
