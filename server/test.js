#!/usr/bin/env node

'use strict';

/**
 * module dependencies.
 */

const log = console.log;
const path = require('path');
const winston = require('winston');
const chalk = require('chalk');
const dotenv = require('dotenv').load({
	path: '.env'
});;
const app = require('express')();
const server = require('http').createServer(app);

const fileUpload = require('express-fileupload');

const io = require('socket.io')(server, {
	'pingInterval': 2000, 'pingTimeout': 5000
});
const cookieParser = require('cookie-parser');
const sharedsession = require('express-socket.io-session');


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

let logger = winston.createLogger({
	level: 'info',
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
app.use(session, cookieParser(process.env.SESSION_SECRET));
app.use(fileUpload);
// Use shared session middleware for socket.io
// setting autoSave:true
io.use(sharedsession(session, {
    autoSave:true
})); 


app.post('/upload', function(req, res) {
	console.log('upload');
	if (!req.files)
	  return res.status(400).send('No files were uploaded.');
   
	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	let sampleFile = req.files.sampleFile;
   
	// Use the mv() method to place the file somewhere on your server
	sampleFile.mv('/tmp/filename.jpg', function(err) {
	  if (err)
		return res.status(500).send(err);
   
	  res.send('File uploaded!');
	});
  });

  

server.listen(process.env.WS_PORT, () => {
	SocketServer();
	log('%s Websocket server listening on port %d', chalk.green('✓'), process.env.WS_PORT);
	logger.info('Websocket server listening on port %d', process.env.WS_PORT);
});



function SocketServer() {
	// Handle incoming websocket  connections
	io.on('connection', function(socket) {
		console.log(socket);
		console.log('connected');
		socket.on('loginrequest', function(){
			socket.emit('data', '&!connmsg{"msg":"ready"}!');
        });
    });
}
