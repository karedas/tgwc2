import io from 'socket.io-client';

class TgClient {

	constructor(opts) {
		//socket.io
		this.socket = null;
		this.socket_addr = 'http://192.168.10.10';
		this.socket_port = ':3333';
		this.socket_transport = ["polling"];
		//net stuff
		this.connected = false;
	}

	connectToServer() {

		let _ = this;

		_.socket = io(_.socket_addr + _.socket_port);
		
		_.socket.on('connect', () => {
			_.connected = true;
			_.sendOOB();
			_.init();
		});

		_.socket.on('data', function(data){
			//temporary
			_.updateOutput(data);
		});

		_.socket.emit('oob')
	
		_.socket.on('error', () => {});

		_.socket.on('disconnect', () => {});

		
	}

	init() {

		let _ = this;

		_.keyboardInit();
		_.addEvents();
	}

	//Map of keyboard characters and their events
	keyboardInit() {

		let _ = this;

		$(document).on('keydown', function (event) {

			if(event.which == 27) {
				/* ESC key, close all dialogs */
				// closeAllDialogs();
				console.log('comando non ancora supportato');
				return false;

			}

			if($(event.target).is('#inputline') === true) {
				switch(event.which) {
					//Enter
					case 13:
						_.sendInput();
					break;
				}
			}
		});
	}

	//print echo inside output main area
	updateOutput(msg) {
		let _ = this;
		$('#output').append(msg);
	}


	sendToServer(text) {
		let _ = this;
		if (!_.connected)
			return;
		_.socket.emit('data', text);
		console.log('......')
	}

	sendOOB() {
		let _ = this;
		if (!_.connected) {
			return;
		}
	}

	sendInput() {
		let  _ = this;

		//Get the value from input text, then cleaning element
		let cmd = $('#inputline').val();
		if(cmd != '') {
			_.sendToServer(cmd);
			//TODO serve un parser
			_.updateOutput('<p class="user-cmd">> ' + cmd + '</p>');
			
		}
		
		$('#inputline').val('');

	}

	addEvents() {

		let _ = this;

		//Input Text send
		$('#sendCmd').on('click', function(e){
			e.preventDefault();
			_.sendInput();
		})
	}
}




(function(document, window) {

		//magic starts here
		TG.onReady = function() {

			const Client = new TgClient();
			Client.connectToServer();

		}

	$(document).ready(TG.onReady);

}(document, window));


// // socket.connect(socket_addr + socket_port, { autoConnect: true});

// // socket.connect(socket_addr + socket_port);