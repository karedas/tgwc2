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
const dotenv = require('dotenv').load({
	path: '.env'
});;
const net = require('net');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cookieParser = require('cookie-parser');


// Attach session

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

// start Session DB
app.set('trust proxy', 1);
app.set('max_requests_per_ip', 20);
app.use(cookieParser(process.env.SESSION_SECRET));


server.listen(process.env.WS_PORT, () => {
	SocketServer();
	log('%s Websocket server listening on port %d', chalk.green('✓'), process.env.WS_PORT);
	logger.info('Websocket server listening on port %d', process.env.WS_PORT);
});

function SocketServer() {
	// Handle incoming websocket  connections
	io.on('connection', function(socket) {
		
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
		socket.emit('data', '&!connmsg{"msg":"ready"}!');
	});

// // 	// Get real client IP address from headers
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
		let tgconn = net.connect(process.env.SERVER_GAME_PORT , process.env.SERVER_GAME_HOST);

	
		// Normal server->client data handler. Move received data to websocket
		function sendToServer(msg) {
			console.log(msg);
			//tgconn.write(msg +'\n');
		}

		// Normal server->client data handler. Move received data to websocket
		function sendToClient(msg) {
			// Copy the data to the client
			websocket.emit('data', msg.toString());
		};

		// Handshaking server->client handler data handler
		// This is used only until login
		function handshake(msg) {
			if (msg.toString().indexOf("Vuoi i codici ANSI") != -1) {
				console.log(msg);
				// Substitute with the copy handler
				tgconn.removeListener('data', handshake);
				tgconn.on('data', sendToClient);
				// Add handler for client->server data
				websocket.on('data', sendToServer);

				// Reply to challenge with webclient signature: ip, code
				sendToServer('WEBCLIENT(0.0.0.0,'+ code_itime +'-'+ code_headers +','+account_id+')\n');

			} else {
				sendToClient(msg);
			}
		}

		tgconn.on('data', handshake);

		return tgconn;
	}
}
