'use strict';

/**
 * module dependencies.
 */

const log = console.log;

const path = require('path');
const winston = require('winston');
const passport = require('passport');
const chalk = require('chalk');


const Convert = require('ansi-to-html');
const crypto = require('crypto-js');

const dotenv = require('dotenv');

// Load config file .
dotenv.load({
	path: '.env'
});

const net = require('net');
const cookieParser = require('cookie-parser');

const http = require('http');
const app = require('express')();
const session = require('express-session');
const server = require('http').createServer(app);  
const io = require('socket.io')(server);

const SQLiteStore = require('connect-sqlite3')(session);

app.use(session({
	store: new SQLiteStore,
	secret: process.env.SESSION_SECRET,
	cookie: {secure: true},
	resave: false,
	saveUninitialized: true
}
));

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */



let convert = new Convert();

/**
 * Logging configuration.
 */
let fileLogger = new winston.transports.File({
	level: 'info',
	timestamp: true,
	filename: 'thegateway-ws',
	dirname: './logs',
	maxsize: 100*1024*1024,
	maxFiles: 4,
	json: false
});

let logger = new(winston.Logger)({
	transports: [
		fileLogger
	]
});


/*
var consoleLogger = new winston.transports.Console({
	colorize: true,
	level: 'debug',
	timestamp: true
});
*/

let db =  require('./models')({
	storage: process.env.DATABASEPATH,
	logging: logger.debug
});


// Create/update Table base on models
db.sequelize.sync().done(function(err){
	
	let sio = server.listen(process.env.WS_PORT, () => {
		SocketServer(sio, db);
		log('%s Websocket server listening on port %d', chalk.green('✓'), process.env.WS_PORT);
		logger.info('Websocket server listening on port %d', process.env.WS_PORT);
	});
	
});

function SocketServer(sio, db) {
	// 	// Default game server local port

	let tgaddr = {
		host: process.env.TGAPI_ADDR,
		port: process.env.TGAPI_TELNET_PORT
	};

	// Handle incoming websocket  connections
	sio.on('connection', (socket) => {

		socket.on('oob', function(msg) {

			GetUserFromSession(session, function(err, user) {

				let account_id = ( err != null || user == null ) ? 0 : user.id;

				// Get the request headers
				let headers =  socket.handshake.headers;

				//Calculate coded headers
				let codeHeaders = CalcCodeFromHeaders(headers);

				// Get the real client IP address
				let client_ip = GetClientIp(headers);

				// Get the 'itime' code value
				var codeitime = '';

				// Client code
				var clientcode = codeitime + '-' + codeHeaders;

				logger.info('New connection %s from:%s, code:%s, account:%d', socket.id, client_ip, clientcode)
				
				// Conect to game server
				let tgconn = ConnectToGameServer(socket, tgaddr, client_ip);

			});

			socket.on('disconnect', function() {
				logger.info('Closing %s', socket.id);

				//Disconnect from game server
				tgconn.destroy();
			});
		});
	});

	function GetUserFromSession(session, done)
	{
		console.log(session);
		console.log(session.passport.user);

		try
		{
			db.Account.find(session.passport.user).complete(done)
		}
		catch(e) {
			done('Error getting session');
		}
	};

// 	// Get real client IP address from headers
	function GetClientIp(headers) {
		let ipAddress;
		let forwardedIpsStr = headers['x-forwarded-for'];

		if (forwardedIpsStr) {
			let forwardedIps = forwardedIpsStr.split(',');
			ipAddress = forwardedIps[0];
		}

		if (!ipAddress) {
			ipAddress = headers['x-real-ip'];
		}

		if (!ipAddress) {
			ipAddress = 'unknown';
		}

		return ipAddress;
	}

// 	// Calculate a code from headers
	function CalcCodeFromHeaders(headers){
		let hash = crypto.createHash('md5');

		if(headers['user-agent'])
			hash.update(headers['user-agent']);

		if(headers['accept'])
			hash.update(headers['accept']);

		if(headers['accept-language'])
			hash.update(headers['accept-language']);

		if(headers['accept-encoding'])
			hash.update(headers['accept-encoding']);

		return hash.digest('hex');
	}

	function ConnectToGameServer(websocket, tgaddr, client_ip) {

		let tgconn = net.connect(tgaddr.port, tgaddr.host);

		// Normal server->client data handler. Move received data to websocket
		function sendToServer(msg) {
			tgconn.write(msg +'\n');
		}

		// Normal server->client data handler. Move received data to websocket
		function sendToClient(msg) {
			// Copy the data to the client
			console.log(msg.toString());
			console.log("onCLIENT: ",msg.toString());
			websocket.emit('data', convert.toHtml(msg.toString()));
		};

		// Handshaking server->client handler data handler
		// This is used only until login
		function handshake(msg) {
			if (msg.toString().indexOf("Vuoi i codici ANSI") != -1) {
			// Substitute with the copy handler
			tgconn.removeListener('data', handshake);
			tgconn.on('data', sendToClient);

			// Add handler for client->server data
			websocket.on('data', sendToServer);


			// Reply to challenge with webclient signature: ip, code
			sendToServer('WEBCLIENT('+ from_host +','+ code_itime +'-'+ code_headers +','+account_id+')\n');

			} else {
				sendToClient(msg);
			}
		}

		tgconn.on('data', handshake);

		return tgconn;
	}
}
