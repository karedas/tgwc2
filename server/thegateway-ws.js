#!/usr/bin/env node

'use strict';

/**
 * module dependencies.
 */

const log = console.log;
const path = require('path');
const winston = require('winston');
const chalk = require('chalk');
const Convert = require('ansi-to-html');
const crypto = require('crypto');
const bodyParser = require ('body-parser');
const dotenv = require('dotenv').load({
	path: '.env'
});;
const net = require('net');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
	'pingInterval': 2000, 'pingTimeout': 5000
});
const cookieParser = require('cookie-parser');
const sharedsession = require('express-socket.io-session');



/**
 * Logging configuration.
 */
const fileLogger = new winston.transports.File({
	level: 'info',
	timestamp: true,
	filename: 'thegateway-ws',
	dirname: './logs',
	maxsize: 100*1024*1024,
	maxFiles: 4,
	json: false
});

const logger = winston.createLogger({
	transports: [
		fileLogger
	]
});

let session = require("express-session")({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
});


// start Session DB
app.set('trust proxy', 1);
app.set('max_requests_per_ip', 20);
app.use(bodyParser.urlencoded({extended: true}));
app.use(session, cookieParser(process.env.SESSION_SECRET));
app.use('/static', express.static(__dirname + '/public'));


// Use shared session middleware for socket.io
// setting autoSave:true
io.use(sharedsession(session, {
    autoSave:true
})); 

server.listen(process.env.WS_PORT, () => {
	SocketServer();
	log('%s Websocket server listening on port %d', chalk.green('✓'), process.env.WS_PORT);
	logger.info('Websocket server listening on port %d', process.env.WS_PORT);


});

function SocketServer() {
	
	// Handle incoming websocket  connections

	
	//import routes

	io.on('connection', function(socket) {
		
		socket.on('loginrequest', function(){
			socket.emit('data', '&!connmsg{"msg":"ready"}!');
		})

		socket.join('culo');

		socket.on('oob', function(msg) {
			// Handle a login request
			if (msg["itime"]) {
				let account_id =  0;
				// Get the request headers
				let headers =  socket.handshake.headers;
				
				let codeHeaders = CalcCodeFromHeaders(headers);

				// Get the real client IP address
				let client_ip = GetClientIp(headers);

				// Get the 'itime' code value
				let codeitime = msg["itime"];

				// Client code
				let clientcode = codeitime + '-' + codeHeaders;
				logger.info('New connection %s from:%s, code:%s, account:%d', socket.id, client_ip, clientcode, account_id);
				// Conect to game server

				let tgconn = ConnectToGameServer(socket, client_ip, codeitime, codeHeaders, account_id);

				socket.on('disconnect', function() {
					logger.info('Closing %s', socket.id);
					// Disconnect from game server
					tgconn.destroy();
				});
			};

		});
	});

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

	function ConnectToGameServer(websocket, from_host, code_itime, code_headers, account_id) {
//		let port =  process.env.SERVER_GAME_PORT;
		let	host = process.env.SERVER_GAME_HOST;

		let tgconn = net.Socket(host);
		// Normal server->client data handler. Move received data to websocket
		function sendToServer(msg) {
			tgconn.write(msg + '\n');
		}

		// Normal server->client data handler. Move received data to websocket
		function sendToClient(msg) {
			let godpath = /&i/gm;
			if(godpath.test(msg.toString())) {
				tgconn.join('gods');
			}
			websocket.emit('data', msg.toString());
		};

		// Socket close event handler
		tgconn.on('close', function(){
			// Close the websocket
			websocket.disconnect();
		});

		// Connection/transmission event error handler
		tgconn.on('error', function(){
			// Tell the client the server is down
			sendToClient('&!connmsg{"msg":"serverdown"}!');
			// Close the websocket
			websocket.disconnect();
		});


		tgconn.on("end", function(err){
			websocket.disconnect();
		});

		tgconn.on("timeout",  function(){
			websocket.disconnect();
		});
		
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
		};

			
		tgconn.on('data', handshake);

		return tgconn;
	}
}
