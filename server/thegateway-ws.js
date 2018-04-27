/*
    Copyright (C) 2018  PencilBlue, LLC
*/
'use strict';

/**
 * module dependencies.
 */
const path = require('path');
const winston = require('winston');
const passport = require('passport');
const chalk = require('chalk');
const dotenv = require('dotenv');

const crypto = require('crypto');
const net = require('net');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);


// initializing express-session middleware
const Session = require('express-session');
const SessionStore = require('session-file-store')(Session);
const session = Session({store: new SessionStore({path: __dirname+'/tmp/sessions'}), secret: 'pass', resave: true, saveUninitialized: true});


const log = console.log;

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({
	path: '.env'
});

/**
 * Logging configuration.
 */
let fileLogger = new winston.transports.File({
	level: 'info',
	timestamp: true,
	filename: 'thegateway-api',
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


/**
 * Start Express server.
 */
	
let sio = http.listen(process.env.WS_PORT, () => {
	SocketServer(sio);
	log('%s Websocket server listening on port %d', chalk.green('✓'), process.env.WS_PORT);
	logger.info('Websocket server listening on port %d', process.env.WS_PORT);
});


function SocketServer(sio) {
	// 	// Default game server local port

	let tgaddr = {
		host: process.env.TGAPI_ADDR,
		port: process.env.TGAPI_TELNET_PORT
	};


	// Handle incoming websocket  connections
	io.on('connection', (socket) => {

		let session = 1;	

		socket.on('oob', function(msg) {
			GetUserFromSession(session, function(err, user) {

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

			// socket.on('disconnect', function() {
			// 	logger.info('Closing %s', socket.id);

			// 	//Disconnect from game server
			// 	//tgconn.destroy();
			// });
		});

		socket.emit('data', 'ready!\n');
	});

	function GetUserFromSession(session, done) {
		done();
	}

	// Get real client IP address from headers
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

	// Calculate a code from headers
	function CalcCodeFromHeaders(headers)
	{
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
			console.log('send to the server');
			console.log(msg);
			msg = Buffer.from(msg, 'utf8');
			tgconn.write(msg +'\n');
		}

		// Normal server->client data handler. Move received data to websocket
		function sendToClient(msg) {
			// Copy the data to the client
			console.log('send to the client');
			console.log(msg.toString());
			websocket.emit('data', msg.toString('utf8'));
		};

		// Handshaking server->client handler data handler
		// This is used only until login
		function handshake(msg) {
			console.log('<<<<<<####################>>>>>');
			// if (msg.toString().indexOf("Vuoi i codici ANSI") != -1) {
			// Substitute with the copy handler
			// tgconn.removeListener('data', handshake);

			tgconn.on('data', sendToClient);

			// Add handler for client->server data
			websocket.on('data', sendToServer);


			// Reply to challenge with webclient signature: ip, code
			// sendToServer('WEBCLIENT('+ from_host +','+ code_itime +'-'+ code_headers +','+account_id+')\n');

			// } else {
			// 	sendToClient(msg);
			// }
		}

		tgconn.on('data', handshake);

		return tgconn;
	}
}

module.exports = http;