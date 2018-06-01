<%-
	require "pathname"
	require "./#{File.dirname(__FILE__)}/../config/config"
	require "./#{File.dirname(__FILE__)}/../config/utils"

	@assets = open('assets_list').map{ |line| line.split }
-%>

var ws_server_addr = 'http://';
var socket_io_resource = 'socket.io';
// var socket_io_resource = document.location.pathname.slice(1)+'socket.io';

// Set to a specific server or ''
// var media_server_addr = ''
var media_server_addr = '//www.tg.it/assets'


/* Paths */
var ws_prefix='/';
var images_path = media_server_addr+ws_prefix+'images';
var sounds_path = media_server_addr+ws_prefix+'sounds';



/* Map */
var maxmapwidth = 9;
var maxmapheight = 9;
var maptilewidth = 32;
var maptileheight = 32;
var maplight;
var mapidprefix = 'mp'
var mapctx = null;
var maptileimg = null;
var mapshadowimg = [];
var maprainimg = null;
var mapsnowimg = null;
var mapfogimg = null;
var cursoronmap = false;
var mapsizedata = {
	'map_n':{ dialogClass:null, width: 360, height: 375 },
	'map_m':{ dialogClass:'small', width: 287, height: 295 },
	'map_s':{ dialogClass:'tiny', width: 216, height: 225 }
};

var layermap = new Array(maxmapheight);
for(var y = 0; y < maxmapheight; ++y)
{
	layermap[y] = new Array(maxmapwidth);
}


/* History */
var max_history_length = 40;
var cmd_history_pos = 0;
var cmd_history = [];


/* Connection */
var socket;
var connected = false;
var isgod = false;
var godinvlev = 0;
var netdata = '';


/* Details */
var exp_grp_list = {};
var max_exp_grp = 15;


/* Exits */
var dir_north = 0;
var dir_east = 1;
var dir_south = 2;
var dir_west = 3;
var dir_up = 4;
var dir_down=5;

var dir_names = ['nord', 'est', 'sud', 'ovest', 'alto', 'basso'];
var dir_status = '000000';


/* Input */
var cmd_prefix = '';

/* Autoscroll */
var autoscroll_enabled = true;


/* Status */
var in_editor = false;
var dragging = false;
var max_drop_stack = null;
var at_drag_stop_func = null;

/* Debug */
var debug = true;
var directLogin = true;

/* Account verify data */
var verify_email, verify_token;


/* Account data */
var user_account_data;
var enabled_chars_count = 0;


/* Output */
var last_room_desc='';

var output_size_options = [
	{
		name: 'Piccolissimo',
		class: 'xs'
	},
	{
		name: 'Piccolo',
		class: 's'
	},
	{
		name: 'Medio',
		class: 'm'
	},
	{
		name: 'Grande',
		class: 'l'
	},
	{
		name: 'Grandissimo',
		class: 'xl'
	},
	{
		name: 'Gigantesco',
		class: 'xxl'
	},
	{
		name: 'Enorme',
		class: 'xxxl'
	}
];

/* Weight bars */
var wgttxtcol = [
	{ val:80, txt:'orangered' },
	{ val:60, txt:'yellow' },
	{ val:0, txt:'greenyellow' },
];

var wgtbarcol = [
	{ val:80, txt:'red' },
	{ val:60, txt:'yellow' },
	{ val:0, txt:'green' },
];

/* Health bars */
var hlttxtcol = [
	{ val:25, txt:'orangered' },
	{ val:50, txt:'yellow' },
	{ val:100, txt:'greenyellow' },
];


/* Equip */
var eqracesex = '';
var lastEquip;

/* Options */
var cookiepre = 'tgwc_';

var client_state = {
	window:{}
};

var client_options = {
	musicVolume:70,
	soundVolume:100,
	output:{
		textSize:2,
		trimLines:500
	},
	shortcuts:[],
	login:{},
	details:{
		compact:false,
		size:'icons_n'
	},
	combatFilter:0,
	equipAsList:false,
	noDetails:false,
	log:{
		enabled:true,
		save:false,
		clean:true
	},
	map:{
		size:'map_n',
		sight: false
	},
	buttonsOnTop:false,
	textOnTop:false
};


/* Login */
var loginPortraitTimer;
var currentPortrait = Math.floor((Math.random()*6)+1);
var initialized = false;
var ingame = false;
var updateChars = false;

var facebookMode;
var facebookToken;

var facebookCanvasAuth = {
	'clientId': '374791275967976',
	'loginURL': '/api/facebook-canvas/login',
	'linkURL': '/api/facebook-canvas/link'
};
var facebookAppAuth = {
	'clientId': '654838687898957',
	'loginURL': '/api/facebook/login',
	'linkURL': '/api/facebook/link'
};

var facebookAuth = null;

var connectionInfo = {
	mode:'login',
	error:null
};


/* Logs */
var logInfo = {
	start:null,
	saved:true
};

/* Shortcuts */
var shortcuts_map = {};


/* Combat panel */
var in_combat = false;
var enemy_icon = 0;

/* Filters */
var filter_out = [];
var filter_in = [];

var combat_filters = [
	{
		/* Normal */
		name: "niente",
		filter_in: ['.o_cmb_m','.o_cmb_n','.o_cmb_h'],
		filter_out: []
	},
	{
		/* Filter others: miss */
		name: "mancato",
		filter_in:['.o_cmb_n','.o_cmb_h'],
		filter_out:['.o_cmb_m']
	},
	{
		/* Filter others: miss, nodam */
		name: "mancato e bloccato",
		filter_in:['.o_cmb_h'],
		filter_out:['.o_cmb_m','.o_cmb_n']
	},
	{
		/* Filter all */
		name: "tutto",
		filter_in:[],
		filter_out:['.o_cmb_m','.o_cmb_n','.o_cmb_h']
	}	
];


var client_update =
{
	last:0,
	inventory: {
		version:-1,
		needed:false
	},
	equipment: {
		version:-1,
		needed:false
	},
	room: {
		version:-1,
		needed:false
	}
}


/* *****************************************************************************
 * UTILITY
 */


/* Save/load functions */

function Load(what)
{
	what = cookiepre + what;
	if (Modernizr.localstorage)
	{
		var data = localStorage[what];
		return data ? JSON.parse(data) : null;
	}
	else
		return $.cookie(what);
}

function Save(what, value)
{
	what = cookiepre + what;
	if (Modernizr.localstorage)
		localStorage[what] = JSON.stringify(value);
	else
		$.cookie(what, value);
}



function capFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function closeDialog(dialogid)
{
	var d = $(dialogid);

	if(d.is(':data(uiDialog)'))
		return d.dialog( "close" );

	return null;
}

function openDialog(dialogid)
{
	var d = $(dialogid);

	if(d.is(':data(uiDialog)'))
		return d.dialog(d.dialog('isOpen') ? 'moveToTop' : 'open');
	return null;
}

function isDialogOpen(dialogid)
{
	var d = $(dialogid);

	return d.is(':data(uiDialog)') && d.dialog('isOpen');
}

function isDialog(dialogid)
{
	var d = $(dialogid);

	return d.is(':data(uiDialog)');
}

function whichTabIsOpen(dialogid)
{
	if(isDialogOpen(dialogid))
		return $(dialogid).tabs('option','active');

	return null;
}

function closeAllDialogs()
{
	abortEdit();
	closeDialog('#equipdialog');
	closeDialog('#invdialog');
	closeDialog('#bookdialog');
	closeDialog('#configdialog');
	closeDialog('#infodialog');
	closeDialog('#selectdialog');
	closeDialog('#logdialog');
	closeDialog('#tabledialog');
}

function toggleDialog(dialogid)
{
	if(isDialogOpen(dialogid))
		closeDialog(dialogid);
	else
		openDialog(dialogid);
}


/* *****************************************************************************
 * EDITOR
 */

function editorDialogInit()
{
	$('#editorcancel').button().click(function() {
		abortEdit();
	});

	$('#editorsave').button().click(function() {
		saveEdit(80);
	});
}

function closeEditor()
{
	in_editor = false;
	$('#editordialog').dialog( "close" );
	focusInput();
}

function saveEdit(maxlinelen)
{
	var text = $('#editortext').val().split('\n');
	for(var l = 0; l < text.length; l++)
	{
		var remtext = text[l];

		while(remtext.length > 0)
		{
			var currline;
			var slicepos = remtext.lastIndexOf(' ', maxlinelen);

			if (slicepos > 0)
			{
				currline = remtext.slice(0, slicepos)+'\\';
				remtext = remtext.slice(slicepos);
			} else {
				currline = remtext;
				remtext = '';
			}

			sendToServer('##ce' + currline);

		}
	}
	sendToServer('##ce_save');
}

function abortEdit()
{
	if(in_editor)
		sendToServer('##ce_abort');
}

function openEditor(maxchars, title, text)
{
	$('#editortext').val(text);
	$('#editortextmax').text(maxchars);
	$('#editortext').NobleCount('#editortextcount', {
		max_chars: parseInt(maxchars),
		on_positive: 'green',
		on_negative: 'red',
		block_negative: true
	});


	var options;
		
	if(isDialog('#editordialog')) {
		options = {	title: addBannerStyle(title) };
	} else {
		options = {
			title: addBannerStyle(title),
			width: 600,
			height: 500,
			modal: true,
			dialogClass:'tg-dialog styledbuttons parch',
			close: function() {
				abortEdit();
			},
			closeText: 'Annulla'
		};
	}
		
	$('#editordialog').dialog(options);

	in_editor = true;
}


/* *****************************************************************************
 * DEBUGGING
 */

function debug(txt) {
	$('#debug').text(txt);
}

/* *****************************************************************************
 * KEYBOARD
 */

function commandOrCloseDialog(d, c)
{
	if (isDialogOpen(d))
		closeDialog(d);
	else
		sendToServer(historyPush(c));
}

function keyboardInit()
{
	$('#mapdialog').mouseenter(function () {
		cursoronmap = true;
	});

	$('#mapdialog').mouseleave(function () {
		cursoronmap = false;
	});

	$(document).on('keydown', function (event) {

		if(!connected)
			return true;

		if(event.metaKey || event.ctrlKey)
			return true;

		if(event.which == 27) {

			/* ESC key, close all dialogs */
			closeAllDialogs();
			return false;

		}

		if(in_editor) {
			return true;
		}

		if(event.altKey) {

			if(event.which >= 48 && event.which <= 57) {

				/* ALT + [0-9] */
				processCommands(String.fromCharCode(event.which));
				event.preventDefault();
				return false;

			}

			switch(String.fromCharCode(event.which))
			{
				case 'I':
					/* Inventory */
					commandOrCloseDialog('#invdialog', "invent");
					return false;

				case 'E':
					/* Equipment */
					commandOrCloseDialog('#equipdialog', "equip");
					return false;

				case 'M':
					/* Money */
					sendToServer(historyPush("monete"));
					openDialog('#textdialog');
					return false;

				case 'S':
					/* Status */
					sendToServer(historyPush("stato"));
					openDialog('#textdialog');
					return false;

				case 'A':
					/* Skills */
					commandOrCloseDialog('#tabledialog', "abilit");
					return false;

				case 'N':
					/* Info */
					commandOrCloseDialog('#infodialog', "info");
					return false;

				case 'D':
					toggleDialog('#detailsdialog');
					return false;
					
				case 'R':
					toggleDialog('#logdialog');
					return false;

				case 'F':
					$(document).toggleFullScreen();
					return false;
			}
		}

		if(event.altKey || cursoronmap) {

			switch(event.which)
			{
				case 33:
					goDir(dir_up);
					return false;

				case 34:
					goDir(dir_down);
					return false;

				case 37:
					goDir(dir_west);
					return false;

				case 38:
					goDir(dir_north);
					return false;

				case 39:
					goDir(dir_east);
					return false;

				case 40:
					goDir(dir_south);
					return false;
			}

		}

		if($(event.target).is('#inputline') === true) {

			if(event.which == 13) {

				/* ENTER key, handle here */
				sendInput();
				pauseOff();
				return false;

			}
			
			if (event.which == 49 && event.shiftKey === true && $(event.target).val().length == 0)
			{
				var l = cmd_history.length;
				
				if(l > 0)
					processCommands(cmd_history[l-1]);
				return false;
			}

			/* Check for arrow keys. Handle only if cursor is not on map */
			switch(event.which) {
				case 38:
					historyUp();
					event.preventDefault();
					return true;

				case 40:
					historyDown();
					event.preventDefault();
					return true;

				case 33:
					historyTop();
					event.preventDefault();
					return true;

				case 34:
					historyBottom();
					event.preventDefault();
					return true;

				default:
					pauseOff();
					return true;
			}
		}

		if(!$(event.target).is('input'))
			focusInput();

		return true;
	});
}


/* *****************************************************************************
 * WINDOWS
 */

function setWindowPosition(id, left, top)
{
	if(client_state.window[id] == null)
		client_state.window[id] = {};

	client_state.window[id].position = [left, top];
}

function getWindowPosition(id)
{
	if(client_state.window[id] == null)
		return null;

	return client_state.window[id].position;
}

function setWindowSize(id, width, height)
{
	if(client_state.window[id] == null)
		client_state.window[id] = {};

	client_state.window[id].size = [width, height];
}

function getWindowSize(id)
{
	if(client_state.window[id] == null)
		return null;

	return client_state.window[id].size;
}


function saveWindowData(event, obj)
{
	var id;

	switch(event.type)
	{
		case 'dialogdragstop':
			id = event.target.id;
			setWindowPosition(id, obj.position.left, obj.position.top);
			break;

		case 'dragstop':
			id = $(event.target).children('.ui-dialog-content').attr('id');
			setWindowPosition(id, obj.position.left, obj.position.top);
			break;

		case 'dialogresizestop':
			id = event.target.id;
			setWindowPosition(id, obj.position.left, obj.position.top);
			setWindowSize(id, obj.size.width, obj.size.height);
			break;

		case 'resizestop':
			id = $(event.target).children('.ui-dialog-content').attr('id');
			setWindowPosition(id, obj.position.left, obj.position.top);
			setWindowSize(id, obj.size.width, obj.size.height);
			break;
	}

	Save('state', client_state);
}


/* *****************************************************************************
 * COMMAND HISTORY
 */

function updateInput()
{
	var text = cmd_history[cmd_history_pos] ? cmd_history[cmd_history_pos] : '';
	$('#inputline').val(text).focus();
}

function historyTop()
{
	if (cmd_history_pos > 0)
	{
		cmd_history_pos = 0;
		updateInput();
	}
}

function historyBottom()
{
	if (cmd_history_pos < cmd_history.length)
	{
		cmd_history_pos = cmd_history.length;
		updateInput();
	}
}


function historyUp()
{
	if (cmd_history_pos > 0)
	{
		cmd_history_pos--;
		updateInput();
	}
}

function historyDown()
{
	if (cmd_history_pos < cmd_history.length)
	{
		cmd_history_pos++;
		updateInput();
	}
}

function historyPush(text)
{
	if(text.length > 0)
	{
		if(cmd_history.length >= max_history_length)
			cmd_history.shift();

		if(cmd_history.length == 0 || cmd_history[cmd_history.length-1] != text)
			cmd_history.push(text);

		cmd_history_pos = cmd_history.length;

		$('#inputline').val('');
	}

	return text;
}



/* *****************************************************************************
 * INPUT
 */

function inputPassword()
{
	$('#inputline').get(0).type = 'password';
	$('#inputline').focus();
}

function inputText()
{
	$('#inputline').get(0).type = 'text';
	$('#inputline').focus();
}

function updateShortcutsMap()
{
	shortcuts_map = {};

	for(var idx = 0; idx < client_options.shortcuts.length; ++idx)
		if(client_options.shortcuts[idx] && client_options.shortcuts[idx].alias && client_options.shortcuts[idx].alias.length)
			shortcuts_map[client_options.shortcuts[idx].alias] = idx;
}

function substShort(input)
{
	// Split into arguments
	var args = input.split(/\s+/);

	// Get the shortcut index
	var shortcut_key = args.shift();
	var shortcut_num = parseInt(shortcut_key);
	var shortcut_cmd;

	if(!isNaN(shortcut_num))
		shortcut_cmd = client_options.shortcuts[shortcut_num];
	else if(typeof(shortcuts_map[shortcut_key]) != 'undefined')
		shortcut_cmd = client_options.shortcuts[shortcuts_map[shortcut_key]];

	// Check if the shortcut is defined
	if(shortcut_cmd)
	{
		// Use the shortcut text as command
		input = shortcut_cmd.cmd;

		if(/\$\d+/.test(input))
		{
			// Substitute the arguments
			for(var arg=0; arg < args.length; ++arg)
			{
				var rx = new RegExp("\\$"+(arg+1), 'g');
				input=input.replace(rx, args[arg]);
			}
			
			// Remove remaining variables
			input=input.replace(/\$\d+/g,'');
		} else
			input += " " + args.join(" ");
	}

	if (cmd_prefix.length > 0)
		input = cmd_prefix + " " + input;

	return input;
}



function parseInput(input)
{
	/* Split input separated by ; */
	var inputs = input.split(/\s*;\s*/);
	var res = [];

	/* Substitute shortcuts on each command and join results */
	for(var i=0; i < inputs.length; ++i) {
		var subs = substShort(inputs[i]).split(/\s*;\s*/);
		res = res.concat(subs);
	}

	/* Return the resulting array */
	return res;
}

function sendToServer(text)
{
	if (!connected)
		return;

	socket.emit('data', text);
}

function sendOOB(data)
{
	
	if (!connected)
	return;
	
	socket.emit('oob', data);
}

function processCommands(text)
{
	if (ingame) {
		var cmds = parseInput(text);

		if(cmds) {
			historyPush(text);
			for(var i=0; i < cmds.length; i++)
				sendToServer(cmds[i]);
		}
	} else {
		sendToServer(text);
		$('#inputline').val('').focus();
	}
}


function sendInput()
{
	processCommands($('#inputline').val());
}

function focusInput()
{
	$('#inputline').focus();
}


/* *****************************************************************************
 * OUTPUT BUTTONS
 */

function pauseButtonInit()
{
	$('#pausebutton').button({
			text: false,
			icons: {
				primary:'ui-icon-custom-pause'
			}
	}).click(function () {
		if(autoscroll_enabled)
			pauseOn();
		else
			pauseOff();
	})
}

function pauseOn()
{
	if(autoscroll_enabled) {
		autoscroll_enabled = false;
		$('#pausebutton').button("option", "icons", { primary: 'ui-icon-custom-play' });
	}
}

function pauseOff()
{
	if(!autoscroll_enabled) {
		autoscroll_enabled = true;
		$('#pausebutton').button("option", "icons", { primary: 'ui-icon-custom-pause' });
	}
}

function setOutputSize(new_size)
{
	var old_size = client_options.output.textSize;
	var old_class = output_size_options[old_size].class;
	var new_class = output_size_options[new_size].class

	var input = $('#input');
	var resizabletext = $('.resizabletext');

	if (old_class)
		input.removeClass(old_class);
	input.addClass(new_class);

	if (old_class)
		resizabletext.removeClass(old_class);
	resizabletext.addClass(new_class);

	client_options.output.textSize = new_size;
	Save('options', client_options);
}

function outputSizeButtonInit()
{
	$('#outputsizebutton').button({text:false}).click(function () {
		setOutputSize((client_options.output.textSize + 1) % output_size_options.length);
		focusInput();
	});
}


/* *****************************************************************************
 * LOGIN
 */

var current_login_panel;

function updateServerStats(s)
{
	var txt = "<table><tr><td>Giocatori online:</td><td>" + s.players.length + "</td></tr>";
	
	
	$.each(s.races, function(k, v) {
		if(typeof races[k] !== 'undefined')
		txt += '<tr><td>' + races[k] + '</td><td>' + v + '</td></tr>';
	});
	
	txt += "</table>";
	
	$('#online').html(txt);
}



function loginErrorClean()
{
	connectionInfo.error = null;
}

function loginError(msg)
{
	connectionInfo.error = msg;
	networkActivityMessage(msg);
}

function networkActivityMessage(msg)
{
	$('.networkmessage').text(msg);
}


/* Local account API */
function localAccountLogin(loginData, success, error)
{
	networkActivityMessage("Accesso all'account...");
	
	$.ajax({
		url: '/api/local/login',
		type: 'POST',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify (loginData),
		dataType: "json",
		success: success,
		error: error,
		beforeSend: networkActivityOn,
		complete: networkActivityOff
	});
}

function localAccountRequest(email, success, error)
{
	networkActivityMessage("Invio dell'email in corso...");
	
	$.ajax({
		url: '/api/local/request',
		type: 'POST',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify ({ email: email }),
		dataType: 'json',
		success: success,
		error: error,
		beforeSend: networkActivityOn,
		complete: networkActivityOff
	});	
}

function localAccountVerify(email, token, name, password, success, error)
{
	networkActivityMessage("Creazione dell'account in corso...");
	
	$.ajax({
		url: '/api/local/verify',
		type: 'POST',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify ({ email: email, token: token, name: name, password: password }),
		dataType: 'json',
		success: success,
		error: error,
		beforeSend: networkActivityOn,
		complete: networkActivityOff
	});
}

function localAccountCheck(token, success, error)
{
	networkActivityMessage("Verifica della richiesta in corso...");
	
	$.ajax({
		url: '/api/local/token/'+token,
		type: 'GET',
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: success,
		error: error,
		beforeSend: networkActivityOn,
		complete: networkActivityOff
	});	
}

function localAccountLink(email, success, error)
{
	networkActivityMessage("Invio dell'email in corso...");
	
	$.ajax({
		url: '/api/local/link',
		type: 'POST',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify ({ email: email }),
		dataType: 'json',
		success: success,
		error: error,
		beforeSend: networkActivityOn,
		complete: networkActivityOff
	});	
}





function changePassword(newpassword, success, error)
{
	$.ajax({
		url: '/api/local/login',
		type: 'PUT',
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		data: JSON.stringify ({ password: newpassword }),
		success: success,
		error: error,
		beforeSend: networkActivityOn,
		complete: networkActivityOff
	});
}



/* Facebook account API */
function facebookAccountLogin(token, success, error)
{
	networkActivityMessage("Accesso all'account...");
	
	if (!facebookAuth)
	{
		console.log("facebookAuth not set");
		return;
	}

	$.ajax({
		url: facebookAuth.loginURL,
		type: 'POST',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify ({ access_token: token }),
		dataType: 'json',
		success: success,
		error: error
	});
}


function facebookAccountUpdate(token, success, error)
{
	if (!facebookAuth)
	{
		console.log("facebookAuth not set");
		return;
	}

	$.ajax({
		url: facebookAuth.loginURL,
		type: 'PUT',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify ({ access_token: token }),
		dataType: 'json',
		success: success,
		error: error
	});
}


function facebookAccountLink(token, success, error)
{
	if (!facebookAuth)
	{
		console.log("facebookAuth not set");
		return;
	}

	$.ajax({
		url: facebookAuth.linkURL,
		type: 'POST',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify ({ access_token: token }),
		dataType: 'json',
		success: success,
		error: error
	});
}



/* Logout account API */
function accountLogout(success, error)
{
	networkActivityMessage("Disconnessione dall'account...");
	
	$.ajax({
		url: '/api/login',
		type: 'DELETE',
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: success,
		error: error
	});
}


/* Account API */
function getAccountProfile(success, error)
{
	networkActivityMessage("Richiesta profilo...");
	
	$.ajax({
		url: '/api/profile',
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: success,
		error: error,
		beforeSend: networkActivityOn,
		complete: networkActivityOff
	});
}


function getCharactersList(success, error)
{
	networkActivityMessage("Richiesta personaggi...");
	
	$.ajax({
		url: '/api/characters',
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: success,
		error: error,
		beforeSend: networkActivityOn,
		complete: networkActivityOff
	});
}



/* Client login/logout functions */

function setLoggedIn(user)
{
	networkActivityMessage('');
	
	$('.account-name').text(user.name ? user.name : 'straniero');
	$('#account-email').text(user.email ? user.email : 'nessuna');
	
	if (user.has_facebook)
	{
		$('#account-facebook').text('Si');
	}
	else
	{
		$('#account-facebook').html('<button type="button" id="assoc-facebook-acc-button" class="tg-button l tiny">Connettiti e associa</button>');
		$('#assoc-facebook-acc-button').button().click(function() {
		
			FB.login(function(response) {
				if (response.authResponse) {
					
					facebookToken = response.authResponse.accessToken;

					facebookAccountLink(facebookToken, function(data) {
						
						networkActivityMessage('');
						$('#account-facebook').text('Si');
						
					}, function (error) {
						if (error.status == 401)
							networkActivityMessage("Richiesta da account non autenticato.");
						else
							networkActivityMessage("Errore di comunicazione con il server.");
					});
					
				}
			}, { scope: 'public_profile,email' });
					
		});
	}
	
	
	if (user.has_local)
	{
		$('#password-form').show();
		$('#account-local').text('Si');
	}
	else
	{
		$('#password-form').hide();
		$('#account-local').html('<button type="button" id="assoc-local-acc-button" class="tg-button l tiny">Richiedi via email</button>');
		$('#assoc-local-acc-button').button().click(function() {
			
			localAccountLink(user.email, function(data) {
				
				networkActivityMessage('');	
				$('#account-local').text("Richiesto, controlla le tue email!");
				
				genericDialog("Email inviata!",
				"<p>Una email contenente un link di attivazione è stata inviata all'indirizzo:</p><p>"+
				user.email+
				"</p><p>Controlla tra qualche minuto nella tua casella di posta in arrivo,"+
				"troverai l'email con le istruzioni per completare la creazione.<br>A presto!</p>");
				
			}, function (error) {
				if (error.status == 400)
					networkActivityMessage("Per favore specifica tutti i dati richiesti.");		
				else if (error.status == 403)
					networkActivityMessage("Troppe richieste di creazione consecutive dallo stesso indirizzo ip.");
				else if (error.status == 409)
					networkActivityMessage("Email già in uso.");
				else if (error.status == 502)
					networkActivityMessage("Errore di comunicazione con il server.");
				else
					networkActivityMessage("Errore nell'invio dell'email.");
			});
		});
	}

	user_account_data = user;
	
	doUpdateAccountImage();
	doUpdateCharacters();
}

function setLoggedOut()
{
	user_account_data = null;
	$('.account-name').text('straniero');
	$('#account-email').text('nessuna');
}



function doAccountLogout(done)
{
	// Logout from Facebook
	if (facebookToken)
	{
		$('#accountimg').hide().attr('src','');
		
		FB.logout(function (res) {
			facebookToken = null;
		});
	}

	accountLogout(function () {
		// Successful logout
		networkActivityMessage('');
		
		setLoggedOut();
		moveLoginPanel('account');
		
		if(done) done();
		
	}, function(error) {
		if (error.status == 502)
			networkActivityMessage("Errore di comunicazione con il server.");
		else
			networkActivityMessage('Errore di disconnessione.');
			
		setLoggedOut();
		moveLoginPanel('account');
		
		if(done) done();
	});
}


function doUpdateAccountImage()
{
	if (facebookToken)
	{
		FB.api('/me/picture', function(res) {
			if (res && !res.error) {
				$('#accountimg').attr('src', res.data.url);
			}
		});
	}
}

function doUpdateCharacters()
{
	var cl = $('#chars-list');
	
	getCharactersList(function (data) {
		networkActivityMessage('');
		cl.empty();
		
		enabled_chars_count = 0;
		if (data.length > 0)
		{
			$.each(data, function (index, value) {
				var imageUrl = images_path+'/pg_'+value.pgid+'.jpg';
				var portEl = '<button class="char-portrait'+(value.disab ? '' : ' enabled')+'" name="'+value.name+'"><img src="'+imageUrl+'"><div class="char-portrait-frame"><div class="char-portrait-name">'+value.name+'</div></button>'
				cl.append(portEl);
				
				if (!value.disab)
					enabled_chars_count++;
			});
			
			$('img', cl).on('load', function () {
				$(this).css('visibility','visible');
			});
			
			$(cl).contents('.char-portrait.enabled').click(function (el) {
				var name = $(this).attr('name');
				doCharacterLoginWithNameAndPassword(name,'');
			});
			
			$(cl).contents('.char-portrait.enabled').first().focus();
		}
		else
		{
			cl.append('<p>Non ci sono personaggi in questo account. Creane uno nuovo o associa un personaggio esistente.</p>');
		}
			
		updateChars = false;
		
	}, function (error) {
		cl.empty();
		
		if (error.status == 401)
		{
			networkActivityMessage("Richiesta da account non autenticato.");
		}
		else if (error.status == 502)
		{
			networkActivityMessage("Errore di comunicazione con il server.");
		}
		else
		{
			networkActivityMessage("Errore di ricezione della lista personaggi.");
		}
	});
}


function doChangePassword()
{
	var password = $('#changepass').val();

	changePassword(password, function() {
		
		networkActivityMessage("Password cambiata correttamente.");
		
	}, function (error) {
		
		if (error.status == 401)
		{
			networkActivityMessage("Richiesta da account non autenticato.");
		}
		else if (error.status == 502)
		{
			networkActivityMessage("Errore di comunicazione con il server.");
		}
		else
		{
			networkActivityMessage("Errore nel cambio della password.");
		}

	});
}

function doLocalAccountLogin()
{
	var email = $.trim($('#actemail').val());
	var pass = $.trim($('#actpass').val());

	var logindata = {
		email:email,
		password:pass
	};
	
	localAccountLogin(logindata, function(data) {
		setLoggedIn(data.user);
		moveLoginPanel('login');
	}, function (error) {
		if (error.status == 400)
		{
			networkActivityMessage("Per favore specifica tutti i dati richiesti.");
		}
		else if (error.status == 401)
		{
			networkActivityMessage("Email o password errati.");
		}
		else if (error.status == 502)
		{
			networkActivityMessage("Errore di comunicazione con il server.");
		}
		else
		{
			networkActivityMessage("Errore di accesso all'account.");
		}
	});
}

function doLocalAccountAutoLogin(done)
{
	getAccountProfile(function(data) {
		setLoggedIn(data.user);
		moveLoginPanel('login');
		
		if (done) done(true);
		
	}, function() {
		networkActivityMessage('');
		
		if (done) done(false);
	});
}



function doFacebookLogin(token, done)
{
	facebookAccountLogin(token, function(data) {
		
		setLoggedIn(data.user);
		moveLoginPanel('login');
		
		if (done) done(true);
		
	}, function (error) {
		if (error.status == 401)
		{
			networkActivityMessage("Problema nella creazione dell'account.");
		}
		else if (error.status == 502)
		{
			networkActivityMessage("Errore di comunicazione con il server.");
		}
		else
		{
			networkActivityMessage("Errore di accesso all'account.");
		}
			
		if (done) done(false);
	});
}


function doCharacterLogin()
{
	var name = $('#loginname').val();
	var pass = $('#loginpass').val();

	doCharacterLoginWithNameAndPassword(name, pass);
}

function doCharacterLoginWithNameAndPassword(name, pass)
{
	connectionInfo.mode = 'login';
	connectionInfo.loginName = name;
	connectionInfo.loginPass = pass
	
	networkActivityOn();
	networkActivityMessage("Connessione in corso...");
	updateChars = true;
	loginErrorClean();
	connectToServer();
}


function doLocalAccountCreate()
{
	var email = $('#newactemail').val();

	localAccountRequest(email, function(data) {
		networkActivityMessage('');	
		
		genericDialog("Email inviata!",
		"<p>Una email contenente un link di attivazione è stata inviata all'indirizzo da "+
		"te specificato. Controlla tra qualche minuto nella tua casella di posta in arrivo,"+
		"troverai l'email con le istruzioni per completare la creazione.<br>A presto!</p>");
		
		moveLoginPanel('account');
	}, function (error) {
		if (error.status == 400)
			networkActivityMessage("Per favore specifica tutti i dati richiesti.");		
		else if (error.status == 403)
			networkActivityMessage("Troppe richieste di creazione consecutive dallo stesso indirizzo ip.");
		else if (error.status == 409)
			networkActivityMessage("Email già in uso, forse hai un altro account?");
		else if (error.status == 502)
			networkActivityMessage("Errore di comunicazione con il server.");
		else
			networkActivityMessage("Errore nell'invio dell'email.");
	});
}


function doLocalAccountVerify()
{
	var name = $('#vfyname').val();
	var pass = $('#vfypass').val();

	localAccountVerify(verify_email, verify_token, name, pass, function(data) {
		networkActivityMessage('');
		
		genericDialog("Account creato!",
		"<p>Il tuo account è stato creato, da ora potrai connetterti usando " +
		"l'indirizzo email e la password da te specficati.</p><p>Buon divertimento!</p>");

		setLoggedIn(data.user);
		moveLoginPanel('login');
	}, function (error) {
		if (error.status == 400)
			networkActivityMessage("Per favore specifica tutti i dati richiesti.");		
		else if (error.status == 502)
			networkActivityMessage("Errore di comunicazione con il server.");
		else
			networkActivityMessage("Errore nella creazione dell'account.");
	});
}

function moveLoginPanel(new_panel, immediate)
{
/*
	if(new_panel != current_login_panel)
	{
		var width = $('#loginpanel .scrollingarea .stagepanel').first().outerWidth();
		var height = $('#loginpanel .scrollingarea .stagepanel').first().outerHeight();
		
		var pos = {
			// First row
			'used': {
				top: 0,
				left: 0
			},
			'account': {
				top: 0,
				left: -width
			},
			'newaccount': {
				top: 0,
				left: -width*2
			},

			// Second row
			'verify': {
				top: -height,
				left: 0
			},
			'login': {
				top: -height,
				left: -width
			},
			'profile': {
				top: -height,
				left: -width*2
			},

			// Third row
			'assocchar': {
				top: -height*2,
				left: -width
			}
		};
		
		var panel = $('#loginpanel .scrollingarea').stop();
		
		if (!initialized || immediate)
		{
			panel.css(pos[new_panel]);
			current_login_panel = new_panel;
		}
		else
		{
			panel.animate(pos[new_panel], {
				complete: function() {
					current_login_panel = new_panel;
				}
			});
		}
	}
*/
	if(new_panel != current_login_panel)
	{
		$("#" + current_login_panel + '-panel').hide();
		current_login_panel = new_panel;
		$("#" + current_login_panel + '-panel').show();
	}
}


function loginInit()
{
	/* Account */
	$('#actcrtnew').click(function () {
		moveLoginPanel('newaccount');
	});

	$('#actcntbtn').button();
	$('#local-account-form').validate({
		submitHandler: function(form) {
			try {
				doLocalAccountLogin();	
			} catch(err) {
				alert(err.message);
				location.reload();
			}
		}
	});
	
	
	/* New account */
	$('#actnewback').button().click(function () {
		moveLoginPanel('account');
	});

	$('#actnewbtn').button();
	$('#new-local-account-form').validate({
		debug:true,
		ignore:null,
		wrapper:'div',
		errorPlacement:function (error, el) {
			if (el.attr('type') == "checkbox")
				el = el.next();
			error.insertAfter(el);
		},
		submitHandler: function(form) {
			try {
				doLocalAccountCreate();
			} catch(err) {
				alert(err.message);
				location.reload();
			}
		}
	});
		
	/* Login */
	
	$('#accountimg').on('error', function() {
		$(this).hide();
	}).on('load', function() {
		$(this).show();
	});
	
	$('#associatebtn').button().click(function() {
		moveLoginPanel('assocchar')
	});
	$('#createnewpg').button().click(function() {
		switchLoginCreation(false);
	});

	$('#logout').button().click(function() {
		doAccountLogout();
	});

	$('#profile').button().click(function() {
		moveLoginPanel('profile');
	});


	/* Associate char */
	$('#associateback').button().click(function() {
		moveLoginPanel('login');
	});
	
	$('#connectbtn').button();
	$('#associate-character-form').validate({
		submitHandler: function(form) {
			try {
				doCharacterLogin();
			} catch(err) {
				alert(err.message);
				location.reload();
			}
		}
	});

	/* Verify account */
	$('#vfybtn').button();
	$('#local-account-verify-form').validate({
		debug:true,
		submitHandler: function(form) {
			try {
				doLocalAccountVerify();
			} catch(err) {
				alert(err.message);
				location.reload();
			}
		}
	});

	/* Profile */
	$('#profileback').button().click(function() {
		moveLoginPanel('login');
	});

	$('#changepwdbtn').button();
	$('#password-form').validate({
		debug:true,
		submitHandler: function(form) {
			try {
				doChangePassword();
			} catch(err) {
				alert(err.message);
				location.reload();
			}
		}
	});



	$('#logindialog').dialog({
		autoOpen:false,
		modal:true,
		closeOnEscape:false,
		dialogClass:'tg-dialog styledbuttons notitle noclose',
		draggable:false,
		resizable:false,
		width:830,
		height:600,
		open: function() {
			fadeOutLoginPortrait();
			
			
			// $.getJSON("/serverstat", updateServerStats);

			loginPortraitTimer = setInterval(fadeOutLoginPortrait, 8000);
			
			if(current_login_panel == 'login')
			{
				var chars = $('#chars-list').contents('.char-portrait.enabled');
				if (chars.length > 0)
					chars.first().focus();
				else
					$('#createnewpg').focus();
			}
		},
		close: function() {
			if(loginPortraitTimer)
				clearInterval(loginPortraitTimer);
		},
		destroy: function() {
			if(loginPortraitTimer)
				clearInterval(loginPortraitTimer);
		}
	});
}

function fadeOutLoginPortrait()
{
	var currentScreen = currentPortrait % 2;

	currentPortrait = (currentPortrait+1) % 6;

	var nextScreen = currentPortrait % 2;

	$('#logindialog .loginportrait.sc'+nextScreen).attr('src', login_heroes_assets[currentPortrait]);
	$('#logindialog .loginportrait.sc'+currentScreen).fadeOut('slow', fadeInLoginPortrait);
}

function fadeInLoginPortrait()
{
	var currentScreen = currentPortrait % 2;
	$('#logindialog .loginportrait.sc'+currentScreen).fadeIn('slow');
}

/* *****************************************************************************
 * CREATION
 */

var current_creation_panel_num = 0;
var current_race_panel_num = 0;
var attr_changing = false;

var races = {};
var ethnicities = {};
var religions = {};
var cultures = {};
var locations = {};
var ethn_to_name = {};

var creation_data = {
	invitation:null,
	race: null,
	sex: null,
	race_code: null,
	stats: {
		strength:0,
		constitution:0,
		size:0,
		dexterity:0,
		speed:0,
		empathy:0,
		intelligence:0,
		willpower:0
	},
	culture:null,
	religion:null,
	start:null,
	name:null,
	password:null,
	password2:null
};

var attr_help_url = {
	"help":"<%= url_hash('data/attributes/help.html') %>",
	"strength":"<%= url_hash('data/attributes/strength.html') %>",
	"constitution":"<%= url_hash('data/attributes/constitution.html') %>",
	"size":"<%= url_hash('data/attributes/size.html') %>",
	"dexterity":"<%= url_hash('data/attributes/dexterity.html') %>",
	"speed":"<%= url_hash('data/attributes/speed.html') %>",
	"empathy":"<%= url_hash('data/attributes/empathy.html') %>",
	"intelligence":"<%= url_hash('data/attributes/intelligence.html') %>",
	"willpower":"<%= url_hash('data/attributes/willpower.html') %>"
};

/*
 * Prc Inc Cst
 * -30 -10 -40
 * -25 -10 -30
 * -20  -5 -20
 * -15  -5 -15
 * -10  -5 -10
 *  -5  -5  -5
 *   0   0   0
 *   5  +5   5
 *  10  +5  10
 *  15  +5  15
 *  20 +10  25
 *  25 +15  40
 *  30 +20  60
 */
 
function statCost(val)
{
	var cost = [ -40, -30, -20, -15, -10, -5, 0, 5, 10, 15, 25, 40, 60 ];
	var idx = (30 + val) / 5;

	return cost[idx];
}

function calcUsedPoints(stats)
{
	var sum = 0;
	
	$.each(stats, function(n, v) {
		sum -= statCost(v);
	});
	
	return sum;
}


function creationInit()
{
	$.getJSON("<%= url_hash('data/races/data.json') %>", function(r) {
		races = r;
	});

	$.getJSON("<%= url_hash('data/ethnicity/data.json') %>", function(e) {
		ethnicities = e;
	});

	$.getJSON("<%= url_hash('data/religions/data.json') %>", function(r) {
		religions = r;
	});

	$.getJSON("<%= url_hash('data/cultures/data.json') %>", function(c) {
		cultures = c;
	});

	$.getJSON("<%= url_hash('data/locations/data.json') %>", function(l) {
		locations = l;
	});


	$('#creationnext').button().click(nextCreationPanel);
	$('#creationprev').button().click(prevCreationPanel);
	
	updateCreationButtons(0);
	
	$('#createdialog .port').button().empty().click(function (e) {
		$('#createdialog .port').removeClass('selected');
		$(this).addClass('selected');
		switchRaceSelection($(this).attr('race'));
	});

	$('#invitation').keyup(function() {
		creation_data.invitation = $(this).val();

		updateSteps(creation_data);
		updateCreationButtons(0);
	});

	$('#name').keyup(function() {
		creation_data.name = $(this).val();

		updateSteps(creation_data);
		updateCreationButtons(6);
	});

	$('#password').keyup(function() {
		creation_data.password = $(this).val();

		updateSteps(creation_data);
		updateCreationButtons(6);
	});

	$('#password2').keyup(function() {
		creation_data.password2 = $(this).val();

		updateSteps(creation_data);
		updateCreationButtons(6);
	});

	$('#createdialog .tg-slider').slider({
		min:-30,
		max:30,
		value:0,
		step:5,
		slide: function( event, ui ) {
			var attr = $(this).closest('.attr-div').attr('attr-name');

			creation_data.stats[attr] = ui.value;
			
			$('#attr-points').text(calcUsedPoints(creation_data.stats));
			
			updateSteps(creation_data);
			updateCreationButtons(current_creation_panel_num);
		}
	})
	
	$('#createdialog .attr-div').hover(function(e) {
		var attr = $(this).attr('attr-name');
		
		if(attr && attr_help_url[attr])
			$('#attr-desc').load(attr_help_url[attr]);
	}, function(e) {
		$('#attr-desc').load(attr_help_url["help"]);
	});
	
	$('#race-desc').load(race_help_url["help"]);
	$('#attr-desc').load(attr_help_url["help"]);

	var masks = {
		'int':     /[\d]/,
		'float':     /[\d\.]/,
		'money':    /[\d\.\s,]/,
		'num':      /[\d\-\.]/,
		'hex':      /[0-9a-f]/i,
		'email':    /[a-z0-9_\.\-@]/i,
		'alpha':    /[a-z]/i,
		'alphanum': /[a-z0-9]/i,
		'alphanumlower':/[a-z0-9]/,
		'alphaspace':    /[a-z ]/i,
		'alphanumspace': /[a-z0-9 ]/i,
		'alphanumspacelower':/[a-z0-9 ]/
	};

	$('input[data-mask]').each(function(idx) {
		var mask = $(this).data('mask');
		var regex = (masks[mask]) ? masks[mask] : mask;

		$(this).filter_input({ regex: regex, live: true }); 
	});

	$('#createdialog .scrollingarea > .stagepanel').first().css('visibility','visible');

	$('#createdialog').dialog({
		autoOpen:false,
		modal:true,
		closeOnEscape:false,
		dialogClass:'tg-dialog styledbuttons notitle noclose',
		draggable:false,
		resizable:false,
		width:900,
		height:650
	});
}

function verifyAttrs(cfg)
{
	return calcUsedPoints(creation_data.stats) >= 0;
}



var race_help_url = {
	"help":"<%= url_hash('data/races/help.html') %>",
	"human":"<%= url_hash('data/races/human.html') %>",
	"halfling":"<%= url_hash('data/races/halfling.html') %>",
	"dwarf":"<%= url_hash('data/races/dwarf.html') %>",
	"elf":"<%= url_hash('data/races/elf.html') %>",
	"goblin":"<%= url_hash('data/races/goblin.html') %>",
	"orc":"<%= url_hash('data/races/orc.html') %>"
};

function switchRaceSelection(newrace)
{
	var current_race;
	
	if (!creation_data.race || !creation_data.sex)
		current_race = 'race-none';
	else
		current_race = creation_data.race+'_'+creation_data.sex;
	
	if (newrace != current_race)
	{
		$('#createdialog .port').button('disable');
		
		var old_race_panel_num = current_race_panel_num;
		
		current_race_panel_num = (current_race_panel_num+1) % 2;
		
		$('#race-panel'+current_race_panel_num).addClass(newrace);

		var race_help = newrace.replace(/_[mf]/,'');
		if (!race_help_url[race_help])
			race_help = "help";
			
		$('#race-desc').load(race_help_url[race_help]);
			
		$('#scrolling-race').animate(
			{
				top: -current_race_panel_num * $('#scrolling-race .race-panel').first().outerHeight()
			},{
				complete: function() {
					$('#race-panel'+old_race_panel_num).removeClass(current_race);
					$('#race-panel'+current_race_panel_num).addClass(newrace);
					
					$('#createdialog .stagepanel > .race-panel').removeClass(current_race).addClass(newrace);

					var new_race_name = newrace.split('_')[0];
					
					if(creation_data.race != new_race_name)
					{
						creation_data.race = newrace.split('_')[0];
						creation_data.race_code = null;
						creation_data.culture = null;
						creation_data.religion = null;
						creation_data.start = null;
					}
					
					creation_data.sex = newrace.split('_')[1];
					
					updateSteps(creation_data);
					updateCreationButtons(current_creation_panel_num);
					
					$('#createdialog .port').button('enable');
				}
			}
		);
	}
}


function resetCreationData()
{
	switchCreationPanel(0);
	
	var creation_data = {
		invitation:null,
		race: null,
		sex: null,
		race_code: null,
		stats: {
			strength:0,
			constitution:0,
			size:0,
			dexterity:0,
			speed:0,
			empathy:0,
			intelligence:0,
			willpower:0
		},
		culture:null,
		religion:null,
		start:null,
		name:null,
		password:null,
		password2:null
	};
	
	$('#createdialog input[type=text]').val('');
	$('#createdialog input[type=password]').val('');
	
	$('#invitationok .okko').removeClass('ok');
	
	$('#createdialog .stagepanel .race-panel').attr('class', "instagepanel race-panel small-race race-none");
	$('#createdialog .port').removeClass('selected');
	$('#race-desc').load(race_help_url['help']);

	$('#createdialog .tg-slider').slider('value', 0);
	$('#attr-points').text('0');
	$('#attr-desc').load(attr_help_url["help"]);
}


function createNewChar(cd)
{
	connectionInfo.mode = 'create';
	connectionInfo.data = cd;
	connectionInfo.data.email = user_account_data.email;
	
	networkActivityOn();
	networkActivityMessage("Connessione in corso...");
	loginErrorClean();
	connectToServer();
}

function nextCreationPanel()
{
	if (current_creation_panel_num == stepVerifiers.length-1)
	{
		createNewChar(creation_data);
		return;
	}
	
	if (verifyStep(current_creation_panel_num, creation_data))
		switchCreationPanel(current_creation_panel_num+1);
}

function prevCreationPanel()
{
	if (current_creation_panel_num == 0)
	{
		switchLoginCreation(true);
		return
	}
	
	switchCreationPanel(current_creation_panel_num-1);
}


function switchCreationPanel(newpan)
{
	if(newpan != current_creation_panel_num)
	{
		updateCreationPanel(newpan);

		var panels = $('#createdialog .scrollingarea > .stagepanel');
		$(panels[newpan]).css('visibility','visible');

		$('#createdialog .scrollingarea').animate({
			left: -newpan * $('#createdialog .scrollingarea .stagepanel').first().outerWidth() 
		}, {
			complete: function() {
				$(panels[current_creation_panel_num]).css('visibility','hidden');

				current_creation_panel_num = newpan;
				
				updateSteps(creation_data);
				updateCreationButtons(newpan);
			}
		});
	}
}

function updateCreationButtons(pan)
{
	if(pan == 0)
	{
		$('#creationprev span').text("Torna all'accesso");
	}
	else
	{
		$('#creationprev span').text("Indietro");
	}

	if(pan == stepVerifiers.length-1)
	{
		$('#creationnext span').text("Crea!");
	}
	else
	{
		$('#creationnext span').text("Avanti");
	}

	$('#creationnext').button({ disabled: !verifyStep(pan, creation_data) })
}

function switchLoginCreation(login)
{
	if(login)
	{
		connectionInfo.mode = 'login';
		closeDialog('#createdialog');
		openDialog('#logindialog');
	}
	else
	{
		connectionInfo.mode = 'create';
		closeDialog('#logindialog');
		openDialog('#createdialog');
		$('#createdialog .content').get(0).scrollLeft=0;
	}

	networkActivityMessage('');
}



function updateEthnics()
{
	var dest = $('#createdialog .ethnic-panel');
	
	dest.empty();
	
	var validcode = validInvitationCode(creation_data.invitation);
	
	$.each(ethnicities[creation_data.race], function(idx, val) {
		var race = val["code"];
		var help_url = val["help_url"];
		var name = val["name"];
		var limited = val["limited"];
		
		dest.append('<input type="radio" name="ethnic" class="tg-button" value="'+race+'" id="'+race+'"'+(limited && !validcode ? " disabled" : "")+(creation_data.race_code == race ? " checked" : "")+'/><label for="'+race+'" help="'+help_url+'"><span></span>'+name+'</label><br>');
	});
	
	if(creation_data.race_code == null)
		$('#ethn-desc').load("<%= url_hash('data/ethnicity/help.html') %>");
	
	$("label", dest).hover(function() {
		var help_url = $(this).attr('help');
		$('#ethn-desc').load(help_url);
	}, function() {
		var sel = $("input:radio[name=ethnic]:checked + label", dest);
		if(sel && sel.length)
		{
			var help_url = $(sel).attr('help');
			$('#ethn-desc').load(help_url);
		}
		else
			$('#ethn-desc').load("<%= url_hash('data/ethnicity/help.html') %>");
	});
	
	$("input:radio[name=ethnic]", dest).click(function() {
		creation_data.race_code = $(this).val();
		
		updateSteps(creation_data);
		updateCreationButtons(current_creation_panel_num);
	});
}


function updateCultures()
{
	var dest = $('#createdialog .cult-panel');
	
	dest.empty();
	
	$.each(cultures[creation_data.race_code], function(idx, val) {
		var name = val["name"];
		var help_url = val["help_url"];
		var value = name;
		
		dest.append('<input type="radio" name="cult" class="tg-button" value="'+name+'" id="cult'+idx+'"'+(creation_data.culture == value ? " checked" : "")+'/><label for="cult'+idx+'" help="'+help_url+'"><span></span>'+capFirstLetter(name)+'</label><br>');
	});
	
	if(creation_data.culture == null)
		$('#cult-desc').load("<%= url_hash('data/cultures/help.html') %>");

	
	$("label", dest).hover(function() {
		var help_url = $(this).attr('help');
		$('#cult-desc').load(help_url);
	}, function() {
		var sel = $("input:radio[name=cult]:checked + label", dest);
		if(sel && sel.length)
		{
			var help_url = $(sel).attr('help');
			$('#cult-desc').load(help_url);
		}
		else
			$('#cult-desc').load("<%= url_hash('data/cultures/help.html') %>");
	});
	
	$("input:radio[name=cult]", dest).click(function() {
		creation_data.culture = $(this).val();
		
		updateSteps(creation_data);
		updateCreationButtons(current_creation_panel_num);
	});
}


function updateReligion()
{
	var dest = $('#createdialog .relig-panel');
	
	dest.empty();
	
	$.each(religions[creation_data.race_code], function(idx, val) {
		var name = val["name"];
		var help_url = val["help_url"];
		var value = name;
		
		dest.append('<input type="radio" name="relig" class="tg-button" value="'+name+'" id="relig'+idx+'"'+(creation_data.religion == value ? " checked" : "")+'/><label for="relig'+idx+'" help="'+help_url+'"><span></span>'+capFirstLetter(name)+'</label><br>');
	});

	if(creation_data.religion == null)
		$('#cult-desc').load("<%= url_hash('data/religions/help.html') %>");

	$("label", dest).hover(function() {
		var help_url = $(this).attr('help');
		$('#relig-desc').load(help_url);
	}, function() {
		var sel = $("input:radio[name=relig]:checked + label", dest);
		if(sel && sel.length)
		{
			var help_url = $(sel).attr('help');
			$('#relig-desc').load(help_url);
		}
		else
			$('#relig-desc').load("<%= url_hash('data/religions/help.html') %>");
	});
	
	$("input:radio[name=relig]", dest).click(function() {
		creation_data.religion = $(this).val();
		
		updateSteps(creation_data);
		updateCreationButtons(current_creation_panel_num);
	});
}


function updateStartPos()
{
	var dest = $('#createdialog .map-image');
	
	dest.empty();
	
	$.each(locations[creation_data.race_code], function(idx, val) {
		var name = val["name"];
		var help_url = val["help_url"];
		var coords = val["coords"];
		
		dest.append('<input type="radio" name="start" class="tg-button" value="'+name+'" id="start'+idx+'"'+(creation_data.start == name ? " checked" : "")+'/><label for="start'+idx+'" style="position:absolute;top:'+coords.y+'px;left:'+coords.x+'px;" help="'+help_url+'"><span></span></label>');
	});

	if(creation_data.start == null)
		$('#map-desc').load("<%= url_hash('data/locations/help.html') %>");

	$("label", dest).hover(function() {
		var help_url = $(this).attr('help');
		$('#map-desc').load(help_url);
	}, function() {
		var sel = $("input:radio[name=start]:checked + label", dest);
		if(sel && sel.length)
		{
			var help_url = $(sel).attr('help');
			$('#map-desc').load(help_url);
		}
		else
			$('#map-desc').load("<%= url_hash('data/locations/help.html') %>");
	});
	
	$("input:radio[name=start]", dest).click(function() {
		creation_data.start = $(this).val();
		
		updateSteps(creation_data);
		updateCreationButtons(current_creation_panel_num);
	});
}



var panelUpdater = [
	null,
	null,
	null,
	updateEthnics,
	updateCultures,
	updateStartPos,
	null
];

function updateCreationPanel(pan)
{
	if(panelUpdater[pan] != null)
		panelUpdater[pan]();
}


function validInvitationCode(code)
{
	return (code != null && code != '' && code.length == 12);
}

function verifyIntro(cfg)
{
	var invok = (cfg.invitation == null || cfg.invitation == '' || cfg.invitation.length == 12);
	
	$('#invitationok').toggleClass('ok', invok);
	
	return invok;
}

function verifyRace(cfg)
{
	return cfg.race != null && cfg.sex != null;
}

function verifyEthnics(cfg)
{
	return cfg.race_code != null;
}

function verifyCultures(cfg)
{
	return cfg.culture != null;
}

function verifyReligion(cfg)
{
	return cfg.religion != null;
}

function verifyMap(cfg)
{
	return cfg.start != null;
}

function verifyAccess(cfg)
{
	var nameok = verifyCharName(cfg.name);
	var p1ok = verifyPasswd(cfg.password);
	var p2ok = p1ok && verifyPasswd(cfg.password2) && cfg.password == cfg.password2;
	
	$('#nameok').toggleClass('ok', nameok);
	$('#pwdok').toggleClass('ok', p1ok);
	$('#pwd2ok').toggleClass('ok', p2ok);
	
	return nameok && p1ok && p2ok;
}

function verifyCharName(n)
{
	return n != null && n.length > 3 && n.length < 16 && /^[a-z]+$/i.test(n);
}

function verifyEmail(e)
{
	return e != null && e.length > 0 && e.length <= 40 && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(e);
}

function verifyPasswd(p)
{
	return p != null && p.length >= 5 && p.length <= 10 && /^[a-z0-9]+$/i.test(p);
}

function verifyBothPasswd(p1, p2)
{
	return verifyPasswd(p1) && verifyPasswd(p2) && p1 == p2;
}



var stepVerifiers = [
	verifyIntro,
	verifyRace,
	verifyAttrs,
	verifyEthnics,
	verifyCultures,
//	verifyReligion,
	verifyMap,
	verifyAccess
];

function verifyStep(step, cfg)
{
	return stepVerifiers[step](cfg);
}

function updateSteps(cfg)
{
	$.each(stepVerifiers, function(i, c) {
		$('#stage'+i).toggleClass("checked", current_creation_panel_num >= i && c(cfg)).toggleClass("selected", current_creation_panel_num == i);
	});
}


/* *****************************************************************************
 * CONFIG
 */


function configInit()
{
	/* Audio tab */
	$('#musicvolumeslider').slider({
		min:0,
		max:100,
		value:client_options.musicVolume,
		slide: function(e, ui) {
			$('#music').get(0).volume = ui.value/100;
			client_options.musicVolume = ui.value;
			$('#musicvolume').text(ui.value);
		},
		change: function() {
			Save('options', client_options);
		}
	});
	$('#musicvolume').text(client_options.musicVolume);

	$('#soundvolumeslider').slider({
		min:0,
		max:100,
		value:client_options.soundVolume,
		slide: function(e, ui) {
			$('#sound').get(0).volume = ui.value/100;
			client_options.soundVolume = ui.value;
			$('#soundvolume').text(ui.value);
		},
		change: function() {
			Save('options', client_options);
		}
	});
	$('#soundvolume').text(client_options.soundVolume);

	/* Shortcuts tab */
	$("#tab-shortcuts").empty().append("<table />");

	$("#tab-shortcuts table").append('<colgroup><col class="sc-col-num"/><col class="sc-col-abbr"/><col class="sc-col-cmd"/></colgroup>');
	$("#tab-shortcuts table").append('<thead><tr><th>Num.</th><th>Abbreviazione</th><th>Comando</th></tr></thead>');

	for(var scidx=0; scidx<50;++scidx) {
		var alias='';
		var cmd='';

		if(client_options.shortcuts[scidx]) {
			alias = client_options.shortcuts[scidx].alias ? client_options.shortcuts[scidx].alias : '';
			cmd = client_options.shortcuts[scidx].cmd ? client_options.shortcuts[scidx].cmd : '';
		}
		$("#tab-shortcuts table").append('<tr><td>'+scidx+'</td><td><input type="text" value="'+alias+'" id="sc-a-'+scidx+'"></td><td><input type="text" value="'+cmd+'" id="sc-c-'+scidx+'"></td></tr>');
	}

	$('#tab-shortcuts input').blur(function(e) {
		var idx=e.target.id.substr(5);
		var alias = $('#sc-a-'+idx).val();
		var value = $('#sc-c-'+idx).val();

		alias = $.trim(alias);
		value = $.trim(value);

		if(value) {
			client_options.shortcuts[idx] = {
				alias:alias,
				cmd:value
			};
		} else {
			delete client_options.shortcuts[idx];
		}

		updateShortcutsMap();
		Save('options', client_options);
	});

	updateShortcutsMap();


	/* Video tab */
	
	$('#trimlinesslider').slider({
		min:100,
		max:10000,
		step:500,
		value: client_options.output.trimLines,
		change: function(e, ui) {
			client_options.output.trimLines = ui.value;
			Save('options', client_options);
		}
	});
	
	if(client_options.equipAsList)
		$("#tab-video #eqaslist").prop('checked', true);

	$("#tab-video #eqaslist").click(function() {
		client_options.equipAsList = $(this).prop('checked');
		Save('options', client_options);
		equipInit(client_options.equipAsList);
	});
	
	if(client_options.details.size)
		$("#tab-video  input:radio[name=deticolistsiz]").filter('[value='+client_options.details.size+']').attr('checked',true);

	$("#tab-video  input:radio[name=deticolistsiz]").click(function() {
		var val = $(this).val();
		client_options.details['size'] = val;
		
		$('#detailsdialog table.list.container').removeClass('icons_n icons_m icons_s').addClass(val);
		$('#invdialog table.list.container').removeClass('icons_n icons_m icons_s').addClass(val);
		$('#equipdialog table.list.container').removeClass('icons_n icons_m icons_s').addClass(val);
		
		Save('options', client_options);
	});


	if(client_options.details.compact)
		$("#tab-video  #detlistsize").prop('checked', true);

	$("#tab-video #detlistsize").click(function() {
		var en = $(this).prop('checked');
		client_options.details['compact'] = en;

		$('#detailsdialog table.list.container').toggleClass('compact', en);
		$('#invdialog table.list.container').toggleClass('compact', en);
		$('#equipdialog table.list.container').toggleClass('compact', en);

		Save('options', client_options);
	});

	if(client_options.details.size)
		$("#tab-video  input:radio[name=mapsiz]").filter('[value='+client_options.map.size+']').attr('checked',true);

	$("#tab-video  input:radio[name=mapsiz]").click(function() {
		var val = $(this).val();
		client_options.map.size = val;

		mapResize(val);
		
		Save('options', client_options);
	});

	if(client_options.map.sight)
	{
		$("#tab-video #sight").prop('checked', true);
		$('#mapsight').show();
	}
	
	$("#tab-video #sight").click(function() {
		client_options.map.sight = $(this).prop('checked');
		Save('options', client_options);
		$('#mapsight').toggle(client_options.map.sight);
	});

	if(client_options.textOnTop)
		$("#tab-video #topdowntxt").prop('checked', true);

	$("#tab-video #topdowntxt").click(function() {
		client_options.textOnTop = $(this).prop('checked');
		Save('options', client_options);
		$('#textdialog').toggleClass('topdown', client_options.textOnTop);
	});

	if(client_options.buttonsOnTop)
		$("#tab-video #topdownbbar").prop('checked', true);

	$("#tab-video #topdownbbar").click(function() {
		client_options.buttonsOnTop = $(this).prop('checked');
		Save('options', client_options);
		$('body').toggleClass('topdown', client_options.buttonsOnTop);
	});

	/* Game tab */

	if(client_options.log.enabled)
		$("#tab-game #logenabled").prop('checked', true);

	$("#tab-game #logenabled").click(function() {
		client_options.log['enabled'] = $(this).prop('checked');
		Save('options', client_options);
	});

	if(client_options.log.clean)
		$("#tab-game #logclean").prop('checked', true);

	$("#tab-game #logclean").click(function() {
		client_options.log['clean'] = $(this).prop('checked');
		Save('options', client_options);
	});

	if(client_options.log.save)
		$("#tab-game #logsave").prop('checked', true);

	$("#tab-game #logsave").click(function() {
		client_options.log['save'] = $(this).prop('checked');
		Save('options', client_options);
	});


	/* Dialog */

	$('#configdialog').tabs();

	$('#configdialog').dialog({
		autoOpen:false,
		title: addBannerStyle("Configurazione"),
		width: 800,
		minWidth:450,
		height: 600,
		minHeight:400,
		dialogClass:'tg-dialog styledbuttons parch',
		closeText: 'Chiudi'
	});
}


/* *****************************************************************************
 * OUTPUT
 */

function addHealthMoveInfo()
{
	return '<div class="title-add healthcont">\
				<div class="meter2 withtxtbox">\
					<div class="barcont"><span class="healthbar red up" style="width:0%"></span><span class="movebar green low" style="width:0%"></span></div>\
					<div class="metertxt">Salute: <span class="healthprc"></span>% Movimento: <span class="moveprc"></span>%</div>\
				</div>\
			</div>';
}

function addDropPanel(id, cont)
{
	return '<div class="droppanel" id="'+id+'">'+cont+'</div>'
}

function addFilterButton()
{
	var f = client_options.combatFilter;
	
	applyFilter(f);
	
	return '<div id="combatfilter" class="combat-filter f'+f+'"></div>';
}

function enemyInfo()
{
	return '<div id="enemyicon" class="iconimg interact pers"></div>'+prcBicolorBar(0, 'red', 'enemyh', 0, 'green', 'enemym');
}



function outputInit()
{
	setOutputSize(client_options.output.textSize);
	
	$('#textdialog').toggleClass('topdown', client_options.textOnTop);
	
	if(!openDialog('#textdialog'))
	{
		var pos = getWindowPosition('textdialog');
		var size = getWindowSize('textdialog');
		var w,h;

		if(size)
		{
			w = size[0];
			h = size[1];
		} else {
			w = ($(desktop).width()-360)*0.6;
			h = $(desktop).height();
		}

		if(pos == null)
			pos = {my:"left top",at:"left top",of:desktop};

		$('#textdialog').dialog({
			closeOnEscape:false,
			title: addBannerStyle('The Gate') + addFilterButton() + addHealthMoveInfo() + addDropPanel('combatpanel', enemyInfo()),
			dialogClass:'tg-dialog parch',
			width: w,
			height: h,
			minWidth:550,
			minHeight:250,
			resize:"auto",
			position:pos,
			draggable:true,
			resizable:true,
			dragStop: saveWindowData,
			resizeStop:saveWindowData,
			closeText: 'Chiudi'
		});
		
		$('#combatfilter').button().click(function() {
			var currentFilter = client_options.combatFilter;
			var nextFilter = (currentFilter+1) % combat_filters.length;
			
			$(this).addClass('f'+nextFilter).removeClass('f'+currentFilter);

			applyFilter(nextFilter);
			
			client_options.combatFilter = nextFilter;
			Save('options', client_options);
		});
	}
}


function applyFilter(f)
{
	if(f >= 0 && f < combat_filters.length) {
		filter_in = combat_filters[f].filter_in.join(',');
		filter_out = combat_filters[f].filter_out.join(',');

		$(filter_in, '#output').show();
		$(filter_out, '#output').hide();

		if(autoscroll_enabled)
			$('#output').get(0).scrollTop = 10000000;
	}
}

function filterMessages(txt)
{
	$(filter_out, txt).hide();
}

function showOutput(text)
{
	var app = $(text);

	addDragAndDrop(app);
	makeExpandable(app);
	filterMessages(app);
	
	$('#output').append(app);

	if(autoscroll_enabled)
	{
		if (client_options.output.trimLines < 10000)
			$('#output').contents().slice(0,-client_options.output.trimLines).remove();

		$('#output').get(0).scrollTop = 10000000;
	}
}

function clearOutput()
{
	$('#output').empty();
}


/* *****************************************************************************
 * DETAILS
 */

function detailsResize(evt, obj)
{
	var inner = $('.tg-dialog-inner', this);
	var w = inner.width();

	$('.detailsimage-cont', this).toggleClass('floatright', w > 320);

	if(evt && obj)
		saveWindowData(evt, obj);
}

function addExpandedGrp(mrn)
{
	var minval = exp_grp_list[mrn] = $.now();
	var minkey;

	var keys = Object.keys(exp_grp_list);
	if(keys.length > max_exp_grp)
	{
		for(var k in keys) {
			var val = exp_grp_list[k];
			if(val < minval)
			{
				minkey = k;
				minval = val;
			}
		}
		
		delete exp_grp_list[minkey];
	}
}

var pos_to_order = [
	{ pos:0, name: "" },
	18,		// Finger R
	19,		// Finger L
	5,		// Neck
	8,		// Body
	1,		// Head
	23,		// Legs
	24,		// Feet
	15,		// Hands
	12,		// Arms
	9,		// About
	22,		// Waist
	13,		// Wrist R
	14,		// Wrist L
	160,	// Hand R
	170,	// Hand L
	10,		// Back
	2,		// Ear R
	3,		// Ear L
	4,		// Eyes
	20,		// Sheath
	21,		// Belt
	11,		// Back
	6,		// Shoulder R
	7,		// Shoulder L
	25		// Tied
];


function renderDetailsList(cont_type, cont_num, cont, type, style)
{
	var res = '';
	
	if(cont.list) {
		var txt='';

		if (cont_type == 'pers' || cont_type == 'equip')
		{
			cont.list.sort(function(a,b) {
				var eq_pos_a = $.isArray(a.eq) ? pos_to_order[a.eq[0]] : 0;
				var eq_pos_b = $.isArray(b.eq) ? pos_to_order[b.eq[0]] : 0;
				
				return eq_pos_a - eq_pos_b;
			});
		}
		
		for(var n=0; n < cont.list.length; n++)
		{
			var l = cont.list[n];
			var is_group = (l.mrn && l.mrn.length) > 1;
			var opened = (l.mrn && exp_grp_list[l.mrn[l.mrn.length-1]]);
			var tradd = '', tdadd = '';
			
			if(is_group)
			{
				tradd = ' class="grpcoll" mrn='+l.mrn[l.mrn.length-1];
				if(opened)
					tradd += ' style="display:none"';
				
				tdadd += '<div class="expicon"></div>';
			}
			
			txt += '<tr'+tradd+'><td>'+tdadd+'</td><td><div>'+renderIcon(l.icon, l.mrn ? l.mrn[0] : null, cont_type, l.cntnum, null, 'interact '+type)+'</div></td><td>'+decoratedDescription(l.condprc, l.mvprc, l.wgt, l.sz ? l.sz : 1, (l.eq ? '<b>'+equip_positions_by_num[l.eq[0]] + '</b>: ' : '')+l.desc)+'</td></tr>';

			if(is_group)
			{
				txt += '<tbody class="grpexp"';
				
				if(!opened)
					txt += ' style="display:none"';
					
				txt += '>'
				for(var m=0; m < l.mrn.length; m++)
					txt += '<tr><td>'+(m == 0 ? '<div class="collicon"></div>':'')+'</td><td><div>'+renderIcon(l.icon, l.mrn[m], cont_type, l.cntnum, null, 'interact '+type)+'</div></td><td>'+decoratedDescription(l.condprc, l.mvprc, l.wgt, 1, l.desc)+'</td></tr>';
				if (l.sz && l.sz > l.mrn.length)
					txt += '<tr><td></td><td><div>'+renderIcon(l.icon, null, cont_type, l.cntnum, null, /* 'interact '+type */ null)+'</div></td><td>'+decoratedDescription(l.condprc, l.mvprc, l.wgt, l.sz - l.mrn.length, l.desc)+'</td></tr>';				 
				txt += '</tbody>';
			}
		}
		
		if(cont.title && (txt.length > 0 || cont.show === true))
		{
			res += '<p>'+cont.title;
			if(txt.length == 0)
				res += '<br>Niente.';
			res += '</p>';
		}

		if(txt.length > 0)
		{
			res += '<table class="list container'+(style ? ' '+style : '')+(client_options.details.size ? ' ' + client_options.details.size : '')+(client_options.details.compact ? ' compact' : '')+'" cont-type="'+cont_type+'"'+(cont_num ? ' mrn="'+cont_num+'"': '')+'>'+txt+'</table>';
		}
	}

	return res;
}


function renderDetailsInner(info, type, inDialog)
{
	var textarea = '';
	
	if(info.action)
		textarea += '<p>'+info.action+'</p>';

	/* Print description */
	if(info.desc) {
		if(info.desc.base) {
			if(type == 'room')
				last_room_desc = formatText(info.desc.base);
			textarea += formatText(info.desc.base);
		} else if(info.desc.repeatlast && last_room_desc)
			textarea += last_room_desc;

		if(info.desc.details)
			textarea += formatText(info.desc.details, 'yellow');

		if(info.desc.equip)
			textarea += formatText(info.desc.equip, 'green');
	}

	if(inDialog)
	{
		/* Print person list */
		if(info.perscont)
			textarea += renderDetailsList(type, info.num, info.perscont, 'pers', 'lt-green');

		/* Print objects list */
		if(info.objcont)
			textarea += renderDetailsList(type, info.num, info.objcont, 'obj', 'yellow');
	} else {
		/* Print objects list */
		if(info.objcont)
			textarea += renderDetailsList(type, info.num, info.objcont, 'obj', 'yellow');

		/* Print person list */
		if(info.perscont)
			textarea += renderDetailsList(type, info.num, info.perscont, 'pers', 'lt-green');
	}
	
	/* Print equipment list */
	if(info.eqcont)
		textarea += renderDetailsList(type, info.num, info.eqcont, 'obj');

	/* Print where info */
	if(info.where)
		textarea += '<div>'+renderIconWithBackBorder(info.where.icon, info.where.num, null, null, null, 'interact where')+'<span class="desc">Si trova '+info.where.title+'.</span></div>';

	
	return textarea;
}

function makeExpandable(details)
{
	$('.grpcoll td:first-child', details).click(function() {
		var colgrp = $(this).closest('.grpcoll');
		var expgrp = colgrp.closest('tbody').next('tbody');
		
		colgrp.hide();
		expgrp.show();
		addExpandedGrp(colgrp.attr('mrn'));
	});
	$('.grpexp td:first-child', details).click(function() {
		var expgrp = $(this).closest('tbody');
		var colgrp = expgrp.prev('tbody').find('.grpcoll');
		
		expgrp.hide();
		colgrp.show();
		delete exp_grp_list[colgrp.attr('mrn')];
		
	});
}

var dirBgPos =
{
	"nord":"0px -64px",
	"nordest":"0 -288px",
	"est":"0px -160px",
	"sudest":"0 -256px",
	"sud":"0px -128px",
	"sudovest":"0 -224px",
	"ovest":"0px -96px",
	"nordovest":"0 -192px",
	"alto":"0",
	"basso":"0"
}

function renderDetailsDialog(info, type)
{
	var res = '';
	var dialog = $('#detailsdialog');
	var cont = $('#details-'+type, dialog);
	var icon = $('#detailsicon-'+type, dialog);

	var wtab = ['room','pers','obj','dir'].indexOf(type);
	var ctab = dialog.tabs('option','active');

	/* Set tab icon */
	var tpos;
	if(type == 'dir')
		tpos = dirBgPos[info.dir];
	else if(type == 'room' && !info.icon)
		tpos = $('#mp044').css('background-position')
	else
		tpos = tileBgPos(info.icon ? info.icon : 0);
	icon.css('background-position', tpos);
	
		
	/* Set title and tooltip */
	if(info.title) {
		if(type == 'room' && !info.up)
			res += '<div class="room"><div class="lts"></div>'+info.title+'<div class="rts"></div></div>';

		var title = capFirstLetter(info.title);
		icon.attr('data-shdesc', title);
		icon.attr('tooltip', title);

		if(wtab == ctab)
			$('#detailstitle').text(title);
	}

	/* Set image */
	if(info.image)
		showImage($('.detailsimage', cont), info.image);
	else
		closeImageContainer($('.detailsimage-cont', cont));


	var textarea = $('.detailstext', cont).empty();
	var details = $(replaceColors(renderDetailsInner(info, type, true)));
	
	addDragAndDrop(details);
	makeExpandable(details);
	
	textarea.append(details);

	/* Activate the tab */
	if(!info.mv && ctab != wtab)
		dialog.tabs('option','active', wtab);

	if(info.num)
		cont.attr('mrn',info.num);

	if(info.where)
		cont.attr('cntmrn',info.where.num);
	else
		cont.attr('cnttype','room');

	if(type == 'room')
	{
		if(client_update.room.version < info.ver)
		{
			client_update.room.version = info.ver;
			client_update.room.needed = false;
		}
	}
	
	return res;
}

function renderDetailsInText(info, type)
{
	var res = '';

	if(info.title)
		res += '<br><div class="room"><div class="lts"></div>'+capFirstLetter(info.title)+'<div class="rts"></div></div>';
		/* addBannerStyle(capFirstLetter(info.title), 'mini', 'long'); */

	res += renderDetailsInner(info, type, false);

	if(info.image)
		showImage($('#image-cont'), info.image);

	return res;
}

function renderDetails(info, type)
{
	if($('#detailsdialog').dialog('isOpen'))
		return renderDetailsDialog(info, type);
	else
		return renderDetailsInText(info, type);
}


function detailsInit()
{
	$('.detailsimage')
		.on('error', function () {
			$(this).closest('.detailsimage-cont').slideUp('fast');
		})
		.on('load', function() {
			$(this).closest('.detailsimage-cont').slideDown('fast');
		});

	$('#detailsdialog').tabs({
		/* event: "mouseover", */
		activate:function(e,ui) {
			var icon = $('.iconimg', ui.newTab);
			var title = $(icon).attr('data-shdesc');
			$('#detailstitle').text(title);
		},
		beforeActivate: function(e,ui) {
			if(e.originalEvent && e.originalEvent.type == 'click')
			{
				if(ui.newPanel.is('#details-room'))
					sendToServer('@agg');
				else {
					var mrn = ui.newPanel.attr('mrn');
					if(mrn)
						sendToServer('@agg &'+mrn);
				}
			}
		}
	});

	$('#detailsdialog li').off('keydown');


	if(!openDialog('#detailsdialog'))
	{
		var pos = getWindowPosition('detailsdialog');
		var size = getWindowSize('detailsdialog');
		var w,h;

		if(size)
		{
			w = size[0];
			h = size[1];
		} else {
			w = ($(desktop).width()-360)*0.4;
			h = $(desktop).height();
		}

		if(pos == null)
			pos = {my:"left top",at:"right top",of:$("#textdialog").parent()};

		$('#detailsdialog').dialog({
			modal: false,
			autoOpen: false,
			title: addBannerStyle('<div id="detailstitle" class="ellipsed" style="width:90%">Dettagli</div>'),
			width: w,
			height: h,
			position: pos,
			dialogClass:'tg-dialog parch',
			dragStop: saveWindowData,
			resizeStop: detailsResize,
			closeText: 'Chiudi',
			open: function()
			{
				closeDialog('#imagedialog');
				client_options.noDetails = false;
				Save('options', client_options);
			},
			close: function()
			{
				openDialog('#imagedialog');
				client_options.noDetails = true;
				Save('options', client_options);
			}
		});
	}
}


/* *****************************************************************************
 * MISC RENDERING
 */

function renderEmbeddedImage(image)
{
	return '<img class="centered" src="' +  images_path + '/' + image + '">';
}

function renderLink(href, text)
{
	return '<a href="' + href + '" target="_blank">' + text + '</a>';
}

function renderMob(icon, condprc, count, mrn, desc, addclass)
{
	return '<div class="mob">'+renderIcon(icon, mrn, 'room', null, null, addclass)+'<span class="desc">'+decoratedDescription(condprc, null, null, count, desc)+'</span></div>'
}

function renderObject(icon, condprc, count, mrn, desc, addclass)
{
	return '<div class="obj">'+renderIcon(icon, mrn, 'room', null, null, addclass)+'<span class="desc">'+decoratedDescription(condprc, null, null, count, desc)+'</span></div>'
}

function renderMinidetails(condprc, moveprc, wgt)
{
	var pos = -11 * Math.floor(22 * (100 - condprc) / 100);
	return '<div class="hstat" style="background-position:0 '+pos+'px" condprc="'+condprc+'"'+ (moveprc ? ' moveprc="'+moveprc+'"' : "") +(wgt != null ? ' wgt="'+wgt+'"' : "") + '></div>';
}

function decoratedDescription(condprc, moveprc, wgt, count, desc)
{
	var countStr = '';

	if (count > 1)
		countStr = '&#160;<span class="cnt">[x' + count + ']</span>';

	return renderMinidetails(condprc, moveprc, wgt) + desc.replace(/\n/gm, ' ') + countStr;
}


/* *****************************************************************************
 * ICONS
 */

function tileBgPos(tilenum)
{
	var tc = tileCoords(tilenum);
	return '-'+tc[0]+'px -'+tc[1]+'px';
}

function tileCoords(tilenum)
{
	var posx = 32 * (tilenum & 0x7f);
	var posy = 32 * (tilenum >> 7);

	return [posx, posy];
}

function renderIcon(icon, mrn, cnttype, cntmrn, cmd, addclass)
{
	if(!icon)
		icon = 416;

	return '<div class="iconimg'+(addclass ? ' '+addclass : '')+'" style="background-position:' +  tileBgPos(icon)+'"'+(mrn ? ' mrn="'+mrn+'"': '')+(cmd ? ' cmd="'+cmd+'"': '')+(cnttype ? ' cnttype="'+cnttype+'"': '')+(cntmrn ? ' cntmrn="'+cntmrn+'"': '')+'></div>';
}

function renderIconWithBorder(icon, mrn, cnttype, cntmrn, cmd, addclass)
{
	return '<div class="iconslot">'+renderIcon(icon, mrn, cnttype, cntmrn, cmd, addclass)+'</div>';
}

function renderIconWithSmallBorder(icon, mrn, cnttype, cntmrn, cmd, addclass)
{
	return '<div class="iconslot sm">'+renderIcon(icon, mrn, cnttype, cntmrn, cmd, addclass)+'</div>';
}

function renderIconWithBackBorder(icon, mrn, cnttype, cntmrn, cmd, addclass)
{
	return '<div class="backslot">'+renderIcon(icon, mrn, cnttype, cntmrn, cmd, addclass)+'</div>';
}


/*
 * BOOK
 */

function formatText(text, style)
{
	var page = '';
	var parags = text.replace(/\r/gm,'').replace(/([^.:?!,])\s*\n/gm, '$1 ').split(/\n/);

	$.each(parags, function(i, p) {
		page += '<p'+(style ? ' class="'+style+'"' : '')+'>' + p + '</p>';
	});

	return page;
}

function bookInit()
{
}

function openBook(b)
{
	$('#bookdialog').dialog({
		closeOnEscape:false,
		title: addBannerStyle(b.title),
		dialogClass:'tg-dialog book',
		width: 960,
		height: 735,
		resizable:false,
		draggable:true,
		dragStop: saveWindowData,
		closeText: 'Chiudi'
	});

	$('#book').empty();

	if(b.pages.length == 0)
		$('#book').append('<div>Il libro non contiene pagine...</div>');
	else {
		for (var p=0; p < b.pages.length; ++p) {

			var page;

			if(b.pages[p].title)
			{
				page = '<div rel="'+b.pages[p].title+'" title="'+b.pages[p].title+'"><h3>'+b.pages[p].title+'</h3>';
			}
			else
			{
				page = '<div>';
			}
			
			page += replaceColors(formatText(b.pages[p].text)) + '</div>';

			$('#book').append(page);
		}
	}

	$('#book').booklet({
		width:924,
		height:660,
		pagePadding:20,
		pageNumbers:false,
		manual:false,
		overlays:false,
		arrows:true,
		menu:'#bookmenu',
		chapterSelector:true,
		pageSelector:true,
		nextControlTitle:"Pagina successiva",
		previousControlTitle:"Pagina precedente"
	});

}



/* *****************************************************************************
 * MAP
 */


function mapId(l, x, y)
{
	return mapidprefix+l+x+y;
}


function prepareTableMap(level, maxw, maxh)
{
	var s='';
	var x,y;

	s = '<table id="mapl'+level+'" class="maplayer">'
	for(y=0; y < maxh; y++)
	{
		s += '<tr>';

		for(x=0; x < maxw; x++)
			s += '<td id="'+mapId(level, x ,y)+'"></td>';
		
		s += '</tr>';
	}
	s += '</table>';
	
	$('#map').append(s);
	
	mapctx = null;
}

function drawTableMap(map)
{
	var l, x, y, xoff, yoff, xlim, ylim, pos, light;

	xoff = (maxmapwidth-map.d)/2;
	yoff = (maxmapheight-map.d)/2;
	xlim = xoff+map.d;
	ylim = yoff+map.d;

	for(l = 0; l < 2; l++)
	{
		pos=0;

		for(y=0; y < maxmapwidth; y++)
		{
			for(x=0; x < maxmapheight; x++)
			{
				var tpos;

				if (x >= xoff && x < xlim && y >= yoff && y < ylim) {
					var d=map.data[l][pos++];
					tpos=tileBgPos(d);
				} else
					tpos='0px 0px';

				$('#'+mapId(l, x ,y)).css('background-position', tpos);
			}
		}
	}
}

function prepareCanvasMap()
{
	$('#map').append('<canvas id="mapcont" width='+(maxmapwidth * maptilewidth)+' height='+(maxmapheight * maptileheight)+'></canvas>');
	
	mapctx = $('#mapcont')[0].getContext('2d');

	maptileimg = new Image();
	maptileimg.src = "<%= image_url_from_assets_file('/icons/tiles.png') %>";
	
	mapfogimg = new Image();
	mapfogimg.src = "<%= image_url_from_assets_file('interface/map/fog.png') %>";
	
	maprainimg = new Image();
	maprainimg.src = "<%= image_url_from_assets_file('interface/map/rain.png') %>";

	mapsnowimg = new Image();
	mapsnowimg.src = "<%= image_url_from_assets_file('interface/map/snow.png') %>";
	
	mapshadowimg[2] = new Image();
	mapshadowimg[2].src = "<%= image_url_from_assets_file('interface/map/shadow1.png') %>";
	
	mapshadowimg[1] = new Image();
	mapshadowimg[1].src = "<%= image_url_from_assets_file('interface/map/shadow2.png') %>";

	mapshadowimg[0] = new Image();
	mapshadowimg[0].src = "<%= image_url_from_assets_file('interface/map/shadow3.png') %>";
	
	mapshadowtile = new Image();
	mapshadowtile.src = "<%= image_url_from_assets_file('interface/map/shadowtile.png') %>";
}

function drawCanvasMap(map)
{
	var xoff, yoff, xlim, ylim, light;

	xoff = (maxmapwidth-map.d)/2;
	yoff = (maxmapheight-map.d)/2;
	xlim = xoff+map.d;
	ylim = yoff+map.d;


	/* Clear the canvas*/
	mapctx.clearRect(0,0, maxmapwidth * maptilewidth, maxmapheight * maptileheight);

	/* Cycle on the 2 layers */
	for(var l = 0; l < 2; l++)
	{
		var pos=0;
		for(var y=0; y < maxmapwidth; y++)
		{
			for(var x=0; x < maxmapheight; x++)
			{
				if (x >= xoff && x < xlim && y >= yoff && y < ylim)
					layermap[y][x] = map.data[l][pos++];
				else
					layermap[y][x] = 59;
			}
		}
		
		for(var y=0; y < maxmapwidth; y++)
		{
			for(var x=0; x < maxmapheight; x++)
			{
				var d = layermap[y][x];
				if(d != 59)
				{
					var tpos=tileCoords(d);
					mapctx.drawImage(maptileimg, tpos[0], tpos[1], maptilewidth, maptilewidth, x*maptilewidth, y*maptileheight, maptilewidth, maptileheight);
				}
			}
		}

		if (l == 0)
		{
			for(y=0; y < maxmapwidth; y++)
			{
				for(x=0; x < maxmapheight; x++)
				{
					if (layermap[y][x] == 59)
					{
						var clipx = 0,
							clipy = 0,
							swidth = 48,
							sheight = 48;
							
						if (y == 0 || layermap[y-1][x] == 59)
						{
							clipy = 8;
							sheight -= 8;
						}

						if (y == (maxmapheight-1) || layermap[y+1][x] == 59)
						{
							sheight -= 8;
						}

						if (x == 0 || layermap[y][x-1] == 59)
						{
							clipx = 8;
							swidth -= 8;
						}

						if (x == (maxmapwidth-1) || layermap[y][x+1] == 59)
						{
							swidth -= 8;
						}

						
						mapctx.drawImage(mapshadowtile, clipx, clipy, swidth, sheight, x*maptilewidth-8+clipx, y*maptileheight-8+clipy, swidth, sheight);
					}
				}
			}
		}
	}
	
	if(mapshadowimg[map.l])
		mapctx.drawImage(mapshadowimg[map.l], 96 - 32*map.l, 96 - 32*map.l);
	
	if(map.f)
		mapctx.drawImage(mapfogimg, 0, 0);

	if(map.r)
		mapctx.drawImage(maprainimg, 0, 0);

	if(map.s)
		mapctx.drawImage(mapsnowimg, 0, 0);
}


function updateMap(map)
{
	drawCanvasMap(map);
	/*
	if(	map.l != maplight)
	{
		$('#map').attr('class', 'light'+map.l);
		maplight = map.l;
	}
	$('#fog').toggle(map.f == 1);
	$('#rain').toggle(map.r == 1);
	$('#snow').toggle(map.s == 1);
	*/
}

function mapResize(size)
{
	if(mapsizedata[size])
	{
		var oldclasses = $.map(mapsizedata, function(m) { return m.dialogClass }).join(' ');
		
		$('#mapdialog').removeClass(oldclasses);
		
		if(mapsizedata[size].dialogClass)
			$('#mapdialog').addClass(mapsizedata[size].dialogClass);
			
		$('#mapdialog').dialog({
			width:mapsizedata[size].width,
			height:mapsizedata[size].height,
		});
	}
}

function mapInit()
{
	/*
	prepareTableMap(0, maxmapwidth, maxmapheight);
	prepareTableMap(1, maxmapwidth, maxmapheight);
	*/
	
	prepareCanvasMap();
	
	var pos = getWindowPosition('mapdialog');

	if(pos == null)
		pos = {my:"right top",at:"right top",of:desktop};


	$('#mapdialog').dialog({
		closeOnEscape:false,
		dialogClass:'tg-dialog notitle',
		width:mapsizedata[client_options.map.size].width,
		height:mapsizedata[client_options.map.size].height,
		resizable:false,
		draggable:false,
		dragStop: saveWindowData,
		position:pos
	});
/*
	$('#largemapdialog').dialog({
		autoOpen:false,
		closeOnEscape:false,
		title: addBannerStyle('Mappa di Ikhari'),
		dialogClass:'tg-dialog book',
		width: 960,
		height: 735,
		resizable:false,
		draggable:true,
		dragStop: saveWindowData,
		closeText: 'Chiudi'
	});

	$('#largemapviewport').mapbox({
		zoom: true,
		pan: true,
		defaultLayer: 0,
		layerSplit: 4
	});
	*/
	if(mapsizedata[client_options.map.size].dialogClass)
		$('#mapdialog').addClass(mapsizedata[client_options.map.size].dialogClass);

	$('#mapdialog').dialog('widget').draggable({
		containment:"window",
		stop: saveWindowData
	});
}


/* *****************************************************************************
 * SKY
 */

function setSky(sky)
{
	var skypos = ['0','1','2','3','4','5','6','7','8','9','N','d','e','f','g','i','o','p','q','r','s','t','u','w','y'];
	$('#sky').css('background-position', '0 -'+(skypos.indexOf(sky)*29)+'px');
}



/* *****************************************************************************
 * DOORS
 */

function closeLockDoor(dir)
{
	var cmd;

	if(dir_status[dir] == '2')
		cmd = 'chiudi '+ dir_names[dir];
	else if(dir_status[dir] == '3')
		cmd = 'blocca '+ dir_names[dir];

	// Do not push into history
	if(cmd)
		sendToServer(cmd);
}

function goDir(dir)
{
	var cmd;

	if(godinvlev == 0 && dir_status[dir] == '3')
		cmd = 'apri '+ dir_names[dir];
	else if (godinvlev == 0 && dir_status[dir] == '4')
		cmd = 'sblocca '+ dir_names[dir];
	else
		cmd = dir_names[dir];

	// Do not push into history
	if(cmd)
		sendToServer(cmd);
}

function doorsInit()
{
	$('#compassarea').mouseenter(function () {
		cursoronmap = true;
	});

	$('#compassarea').mouseleave(function () {
		cursoronmap = false;
	});

	for(var d = 0; d < dir_names.length; ++d)
		$('#'+dir_names[d]).button({text:false}).mousedown({dir:d}, function(event) {
			if (ingame) {
				if(event.which == 1) {
					goDir(event.data.dir);
				} else if(event.which == 3) {
					event.preventDefault();
					closeLockDoor(event.data.dir);
				}
			}
		})
}

function setDoors(doors)
{
	for(var d = 0; d < dir_names.length; ++d)
		$('#'+dir_names[d]).css('background-position', -33*doors[d]);
	dir_status = doors;
}



/* *****************************************************************************
 * STATUS
 */

function updatePlayerStatus(hprc, mprc)
{
	var hcolor = prcLowTxt(hprc, hlttxtcol);
	var mcolor = prcLowTxt(hprc, hlttxtcol);

	$('.movebar').width(limitPrc(mprc)+'%');
	$('.moveprc').css('color', mcolor).text(mprc);

	$('.healthbar').width(limitPrc(hprc)+'%');
	$('.healthprc').css('color', hcolor).text(hprc);
}

function updateEnemyStatus(hprc, mprc)
{
	$('#enemyh').width(limitPrc(hprc)+'%');
	$('#enemym').width(limitPrc(mprc)+'%');
}

function updateEnemyIcon(icon)
{
	if (enemy_icon != icon)
	{
		$('#enemyicon').css('background-position', tileBgPos(icon)).attr('mrn', 0);
		enemy_icon = icon;
	}
}


function setStatus(st)
{
	if(st.length == 5) {
		if(!in_combat) {
			in_combat = true;
			$('#combatpanel').slideDown(100);
		}

		updateEnemyStatus(st[2], st[3]);
		updateEnemyIcon(st[4]);
		
	} else if(in_combat) {
		$('#combatpanel').slideUp(100);
		in_combat = false;
	}

	updatePlayerStatus(st[0], st[1]);

	return '';
}




/* *****************************************************************************
 * IMAGE AREA
 */

function closeImageContainer(cont)
{
	cont.slideUp('fast');
}

function showImage(cont, image)
{
	var imgsrc=images_path + '/' + image;
	var currimgsrc = cont.attr('src');

	if (currimgsrc != imgsrc)
		cont.attr('src', imgsrc);
}

function showImageWithGamma(cont, image, red, green, blue)
{
/*
	showImageInline(cont, image);
*/
}




/* *****************************************************************************
 * FRAMES
 */

function addFrameStyle(content, style)
{
	var base="paper2";
	return	'<div class="'+base+' frame'+(style ? ' '+style : '')+'"><div class="'+base+' corner top left"></div><div class="'+base+' horizontal top"></div><div class="'+base+' corner top right"></div><div class="'+base+' vertical left"></div><div class="'+base+' content">'
			+ content
			+ '</div><div class="'+base+' vertical right"></div><div class="'+base+' corner bottom left"></div><div class="'+base+' horizontal bottom"></div><div class="'+base+' corner bottom right"></div></div>';
}

function addBannerStyle(content, style, width)
{
	if(!style) style='mini';
	if(!width) width='long';

	return '<div class="banner '+width+' '+style+'"><div class="left"></div><div class="content ellipsed">'+content+'</div><div class="right"></div></div>';
}

function addFramedImg(url)
{
	var img = url ? '<img class="stretched" src="'+ images_path + '/' + url +'"/>' : '<div style="margin:15px">Nessuna immagine!</div>';
	return '<div class="inline-img"><div class="frame corner top left"></div><div class="frame horizontal top"></div><div class="frame corner top right"></div><div class="frame vertical left"></div><div class="frame content">'+img+'</div><div class="frame vertical right"></div><div class="frame corner bottom left"></div><div class="frame horizontal bottom"></div><div class="frame corner bottom right"></div></div>';
}

/* *****************************************************************************
 * STATUS BAR
 */

function limitPrc(prc)
{
	if(prc < 0)
		prc = 0;
	else if (prc > 100)
		prc = 100;

	return prc;
}

function prcBar(prc, color, txt)
{
	return '<div class="meter2'+(txt ? ' withtxtbox': '')+'"><div class="barcont"><span class="' + color +'" style="width:'+limitPrc(prc)+'%"></span></div>'+(txt ? '<div class="metertxt">'+txt+'</div>' : '')+'</div>';
}

function prcBicolorBar(prc1, color1, id1, prc2, color2, id2, txt)
{
	return '<div class="meter2'+(txt ? ' withtxtbox': '')+'"><div class="barcont"><span '+(id1 ? 'id="'+id1+'" ': '')+'class="' + color1 +' up" style="width:'+limitPrc(prc1)+'%"></span><span '+(id2 ? 'id="'+id2+'" ': '')+'class="' + color2 +' low" style="width:'+limitPrc(prc2)+'%"></span></div>'+(txt ? '<div class="metertxt">'+txt+'</div>' : '')+'</div>';
}

function prcLowTxt(val, values)
{
	for(var i=0; i < values.length; ++i)
		if(val <= values[i].val)
			return values[i].txt;

	return null;
}

function prcHighTxt(val, values)
{
	for(var i=0; i < values.length; ++i)
		if(val >= values[i].val)
			return values[i].txt;

	return null;
}



/* *****************************************************************************
 * BUTTONS BAR
 */

function buttonbarInit()
{
	var buttons = [
		{ id:'#skybutton', cmd:'data; clima', text:true },
		{ id:'#infobutton', cmd:'info' },
		{ id:'#statusbutton', cmd:'stato', text:true },
		{ id:'#invbutton', cmd:'invent' },
		{ id:'#equipbutton', cmd:'equip' },
		{ id:'#skillsbutton', cmd:'abilit', text:true },
		{ id:'#coinsbutton', cmd:'monete', text:true },
		{ id:'#detailsbutton', cmd:function() {
			toggleDialog('#detailsdialog');
		} },
		{ id:'#configbutton', cmd:function() {
			toggleDialog('#configdialog');
		} },
		{ id:'#logbutton', cmd:function() {
			toggleDialog('#logdialog');
		} },
		{ id:'#fullscreenbutton', cmd:function() {
			$(document).toggleFullScreen();
		} },
		{ id:'#connectbutton', cmd:function () {
			disconnectFromServer();
		} }
	];

	$.each(buttons, function(idx, bdata) {
		var button = $(bdata.id).button({
			text:false,
			label:null,
			icons: { primary: null, secondary: null }
		}).empty();

		if(bdata.cmd) {
			button.click(
				typeof bdata.cmd == "function" ?
				bdata.cmd
				: function() {
					if (ingame)
						processCommands(bdata.cmd);
					if(bdata.text)
						openDialog('#textdialog');
				});
		}
	});

	$('body').toggleClass('topdown', client_options.buttonsOnTop);
	$('#buttonsbar').fadeIn('slow');
}


/* *****************************************************************************
 * TOOLTIPS
 */

function weightStr(wgt)
{
	return wgt + ' pietr' + (wgt == 1 ? 'a' : 'e');
}

function tooltipsInit()
{
	if(!$.support.touch)
	{
		$(document).tooltip({
			items:"[tooltip], .hstat, #combatfilter",
			tooltipClass:"tg-tooltip",
			position: { my:"center bottom", at:"center top-5" },
			content: function(e) {
				var element = $( this );

				if ( element.is( ".hstat") ) {
					var c = element.attr( "condprc" );
					var m = element.attr( "moveprc" );
					var w = element.attr( "wgt" );
					var bar;

					if(m)
						bar = prcBicolorBar(c, 'red', null, m, 'green', null);
					else
						bar = prcBar(c, 'red', w != null ? 'Ingombro: '+ weightStr(w) : null);

					/*
					if(w)
						return '<div class="tt-smbox">Ingombro: '+ weightStr(w) + bar + '</div>'
					else
					*/
					return bar;
				}
				else if ( element.is('[cnttype="equip"]') ) {
					var res = '<div class="tt-bigbox">'+element.attr( "tooltip" );
					var wgt = element.attr('wgt');
					var cnd = element.attr( 'condprc' );
					
					if( wgt )
						res += '<p>Ingombro: '+weightStr(wgt)+'</p>';

					if( cnd )
						res += prcBar(cnd, 'red');

					res += '</div>';

					return res;
				}
				else if ( element.is( "#combatfilter" ) ) {
					var title = combat_filters[client_options.combatFilter].name;

					if (title.length > 0)
						return '<div class="tt-paper"><em class="tt-rivet ellipsed">Filtra: '+title+'</em></div>';
					else
						return null;
				}
				else if ( element.is( "[tooltip]" ) ) {
					var title = element.attr( "tooltip" );

					if (title.length > 0)
						return '<div class="tt-paper"><em class="tt-rivet ellipsed">'+title+'</em></div>';
					else
						return null;
				}
			}
		});
	}
}

/* *****************************************************************************
 * AUDIO
 */

function audioInit()
{
	if(typeof client_options.musicVolume != 'number' || client_options.musicVolume < 0 || client_options.musicVolume > 100)
		client_options.musicVolume = 70;

	if(typeof client_options.soundVolume != 'number' || client_options.soundVolume < 0 || client_options.soundVolume > 100)
		client_options.soundVolume = 100;

	$('#music').get(0).volume = client_options.musicVolume/100;
	$('#sound').get(0).volume = client_options.soundVolume/100;
}


function playMusic(music)
{
	if(client_options.musicVolume > 0)
	{
		var current_src = $('#music').attr('src');
		var new_src = sounds_path + '/' + music;
		
		if(current_src != new_src || $('#music').prop('paused') == true)
			$('#music').attr('src', new_src);
	}
}

function playSound(sound)
{
	if(client_options.soundVolume > 0)
	{
		var current_src = $('#sound').attr('src');
		var new_src = sounds_path + '/' + sound;
		
		if(current_src != new_src || $('#sound').prop('ended'))
			$('#sound').attr('src', new_src);
	}
}

function playAudio(audio)
{
	var mp3=".mp3";
	var mid=".mid";

	if(audio.indexOf(mp3, audio.length - mp3.length) !== -1) {
		
			playMusic(audio);

	} else if(audio.indexOf(mid, audio.length - mid.length) !== -1) {
		
		playMusic(audio.replace('.mid', '.mp3'));
		
	} else 	if(client_options.soundVolume > 0) {
		
		playSound(audio.replace('.wav', '.mp3'));

	}
}



function textButtonsInit()
{
	$('#inputmodifiers').buttonset();
	$('#inputmodifiers :radio').click(function (e) {
		cmd_prefix = $(this).val();
	})
}

/* *****************************************************************************
 * EQUIPMENT
 */

var equip_races=[
	'human_m',
	'human_f',
	'halfling_m',
	'halfling_f',
	'elf_m',
	'elf_f',
	'dwarf_m',
	'dwarf_f',
	'goblin_m',
	'goblin_f',
	'orc_m',
	'orc_f'
];

var equip_positions_by_name={
	"r_finger":"Al dito destro",
	"l_finger":"Al dito sinistro",
	"neck":"Al collo",
	"body":"Sul corpo",
	"head":"In testa",
	"legs":"Sulle gambe",
	"feet":"Ai piedi",
	"hands":"Sulle mani",
	"arms":"Sulle braccia",
	"around":"Attorno al corpo",
	"waist":"In vita",
	"r_wrist":"Al polso destro",
	"l_wrist":"Al polso sinistro",
	"r_hand":"Nella mano destra",
	"l_hand":"Nella mano sinistra",
	"back":"Sulla schiena",
	"r_ear":"All'orecchio destro",
	"l_ear":"All'orecchio sinistro",
	"eyes":"Sugli occhi",
	"sheath":"Nel fodero",
	"belt":"Alla cintura",
	"over":"A tracolla",
	"r_shoulder":"Sulla spalla destra",
	"l_shoulder":"Sulla spalla sinistra",
	"tied":"Imprigionato"
};

var equip_positions_by_num = [''].concat($.map(equip_positions_by_name, function(v) {
	return v;
}));

var race_to_class = {
	"uma":"human",
	"ume":"human",
	"eal":"elf",
	"esi":"elf",
	"dra":"elf",
	"drw":"elf",
	"meu":"human",
	"mel":"human",
	"hal":"halfling",
	"nan":"dwarf",
	"orc":"orc",
	"gob":"goblin",
	"els":"elf"
};




function updateWeight(weight, wprc)
{
	wprc = limitPrc(wprc);

	var txtcolor = prcHighTxt(wprc, wgttxtcol);
	var barcolor = prcHighTxt(wprc, wgtbarcol);

	$('.carrywgt').css('color', txtcolor).text(weight);
	$('.carrywgtprc').css('color', txtcolor).text(wprc);
	$('.carrywgtbar').css('width', wprc+'%').removeClass('red yellow green').addClass(barcolor);
}


function equipSetRace(racesex)
{
	if(eqracesex != racesex)
	{
		eqracesex = racesex;
		$('#equipcont').removeClass(equip_races.join(' ')).addClass(racesex);
	}
}


function equipPosItem(idx)
{
	return '<li class="eqslot eq'+idx+'"></li>';
}

function equipPosContainer(posname, cont)
{
	return '<ul id="'+posname+'" class="'+posname+'">'+cont+'</ul>';
}

function equipShowSub()
{
	$(this).siblings('ul').fadeOut('fast');
	$(this).children('.enabled').show().each(function (idx, slot) {
		if(idx > 0)
		{
			var offx = 43 * (idx & 3);
			var offy = 43 * (idx >> 2);

			$(slot).animate({
				left:"+=" + offx,
				top:"+=" + offy,
				'z-index':"+=5"
			}, 'fast');
		}
	});
}

function equipHideSub()
{
	$(this).siblings('ul').fadeIn('fast');
	$(this).children('.enabled').each(function (idx, slot) {
		if(idx > 0)
		{
			var offx = 43 * (idx & 3);
			var offy = 43 * (idx >> 2);

			$(slot).animate({
				left:"-=" + offx,
				top:"-=" + offy,
				'z-index':"-=5"
			}, 'fast', function() { $(this).hide() });
		}
	});
}


function equipInit(aslist)
{
	$('#equipdialog .iron.content').empty();
	$('#equipdialog').toggleClass('aslist', aslist);
	
	if (aslist)
	{
		$('#equipdialog .iron.content').append('<div id="equipcont" class="scrollable-y" cont-type="pc-equip"></div>');
	}
	else
	{
		$('#equipdialog .iron.content').append('<div id="equipcont" class="equip-inner container human_m" cont-type="pc-equip"></div>');
		var innercontainer = $('#equipcont');

		$.each(equip_positions_by_name, function(posname, posdesc) {
			var elems = '';

			for(var i=0; i < 8; ++i)
				elems += equipPosItem(i);

			innercontainer.append(equipPosContainer(posname, elems));
		});

		$('ul', innercontainer).hoverIntent({
			timeout:500,
			interval:200,
			over:equipShowSub,
			out:equipHideSub
		});
	}
	
	if (isDialog('#equipdialog'))
	{
		var mw, mh, w, h;
		
		if($('#equipdialog').is('.aslist'))
		{
			mw = 360;
			mh = 200;
		}
		else
		{
			mw = 550;
			mh = 710;
		}

		$('#equipdialog').dialog({
			minWidth:mw,
			minHeight:mh
		});
		
		w = $('#equipdialog').dialog('option', 'width');
		h = $('#equipdialog').dialog('option', 'height');
		
		if(w < mw)
			$('#equipdialog').dialog('option', 'width', mw);

		if(h < mh)
			$('#equipdialog').dialog('option', 'height', mh);
	}
	
	if(lastEquip)
		equipUpdate(lastEquip);
}

function equipUpdate(eq)
{
	if($('#equipdialog').is('.aslist'))
	{
		var cont = {
			list:[]
		};

		$.each(eq, function (poskey, eqdata) {
			var where = equip_positions_by_name[poskey];
			if(where)
				cont.list = cont.list.concat(eqdata);
		});
		
		var invdata = $(replaceColors(renderDetailsList('equip', null, cont, 'obj')));
		makeExpandable(invdata);
		$('#equipcont').empty().append(invdata);
	}
	else
	{
		if(!eq.race)
			eq.race = 0;

		if(!eq.sex)
			eq.sex = 'f';

		equipSetRace(race_to_class[eq.race]+'_'+eq.sex);

		$('.enabled', '#equipcont').removeClass('enabled');
		$('.iconimg', '#equipcont').remove();

		$('#equipcont').children('ul').each(function (idx, pos) {
			var where = equip_positions_by_name[pos.id];
			var eqdata = eq[pos.id];
			var cont = $(pos);

			if(eqdata) {
				eqdata.sort(function(a,b) {
					var eq_pos_a = $.isArray(a.eq) ? a.eq[1] : 0;
					var eq_pos_b = $.isArray(b.eq) ? b.eq[1] : 0;
					
					return eq_pos_b - eq_pos_a;
				});
				
				$.each(eqdata, function(idx, obj) {
					var slot = $('.eq'+idx, cont);
					var desc = where + ': ' + obj.desc;
					var img = $(renderIcon(obj.icon, obj.mrn[0], 'equip', null, null, 'interact obj')).attr('tooltip',desc).attr('wgt',obj.wgt).attr('condprc',obj.condprc);
					slot.append(img).addClass('enabled');
				});
			}
		});
	}
	
	addDragAndDrop('#equipcont');
	updateWeight(eq.weight, eq.wprc);
	
	lastEquip = eq;
	
	if(client_update.equipment.version < eq.ver)
	{
		client_update.equipment.version = eq.ver;
		client_update.equipment.needed = false;
	}
}

function renderEquipment(eq)
{
	if(!eq.up)
	{
		if(!openDialog('#equipdialog'))
		{
			var pos = getWindowPosition('equipdialog');
			var size = getWindowSize('equipdialog');
			var w,h, mw, mh;

			if(size)
			{
				w = size[0];
				h = size[1];
			} else {
				if($('#equipdialog').is('.aslist'))
				{
					w = 360;
					h = 300;
				}
				else
				{
					w = 550;
					h = 710;
				}
			}

			if($('#equipdialog').is('.aslist'))
			{
				mw = 360;
				mh = 200;
			}
			else
			{
				mw = 550;
				mh = 710;
			}
			
			if(w < mw)
				w = mw;
				
			if(h < mh)
				h = mh;

			if(pos == null)
				pos = {my:"center",at:"center",of:desktop};

			$('#equipdialog').dialog({
				modal: false,
				title: addBannerStyle('Equipaggiamento'),
				width: w,
				height: h,
				minWidth:mw,
				minHeight:mh,
				position: pos,
				dialogClass:'tg-dialog parch equip',
				dragStop: saveWindowData,
				resizeStop: saveWindowData,
				closeText: 'Chiudi'
			});
		}
	}
	
	equipUpdate(eq);
}



/* *****************************************************************************
 * INVENTORY
 */

function updateInventory(inv)
{
	var invcont = $('#invcont');

	updateWeight(inv.weight, inv.wprc);
		
	invcont.empty();

	if(inv.list.length == 0)
		invcont.append('<tr><td></td><td>Non hai niente in inventario!</td></tr>');
	else
	{
		var invdata = $(replaceColors(renderDetailsList('inv', null, inv, 'obj')));
		
		makeExpandable(invdata);
		addDragAndDrop(invdata);

		invcont.append(invdata);
	}
	
	if(client_update.inventory.version < inv.ver)
	{
		client_update.inventory.version = inv.ver;
		client_update.inventory.needed = false;
	}
}

function renderInventory(invent)
{
	if(!invent.up)
	{
		if(!openDialog('#invdialog')) {
			var pos = getWindowPosition('invdialog');
			var size = getWindowSize('invdialog');
			var w,h;

			if(size)
			{
				w = size[0];
				h = size[1];
			} else {
				w = 360;
				h = $(desktop).height() - 386;
			}

			if(pos == null)
				pos = {my:"right top",at:"right bottom",of:'#mapdialog'};

			$('#invdialog').dialog({
				modal: false,
				title: addBannerStyle('Inventario'),
				width: w,
				height: h,
				minWidth:360,
				minHeight:200,
				position: pos,
				dialogClass:'tg-dialog parch',
				dragStop: saveWindowData,
				resizeStop: saveWindowData,
				closeText: 'Chiudi'
			});
		}
	}
	
	updateInventory(invent);
}



/* *****************************************************************************
 * INTERACTION
 */

function interactEvent(event)
{
	if(ingame && !dragging) {
		if($(this).is('td')) {
			
			switch(event.which) {
				// Left mouse button
				case 1:
					var dir = $(this).attr('dir');
					if(dir == 'here')
						sendToServer('guarda');
					else
						sendToServer('guarda '+dir);
					break;
			}
			
		} else {
			
			switch(event.which) {
				// Left mouse button
				case 1:
					
					var mrn = $(this).attr('mrn');
					var cmd = $(this).attr('cmd');
					
					if(cmd == null)
					{
						cmd = $(this).is('.where') ? "@agg" : "guarda";
					}
					
					if(!mrn || mrn==0)
					{
						/*
						if (isDialogOpen('#detailsdialog'))
							$('#detailsdialog').tabs('option','active', 0);
						*/
						sendToServer(cmd);
					}
					else {
						var cnttype = $(this).attr('cnttype');
						var cntmrn = $(this).attr('cntmrn');
						 
						
						if(cnttype == 'inv')
							sendToServer(cmd+' &'+mrn);
						else if(cntmrn && !isNaN(parseInt(cntmrn)))
							sendToServer(cmd+' &'+mrn+' &'+cntmrn);
						else
							sendToServer(cmd+' &'+mrn);
					}
					break;
			}
		}
	}

	return true;
}

var obj_interaction_config = {
	// rimuovi, rimuovi+posa, riponi, impugna
	'equip': ['.eqp-out','.inv-out','.wpn-out','.wpn-in'],
	'inv': ['.inv-out','.eqp-in','.wpn-in'],
	'room': ['.inv-in', '.eqp-in','.wpn-in'],
	'obj': ['.inv-in', '.inv-out', '.eqp-in','.wpn-in'],
	'pers':['.inv-out','.meq-out', '.meq-in']
};

function updateInteractBox(config)
{
	if(config && config.length)
	{
		var box = $('#interactbox');
		var cont = $('#interactbox');
		$('.interact-elem', cont).hide();
		
		$.each(config, function(idx, elemclass) {
			$(elemclass, cont).show();
		});
		
		box.height(18+64*config.length);
		return true;
	}
	return false;
}

function addDragAndDrop(objs)
{
	$('.iconimg.interact', objs).draggable({
		addClasses: false,
		appendTo: "body",
		helper: function() {
			return $(this).clone().removeAttr('tooltip');
		},
		revert: "invalid",
		scroll: false,
		zIndex: 10000,
		distance:5,
		start: function(event,ui) {
			dragging = true;
			
			var what = $(this);
			
			if(what.is('.obj'))
				if(updateInteractBox(obj_interaction_config[what.attr('cnttype')]))
					$('#interactbox').show().position({my:'right center',at:'left center',of:what});
		},
		stop: function(event,ui) {
			dragging = false;
			
			$('#interactbox').hide();

			if(at_drag_stop_func) {
				at_drag_stop_func();
				max_drop_stack = 0;
				at_drag_stop_func = null;
			}
		}
	}).droppable({
		accept: '.obj',
		greedy: true,
		drop: function(event, ui) {
			iconToIcon(ui.draggable, $(this));
		}
	});
}

function interactionInit()
{
	$(document).bind("contextmenu", function(e) {
		e.preventDefault();
	});

	$(document).on('mouseup', '.interact', interactEvent);
	
	var cont = $('#interactbox');
	
	$('.inv-in', cont).droppable({
		accept: '.obj',
		hoverClass: 'valid',
		greedy:true,
		drop: function(event, ui) {
			var zidx = 10000;
			if(max_drop_stack < zidx) {
				at_drag_stop_func = function() {
					toInventory(ui.draggable);
				};
				max_drop_stack = zidx;
			}
			return false;
		}
	});

	$('.inv-out', cont).droppable({
		accept: '.obj',
		hoverClass: 'valid',
		greedy:true,
		drop: function(event, ui) {
			var zidx = 10000;
			if(max_drop_stack < zidx) {
				at_drag_stop_func = function() {
					fromInventory(ui.draggable);
				};
				max_drop_stack = zidx;
			}
			return false;
		}
	});

	$('.eqp-in', cont).droppable({
		accept: '.obj',
		hoverClass: 'valid',
		greedy:true,
		drop: function(event, ui) {
			var zidx = 10000;
			if(max_drop_stack < zidx) {
				at_drag_stop_func = function() {
					toEquip(ui.draggable);
				};
				max_drop_stack = zidx;
			}
			return false;
		}
	});

	$('.eqp-out', cont).droppable({
		accept: '.obj',
		hoverClass: 'valid',
		greedy:true,
		drop: function(event, ui) {
			var zidx = 10000;
			if(max_drop_stack < zidx) {
				at_drag_stop_func = function() {
					fromEquip(ui.draggable);
				};
				max_drop_stack = zidx;
			}
			return false;
		}
	});
	
	$('.wpn-in', cont).droppable({
		accept: '.obj',
		hoverClass: 'valid',
		greedy:true,
		drop: function(event, ui) {
			var zidx = 10000;
			if(max_drop_stack < zidx) {
				at_drag_stop_func = function() {
					toHand(ui.draggable);
				};
				max_drop_stack = zidx;
			}
			return false;
		}
	});

	$('.wpn-out', cont).droppable({
		accept: '.obj',
		hoverClass: 'valid',
		greedy:true,
		drop: function(event, ui) {
			var zidx = 10000;
			if(max_drop_stack < zidx) {
				at_drag_stop_func = function() {
					fromHand(ui.draggable);
				};
				max_drop_stack = zidx;
			}
			return false;
		}
	});	


	$('.meq-in', cont).droppable({
		accept: '.obj',
		hoverClass: 'valid',
		greedy:true,
		drop: function(event, ui) {
			var zidx = 10000;
			if(max_drop_stack < zidx) {
				at_drag_stop_func = function() {
					toMobEquip(ui.draggable);
				};
				max_drop_stack = zidx;
			}
			return false;
		}
	});

	$('.meq-out', cont).droppable({
		accept: '.obj',
		hoverClass: 'valid',
		greedy:true,
		drop: function(event, ui) {
			var zidx = 10000;
			if(max_drop_stack < zidx) {
				at_drag_stop_func = function() {
					fromEquip(ui.draggable);
				};
				max_drop_stack = zidx;
			}
			return false;
		}
	});	

	$('#invdialog').droppable({
		accept: '.obj',
		hoverClass: 'valid',
		greedy:true,
		drop: function(event, ui) {
			var zidx = parseInt($(this).dialog('widget').css('z-index'));
			if(max_drop_stack < zidx) {
				at_drag_stop_func = function() {
					toInventory(ui.draggable);
				};
				max_drop_stack = zidx;
			}
			return false;
		}
	});
	
	$('#equipdialog').droppable({
		accept: '.obj',
		hoverClass: 'valid',
		greedy:true,
		drop: function(event, ui) {
			var zidx = parseInt($(this).dialog('widget').css('z-index'));
			if(max_drop_stack < zidx) {
				at_drag_stop_func = function() {
					toEquip(ui.draggable);
				};
				max_drop_stack = zidx;
			}
			return false;
		}
	});

	$('#details-room .content').droppable({
		accept: '.obj',
		hoverClass: 'valid',
		greedy:true,
		drop: function(event, ui) {
			var zidx = parseInt($('#detailsdialog').dialog('widget').css('z-index'));
			if(max_drop_stack < zidx) {
				at_drag_stop_func = function() {
					fromInventory(ui.draggable);
				};
				max_drop_stack = zidx;
			}
			return false;
		}
	});

	$('#details-pers .content').droppable({
		accept: '.obj',
		hoverClass: 'valid',
		greedy:true,
		drop: function(event, ui) {
			var zidx = parseInt($('#detailsdialog').dialog('widget').css('z-index'));
			if(max_drop_stack < zidx) {
				at_drag_stop_func = function() {
					var cnt = $('#details-pers');
					iconToDest(ui.draggable, 'pers', cnt.attr('mrn'), cnt.attr('cnttype'), cnt.attr('cntmrn'));
				};
				max_drop_stack = zidx;
			}
			return false;
		}
	});

	$('#details-obj .content').droppable({
		accept: '.obj',
		hoverClass: 'valid',
		greedy:true,
		drop: function(event, ui) {
			var zidx = parseInt($('#detailsdialog').dialog('widget').css('z-index'));
			if(max_drop_stack < zidx) {
				at_drag_stop_func = function() {
					var cnt = $('#details-obj');
					iconToDest(ui.draggable, 'obj', cnt.attr('mrn'), cnt.attr('cnttype'), cnt.attr('cntmrn'));
				};
				max_drop_stack = zidx;
			}
			return false;
		}
	});
}


function iconToDest(obj1, type2, mrn2, cnttype2, cntmrn2)
{
	var mrn1 = $(obj1).attr('mrn');
	var cnttype1 = $(obj1).attr('cnttype');
	// var cntmrn1 = $(obj1).attr('cntmrn');

	switch(cnttype1) {			
		case 'inv':
			if(type2 == 'obj') {
				cmd = 'metti &'+mrn1+' &'+mrn2;
				if(whichTabIsOpen('#detailsdialog') == 2)
					cmd += '; @agg &'+mrn2;

			} else if (type2 == 'pers') {
				cmd = 'dai &'+mrn1+' &'+mrn2;
				if(whichTabIsOpen('#detailsdialog') == 1)
					cmd += '; @agg &'+mrn2;
			} else
				return;
			break;

		case 'room':
			switch(cnttype2)
			{
				case 'room':
					cmd = 'carica &'+mrn1+' &'+mrn2;
					if(whichTabIsOpen('#detailsdialog') == 2)
						cmd += '; @agg &'+mrn2;
					if(whichTabIsOpen('#detailsdialog') == 0)
						cmd += '; @agg';
					break;
			
				default:
					return;
			}
			break;

		default:
			return;
	}

	processCommands(cmd);
}

function iconToIcon(obj1, obj2)
{

	var mrn2 = $(obj2).attr('mrn');
	var cnttype2 = $(obj2).attr('cnttype');
	var cntmrn2 = $(obj2).attr('cntmrn');
	var type2;
	if($(obj2).is('.obj'))
		type2 = 'obj';
	else if($(obj2).is('.pers'))
		type2 = 'pers';
		
	iconToDest(obj1, type2, mrn2, cnttype2, cntmrn2);
}


function toMobEquip(obj)
{
	var mrn = $(obj).attr('mrn');
	var cnttype = $(obj).attr('cnttype');
	var cmd;

	switch(cnttype) {
		case 'pers':
			var cntmrn = $(obj).attr('cntmrn');
			cmd = 'barda &'+cntmrn+' &'+mrn;
			if(whichTabIsOpen('#detailsdialog') == 1)
				cmd += '; @agg &'+cntmrn;
			break;
			
		default:
			return;
	}
	
	processCommands(cmd);
}


function toEquip(obj)
{
	var mrn = $(obj).attr('mrn');
	var cnttype = $(obj).attr('cnttype');
	var cmd;

	switch(cnttype) {
		case 'room':
			cmd = 'prendi &'+mrn+'; indossa &'+mrn;
			if(whichTabIsOpen('#detailsdialog') == 0)
				cmd += '; @agg';
			break;
			
		case 'inv':
			cmd = 'indossa &'+mrn;
			break;

		case 'obj':
			var cntmrn = $(obj).attr('cntmrn');
			cmd = 'prendi &'+mrn+' &'+cntmrn+'; indossa &'+mrn;
			if(whichTabIsOpen('#detailsdialog') == 2)
				cmd += '; @agg &'+cntmrn;
			break;

		case 'pers':
			var cntmrn = $(obj).attr('cntmrn');
			cmd = 'barda &'+cntmrn+' &'+mrn;
			if(whichTabIsOpen('#detailsdialog') == 1)
				cmd += '; @agg &'+cntmrn;
			break;
			
		default:
			return;
	}
	processCommands(cmd);
}

function fromEquip(obj)
{
	var mrn = $(obj).attr('mrn');
	var cnttype = $(obj).attr('cnttype');
	var cmd;
	
	switch(cnttype) {
		case 'equip':
			cmd = 'rimuovi &' + mrn;
			break;

		case 'pers':
			var cntmrn = $(obj).attr('cntmrn');
			cmd = 'rimuovi &'+mrn+' &'+cntmrn;
			if(whichTabIsOpen('#detailsdialog') == 1)
				cmd += '; @agg &'+cntmrn;
			break;

		default:
			return;
	}
	processCommands(cmd);
}


function toInventory(obj)
{
	var mrn = $(obj).attr('mrn');
	var cnttype = $(obj).attr('cnttype');
	var cmd;

	switch(cnttype) {
		case 'room':
			cmd = 'prendi &' + mrn;
			if(whichTabIsOpen('#detailsdialog') == 0)
				cmd += '; @agg';
			break;
			
		case 'equip':
			cmd = 'rimuovi &' + mrn;
			break;

		case 'obj':
			var cntmrn = $(obj).attr('cntmrn');
			cmd = 'prendi &'+mrn+' &'+cntmrn;
			if(whichTabIsOpen('#detailsdialog') == 2)
				cmd += '; @agg &'+cntmrn;
			break;

		case 'pers':
			var cntmrn = $(obj).attr('cntmrn');
			cmd = 'prendi &' + mrn+' &'+cntmrn;
			if(whichTabIsOpen('#detailsdialog') == 1)
				cmd += '; @agg &'+cntmrn;
			break;

		default:
			return;
	}
	processCommands(cmd);
}

function fromInventory(obj)
{
	var mrn = $(obj).attr('mrn');
	var cnttype = $(obj).attr('cnttype');
	var cmd;
	
	switch(cnttype) {
		case 'inv':
			cmd = 'posa &'+mrn;
			break;

		case 'equip':
			cmd = 'rimuovi &' + mrn+'; posa &'+mrn;
			break;

		case 'obj':
			var cntmrn = $(obj).attr('cntmrn');
			cmd = 'scarica &' + mrn+' &'+cntmrn;
			if(whichTabIsOpen('#detailsdialog') == 2)
				cmd += '; @agg &'+cntmrn;
			break;

		case 'pers':
			var cntmrn = $(obj).attr('cntmrn');
			cmd = 'scarica &' + mrn+' &'+cntmrn;
			if(whichTabIsOpen('#detailsdialog') == 1)
				cmd += '; @agg &'+cntmrn;
			break;
			
		default:
			return;
	}
/*
	if(whichTabIsOpen('#detailsdialog') == 0)
		cmd += '; @agg';
*/
	processCommands(cmd);
}


function toHand(obj)
{
	var mrn = $(obj).attr('mrn');
	var cnttype = $(obj).attr('cnttype');
	var cmd;
	
	switch(cnttype) {
		case 'room':
			cmd = 'prendi &'+mrn+'; impugna &'+mrn;
			if(whichTabIsOpen('#detailsdialog') == 0)
				cmd += '; @agg';
			break;

		case 'inv':
			cmd = 'impugna &'+mrn;
			break;

		case 'equip':
			cmd = 'sfodera &' + mrn;
			break;

		case 'obj':
			var cntmrn = $(obj).attr('cntmrn');
			cmd = 'prendi &'+mrn+' &'+cntmrn+'; impugna &'+mrn;
			if(whichTabIsOpen('#detailsdialog') == 2)
				cmd += '; @agg &'+cntmrn;
			break;

		default:
			return;
	}
	processCommands(cmd);
}

function fromHand(obj)
{
	var mrn = $(obj).attr('mrn');
	var cnttype = $(obj).attr('cnttype');
	var cmd;
	
	switch(cnttype) {
		case 'equip':
			cmd = 'riponi &' + mrn;
			break;

		default:
			return;
	}
	processCommands(cmd);
}


/* *****************************************************************************
 * IMAGES
 */

function imageInit()
{
	var pos = getWindowPosition('imagedialog');

	if(pos == null)
		pos = {my:"right bottom",at:"right bottom",of:desktop};

	$('#imagedialog').dialog({
		closeOnEscape:false,
		autoOpen:false,
		dialogClass:'tg-dialog notitle',
		width:208,
		height:178,
		resizable:false,
		draggable:false,
		dragStop: saveWindowData,
		position:pos
	});

	$('#imagedialog').dialog('widget').draggable({
		containment:"window",
		stop: saveWindowData
	});
	
	$('#image-cont').on('error', function() {
		// showImage($(this), 'tglogo.jpg');
	});
}

/* *****************************************************************************
 * OTHER COMMANDS
 */


function renderTable(t)
{
	var txt ='<table>';

	if(t.title && t.dialog == false)
		txt += '<caption>'+(t.plain ? t.title : addBannerStyle(t.title))+'</caption>';

	if(t.head) {
		txt += '<thead><tr>'

		$.each(t.head, function(i,v) {
			switch($.type(v)) {
			case "object":
				txt += '<th>'+v.title+'</th>';
				break;

			default:
				txt += '<th>'+v+'</th>';
				break;
			}
		});

		txt += '</tr></thead>';
	}

	if(t.data) {
		$.each(t.data, function(ri, row) {
			txt += '<tr>';
			$.each(row, function(di, elem) {

				var h = t.head ? t.head[di] : null;
				
				switch($.type(h)) {
					case "object":
						switch(h.type) {
							case "account":
								txt += '<td><a target="_blank" href="/admin/accounts/'+elem+'">'+elem+'</a></td>';
								break;

							case "ipaddr":
								txt += '<td><a target="_blank" href="http://www.infosniper.net/index.php?ip_address='+elem+'">'+elem+'</a></td>';
								break;

							case "icon":
								txt += '<td>'+renderIcon(elem)+'</td>';
								break;

							default:
								txt += '<td>'+elem+'</td>';
								break;
						}
						break;

					default:
						txt += '<td>'+elem+'</td>';
						break;
				}
			});
			txt += '</tr>';
		});
	}

	txt += '</table>';

	if(t.dialog == false)
		return t.plain ? txt : addFrameStyle(txt);

	renderInTableDialog(t.title ? t.title : "Informazioni", txt);
	
	if(t.head)
		$('#tablecont table').tablesorter();
		
	return '';
}

function renderCommandsList(cmd)
{
	var cols=6;
	var txt ='<table class="cmd"><caption>'+addBannerStyle(cmd.title)+'</caption>';

	delete cmd.title;

	$.each(cmd, function(group, data) {
		txt += '<tr><th colspan="'+cols+'">Comandi '+group+':</th></tr>';

		$.each(data.sort(), function(idx, command) {
			if(idx % cols == 0)
				txt += '<tr>';

			txt += '<td>'+command+'</td>';

			if(idx % cols == (cols-1) || idx == (data.length-1))
				txt += '</tr>';
		});
	});

	txt += '</table>';

	return addFrameStyle(txt, 'small');
}


function renderInTableDialog(title, txt)
{
	var options = {};
	
	if(!openDialog('#tabledialog')) {
		var pos = getWindowPosition('tabledialog');
		var size = getWindowSize('tabledialog');
		var w,h;

		if(size)
		{
			w = size[0];
			h = size[1];
		} else {
			w = 650;
			h = 600;
		}

		if(pos == null)
			pos = {my:"center",at:"center",of:desktop};

		options = {
			modal: false,
			width: w,
			height: h,
			minWidth:550,
			maxWidth:1000,
			minHeight:200,
			position: pos,
			dialogClass:'tg-dialog parch styledbuttons',
			dragStop: saveWindowData,
			resizeStop: saveWindowData,
			closeText: 'Chiudi'
		};
	}
	
	$.extend(options, { title:addBannerStyle(title) });

	$('#tablecont').empty().append(addFrameStyle(removeColors(txt), 'large'));
	$('#tabledialog').dialog(options);
}

function renderWorksList(wk)
{
	var txt ='<table class="list"><thead><tr><th>#</th><th style="width:50px"></th><th>Difficolt&agrave;</th><th>Puoi?</th><th>Descrizione</th></tr></thead><tbody>';

	for(var n=0; n < wk.list.length; n++)
	{
		txt += '<tr><td>'+(n+1)+'</td><td>'+renderIconWithSmallBorder(wk.list[n].icon,null,null,null, (wk.cmd ? wk.cmd+' '+(n+1) : null),'interact obj')+'</td><td>'+wk.list[n].diff+'</td><td><div class="checkbox'+(wk.list[n].cando ? ' checked' : '')+'"></div></td><td>'+wk.list[n].desc+'</td></tr>';
	}
	
	txt += '</tbody></table>';

	renderInTableDialog('Potresti '+wk.verb+':', txt);

	$('#tablecont table').tablesorter({
		headers: {
			1: {
				sorter: false
			},
			2: {
				sorter:'difficulties'
			},
			3: {
				sorter:'checks'
			},
			4: {
				sorter:'names'
			}
		}
	});
	
	return '';
}


function renderSkillsList(skinfo)
{
	var txt ='<table class="skills">';

	if (skinfo.dialog == false)
		txt += '<caption>'+addBannerStyle('Abilit&agrave; conosciute')+'</caption>';

	for(var groupname in skinfo)
	{
		txt += '<tr><td colspan="1000" class="skillsep">'+addBannerStyle(groupname, 'parch')+'</td></tr>';

		var group = skinfo[groupname];

		for(var skname in group)
		{
			txt += '<tr><th>'+skname+'</th>';

			var sk = group[skname];

			if('prac' in sk && 'theo' in sk)
				txt += '<td>'+prcBicolorBar(sk.prac, 'yellow', null, sk.theo, 'green', null)+'</td>';

			if('auto' in sk)
				txt += '<td>'+ (sk.auto ? 'autodidatta' : '') +'</td>';

			if('exp' in sk)
				txt += '<td>'+sk.exp+'</td>';

			if('check' in sk)
				txt += '<td>'+sk.check+'</td>';

			txt += '</tr>';
		}
	}

	txt += '</table>';

	if(skinfo.dialog == false)
		return addFrameStyle(txt, 'small');

	renderInTableDialog('Abilit&agrave; conosciute', txt);
	return '';
}

function renderPlayerStatus(status)
{
	var sttxt = '<table class="stats"><caption>'+addBannerStyle('Condizioni')+'</caption>';

	var colors = [
		{ val:15, txt:'red' },
		{ val:40, txt:'brown' },
		{ val:100, txt:'green' }
	];

	sttxt += '<tr><th>Salute</th><td><span class="'+prcLowTxt(status.hit, colors)+'">'+status.hit+'</span>%</td><td>0%&#160;'+prcBar(status.hit, 'red')+'&#160;100%</td></tr>';
	sttxt += '<tr><th>Movimento</th><td><span class="'+prcLowTxt(status.move, colors)+'">'+status.move+'</span>%</td><td>0%&#160;'+prcBar(status.move, 'green')+'&#160;100%</td></tr>';
	sttxt += '<tr><th>Fame</th><td><span class="'+prcLowTxt(status.food, colors)+'">'+status.food+'</span>%</td><td>0%&#160;'+prcBar(status.food, 'cookie')+'&#160;100%</td></tr>';
	sttxt += '<tr><th>Sete</th><td><span class="'+prcLowTxt(status.drink, colors)+'">'+status.drink+'</span>%</td><td>0%&#160;'+prcBar(status.drink, 'blue')+'&#160;100%</td></tr>';

	if(status.msg)
		sttxt += '<tr><td colspan=1000>'+status.msg+'</td></tr>';

	sttxt += '</table>';
	return addFrameStyle(sttxt, 'small');
}



/* *****************************************************************************
 * INFO
 */

var abiltxt = [
	{ val:6, txt:"Terribile"},
	{ val:14, txt:"Pessima"},
	{ val:24, txt:"Scarsa"},
	{ val:34, txt:"Discreta"},
	{ val:64, txt:"Normale"},
	{ val:74, txt:"Buona"},
	{ val:84, txt:"Ottima"},
	{ val:94, txt:"Eccellente"},
	{ val:100, txt:"Leggendaria"}
];

function renderPlayerInfo(info)
{
	var d = $('#infocontent');

	if(info.image)
		$('#infoimage', d).attr('src', images_path + '/' + info.image);
	$('#infotitle', d).text(info.title);
	if(info.adjective)
	{
		$('#infoadj', d).text(info.adjective);
		$('#changeadj').hide();
	} else {
		$('#infoadj', d).text('Nessuno');
		$('#changeadj').show();
	}
	
	$('#inforace', d).text(info.race.name);
	$('#infocult', d).text(info.cult);
	$('#infoethn', d).text(info.ethn);
	$('#inforelig', d).text(info.relig ? info.relig : 'Nessuna');
	$('#infoheight', d).text(info.height);
	$('#infosex', d).text(info.sex.name);
	$('#infocity', d).text(info.city ? info.city : "Nessuna");
	$('#infowgt', d).text(info.weight);
	$('#infoage', d).text(info.age);
	$('#infolang', d).text(info.lang);
	$('#infoborn', d).text(info.born);

	$('#infodesc', d).text(info.desc.replace(/([.:?!,])\s*\n/gm, '$1<p></p>').replace(/\n/gm, ' '));

	$('#raceimage', d).attr('class', race_to_class[info.race.code]+'_'+info.sex.code+' img');
	
	$('#infowil', d).width(limitPrc(info.abil.wil.prc)+"%");
	$('#infowillvl', d).text(prcLowTxt(info.abil.wil.prc, abiltxt));

	$('#infoint', d).width(limitPrc(info.abil.int.prc)+"%");
	$('#infointlvl', d).text(prcLowTxt(info.abil.int.prc, abiltxt));
	
	$('#infoemp', d).width(limitPrc(info.abil.emp.prc)+"%");
	$('#infoemplvl', d).text(prcLowTxt(info.abil.emp.prc, abiltxt));

	$('#infosiz', d).width(limitPrc(info.abil.siz.prc)+"%");
	$('#infosizlvl', d).text(prcLowTxt(info.abil.siz.prc, abiltxt));

	$('#infocon', d).width(limitPrc(info.abil.con.prc)+"%");
	$('#infoconlvl', d).text(prcLowTxt(info.abil.con.prc, abiltxt));

	$('#infostr', d).width(limitPrc(info.abil.str.prc)+"%");
	$('#infostrlvl', d).text(prcLowTxt(info.abil.str.prc, abiltxt));

	$('#infodex', d).width(limitPrc(info.abil.dex.prc)+"%");
	$('#infodexlvl', d).text(prcLowTxt(info.abil.dex.prc, abiltxt));

	$('#infospd', d).width(limitPrc(info.abil.spd.prc)+"%");
	$('#infospdlvl', d).text(prcLowTxt(info.abil.spd.prc, abiltxt));

	if(!openDialog('#infodialog')) {
		var pos = getWindowPosition('infodialog');
		var size = getWindowSize('infodialog');
		var w,h;

		if(size)
		{
			w = size[0];
			h = size[1];
		} else {
			w = 800;
			h = 600;
		}

		if(pos == null)
			pos = {my:"center",at:"center",of:desktop};

		$('#infodialog').dialog({
			modal: false,
			title: addBannerStyle('<div class="left iconslot sm"><div class="iconimg" id="infoicon"></div></div><div id="infotitle" class="ellipsed" style="width:87%;padding-left:15px">Informazioni</div>'),
			width: w,
			height: h,
			minWidth:700,
			minHeight:400,
			position: pos,
			dialogClass:'tg-dialog parch styledbuttons',
			dragStop: saveWindowData,
			resizeStop: saveWindowData,
			closeText: 'Chiudi'
		});
		
		$('#changedesc').button().click(function () {
			sendToServer('cambia desc');
		});

		$('#changeadj').button().click(function () {
			sendToServer('aggett list');
		});
		
		$('#infoimage').on('error', function () {
			$(this).hide();
		}).on('load', function () {
			$(this).show();
		});
	}
	
	$('#infotitle').text(info.name+', '+info.title);
	$('#infoicon').css('background-position', tileBgPos(info.icon));
	
	return '';
}


/* *****************************************************************************
 * PARSING FOR LOG
 */

function printPrompt(st)
{
	return '';
}

function printPage(p)
{
	return '<h3>'+p.title + '</h3><div>' + p.text.replace(/\n/gm, '<br>') + '</div>';
}

function printDecoratedDescription(type, condprc, moveprc, count, desc)
{
	var res = '['+ type[0] +']&#160;'+ desc.replace(/\n/gm, ' ');

	if (condprc || moveprc)
	{
		res += '&#160;{'
		if(condprc)
			res += 'pf'+condprc+'%';
		if(moveprc)
			res += 'mv'+moveprc+'%';
		res += '}'
	}

	if (count > 1)
		res += '&#160;[x' + count + ']';

	return res;
}


function printDetailsList(cont, type)
{
	var res = '';
	
	if(cont.list) {
		if(cont.title)
			res += '<p>'+cont.title+'</p>';
		
		for(var n=0; n < cont.list.length; n++)
		{
			var l = cont.list[n];
			res += printDecoratedDescription(type, l.condprc, l.mvprc, l.mrn ? l.mrn.length : 0, l.desc)+'<br>';
		}

		if(cont.title && (cont.list.length > 0 || cont.show === true))
			res += 'Niente.<br>';
	}

	return res;
}


function printDetails(info, type)
{
	var res = '';

	if(info.title)
		res += '<h3>'+capFirstLetter(info.title)+'</h3>';

	if(info.action)
		res += '<p>'+info.action+'</p>';

	/* Print description */
	if(info.desc)
	{
		if(info.desc.base)
			res += formatText(info.desc.base);

		if(info.desc.details)
			res += formatText(info.desc.details);

		if(info.desc.equip)
			res += formatText(info.desc.equip);
	}

	/* Print person list */
	if(info.perscont)
		res += printDetailsList(info.perscont, 'pers');

	/* Print objects list */
	if(info.objcont)
		res += printDetailsList(info.objcont, 'obj');

	/* Print equipment list */
	if(info.eqcont)
		res += printDetailsList(info.eqcont, 'obj');

	return res;
}

function printInventory(inv)
{
	if(inv.list.length == 0)
		return('<p>Non hai niente in inventario!</p>');
	else
		return '<h4>Il tuo inventario:</h4>' + removeColors(printDetailsList(inv, 'obj'));
}

function printEquipment(eq)
{
	var res = '';
	var eqcount = 0;
	
	$.each(equip_positions_by_name, function(posname, posdesc)
	{
		var eqdata = eq[posname];
		
		if(eqdata)
		{
			$.each(eqdata, function(idx, obj) {
				res += posdesc + ': ' + printDecoratedDescription('obj', obj.condprc, null, 1, obj.desc)+'<br>';
				eqcount++;
			});
		}
	});
	
	if(eqcount == 0)
		return '<p>Non hai equipaggiato nulla!</p>';
	else
		return '<p>Equipaggiamento:</p>' + res;
}

function printWorksList(wk)
{
	var txt ='<table><caption>Potresti '+wk.verb+':</caption>';

	txt += '<thead><tr><th>#</th><th>Difficolt&agrave;</th><th>Puoi?</th><th>Descrizione</th></tr></thead><tbody>';

	for(var n=0; n < wk.list.length; n++)
		txt += '<tr><td>'+(n+1)+'</td><td>'+wk.list[n].diff+'</td><td>'+(wk.list[n].cando ? 'si' : 'no')+'</td><td>'+wk.list[n].desc+'</td></tr>';

	txt += '</tbody></table>';

	return txt;
}

function printSkillsList(skinfo)
{
	var txt ='<table><caption>Abilit&agrave; conosciute</caption>';

	for(var groupname in skinfo)
	{
		txt += '<tr><td colspan="1000"><h3>'+groupname+'</h3></td></tr>';

		var group = skinfo[groupname];

		for(var skname in group)
		{
			txt += '<tr><th>'+skname+'</th>';

			var sk = group[skname];

			if('prac' in sk && 'theo' in sk)
				txt += '<td>'+sk.prac+'</td><td>'+sk.theo+'</td>';

			if('auto' in sk)
				txt += '<td>'+ (sk.auto ? 'autodidatta' : '') +'</td>';

			txt += '</tr>';
		}
	}

	txt += '</table>';

	return txt;
}

function printPlayerInfo(info)
{
	var abiltxt = [
        { val:6, txt:"Terribile"},
        { val:14, txt:"Pessima"},
        { val:24, txt:"Scarsa"},
        { val:34, txt:"Discreta"},
        { val:64, txt:"Normale"},
        { val:74, txt:"Buona"},
        { val:84, txt:"Ottima"},
        { val:94, txt:"Eccellente"},
        { val:100, txt:"Leggendaria"}
	];

	return '<table><caption>'+info.name+', '+info.title+'</caption>'
				+ '<tr><th>Descrizione</th><td colspan=3>'+info.desc.replace(/([.:?!,])\s*\n/gm, '$1<p></p>').replace(/\n/gm, ' ')+'</td></tr>'
				+ '<tr><th>Razza</th><td>'+info.race.name+'</td><th>Cultura</th><td>'+info.cult+'</td></tr>'
				+ '<tr><th>Etnia</th><td>'+info.ethn+'</td><th>Religione</th><td>'+(info.relig ? info.relig : 'nessuna')+'</td></tr>'
				+ '<tr><th>Altezza</th><td>'+info.height+' cm.</td><th>Sesso</th><td>'+info.sex.name+'</td></tr>'
				+ '<tr><th>Peso</th><td>'+info.weight+' pietre</td><th>Citt&agrave;</th><td>'+(info.city ? info.city : 'nessuna')+'</td></tr>'
				+ '<tr><th>Et&agrave;</th><td>'+info.age+' anni</td><th>Lingua</th><td>'+info.lang+'</td></tr>'
				+ '<tr><th>Nascita:</th><td colspan=3>'+info.born+'</td></tr>'
			+ '</table><table><caption>Caratteristiche:</caption>'
				+ '<tr><td colspan="3"><h4>Mente</h4></td></tr>'
				+ '<tr><th>Volontà</th><td>'+info.abil.wil.prc+'</td><td>'+prcLowTxt(info.abil.wil.prc, abiltxt)+'</td></tr>'
				+ '<tr><th>Intelligenza</th><td>'+info.abil.int.prc+'</td><td>'+prcLowTxt(info.abil.int.prc, abiltxt)+'</td></tr>'
				+ '<tr><th>Empatia</th><td>'+info.abil.emp.prc+'</td><td>'+prcLowTxt(info.abil.emp.prc, abiltxt)+'</td></tr>'
				+ '<tr><td colspan="3"><h4>Corpo</h4></td></tr>'
				+ '<tr><th>Taglia</th><td>'+info.abil.siz.prc+'</td><td>'+prcLowTxt(info.abil.siz.prc, abiltxt)+'</td></tr>'
				+ '<tr><th>Forza</th><td>'+info.abil.str.prc+'</td><td>'+prcLowTxt(info.abil.str.prc, abiltxt)+'</td></tr>'
				+ '<tr><th>Costituzione</th><td>'+info.abil.con.prc+'</td><td>'+prcLowTxt(info.abil.con.prc, abiltxt)+'</td></tr>'
				+ '<tr><td colspan="3"><h4>Agilità</h4></td></tr>'
				+ '<tr><th>Destrezza</th><td>'+info.abil.dex.prc+'</td><td>'+prcLowTxt(info.abil.dex.prc, abiltxt)+'</td></tr>'
				+ '<tr><th>Velocità</th><td>'+info.abil.spd.prc+'</td><td>'+prcLowTxt(info.abil.spd.prc, abiltxt)+'</td></tr>'
				+ '</table>';
}

function printPlayerStatus(status)
{
	var sttxt = '<h4>Condizioni</h4>';

	sttxt += '<p>Salute: '+status.hit+'</p>';
	sttxt += '<p>Movimento: '+status.move+'</p>';
	sttxt += '<p>Fame: '+status.food+'</p>';
	sttxt += '<p>Sete: '+status.drink+'</p>';

	if(status.msg)
		sttxt += '<p>'+status.msg+'</p>';

	return sttxt;
}

function printTable(t)
{
	t.plain = true;
	t.dialog = false;
	return renderTable(t);
}

function logInit()
{
	$('#logdialog').dialog({
		autoOpen: false,
		title: addBannerStyle("Registro connessione"),
		width: 800,
		minWidth:650,
		height: 600,
		minHeight: 300,
		modal: false,
		dialogClass:'tg-dialog styledbuttons parch'
	});
	
	$('#selectallbutton').button().click(function() {
		SelectText('logtext');
	});

	$('#savebutton').button().click(function() {
		saveLogs();
	});
	
	$('#cleanallbutton').button().click(function() {
		cleanLogs();
		if(client_options.log.enabled)
			startLogging();
	});
}

function cleanLogs()
{
	$('#logtext').empty();
}

function startLogging()
{
	logInfo.start = new Date();
	logAdd("<h1>Inizio log: " + logInfo.start.format('yyyy-mm-dd HH:MM:ss') + "</h1>");
	logInfo.saved = true;
}

function logAdd(text)
{
	logInfo.saved = false;
	$('#logtext').append(text);
}

function saveLogs()
{
	if(logInfo.start)
	{
		var lb = new Blob([$('#logtext').html()], {type: "text/plain;charset=utf-8"});
		saveAs(lb, logInfo.start.format('yyyy-mm-dd_HH:MM:ss')+"_thegate.html");
	}
}

function SelectText(element) {
    var doc = document
        , text = doc.getElementById(element)
        , range, selection
    ;
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();        
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function sorterInit()
{
	$.tablesorter.addParser({
		// set a unique id
		id: 'difficulties',
		is: function(s) {
			// return false so this parser is not auto detected
			return false;
		},
		format: function(s) {
			// format your data for normalization
			var difficulties = [
				"routine",
				"banale",
				"molto facile",
				"facile",
				"normale",
				"impegnativa",
				"difficile",
				"molto difficile",
				"arduo",
				"quasi impossibile",
				"miracolo"
			];
			
			return difficulties.indexOf(s);
		},
		// set type, either numeric or text
		type: 'numeric'
	});
        
	$.tablesorter.addParser({
		// set a unique id
		id: 'names',
		is: function(s) {
			// return false so this parser is not auto detected
			return false;
		},
		format: function(s) {
			// format your data for normalization
			return s.toLowerCase().replace(/^un[oa']? /,'');
		},
		// set type, either numeric or text
		type: 'text'
	});

	$.tablesorter.addParser({
		// set a unique id
		id: 'checks',
		is: function() {
			// return false so this parser is not auto detected
			return false;
		},
		format: function(s,t,c,i) {
			// format your data for normalization
			return $('div', c).is('.checked') ? 1 : 0;
		},
		// set type, either numeric or text
		type: 'numeric'
	});
}


/* *****************************************************************************
 * GENERIC TEXT DIALOG
 */

function genericDialogInit()
{
	$('#genericdialog-button').button().click(function() {
		closeDialog('#genericdialog');
	});

}

function genericDialog(title, content)
{
	var options
	var title = addBannerStyle(title ? title : "Notizia");
	var d = $('#genericdialog');

	$('#genericdialog-desc').html(content);

	if(isDialog(d)) {
		options = {	title: title };
	} else {
		options = {
			title: title,
			width: 600,
			height: 400,
			minWidth:400,
			minHeight: 300,
			modal: true,
			dialogClass:'tg-dialog styledbuttons parch',
			closeText: 'Annulla'
		};
	}

	d.dialog(options);
}

/* *****************************************************************************
 * GENERIC SELECTION DIALOG
 */

function selectDialogInit()
{
	$('#selectcancel').button().click(function() {
		closeDialog('#selectdialog');
	});

	$('#selectenter').button().click(function() {
		var cmd = $(this).attr('cmd');
		var val = $('#selectlist').val();
		if (cmd && val)
			sendToServer(cmd + ' ' + val);
		closeDialog('#selectdialog');
	});
}

function selectDialog(s)
{
	if (s.cmd)
	{
		var d = $('#selectdialog');
		
		if (s.desc)
			$('#selectdescription', d).text(s.desc);
		else
			$('#selectdescription', d).empty();

		if (s.prefix)
			$('#selectprefix', d).text(s.prefix);
		else
			$('#selectprefix', d).empty();

		
		var l = $('#selectlist', d);
		l.empty();
		
		if ($.isArray(s.list))
		{
			$.each(s.list, function(i, n) {
				o.append('<option>').attr('value', n.sel).text(n.show);
			});
		} else {
			$.each(s.list, function(k, v) {
				var g = $('<optgroup>').attr('label', k);
				
				l.append(g);
				
				$.each(v, function(i, n) {
					g.append($('<option>').attr('value', n.sel).text(n.show));
				});
			});
		}

		$('#selectenter').attr('cmd', s.cmd);
		$('#selectenter').attr('refresh', s.refresh);

		var options;
		var t = addBannerStyle(s.title ? s.title : "Seleziona");
		
		if(isDialog(d)) {
			options = {	title: t };
		} else {
			options = {
				title: t,
				width: 500,
				height: 300,
				minHeight: 300,
				minWidth:400,
				modal: true,
				dialogClass:'tg-dialog styledbuttons parch',
				closeText: 'Annulla'
			};
		}
			
		d.dialog(options);
	}
	
	return '';
}

/* *****************************************************************************
 * PROTOCOL PARSING
 */

/* Filter */

function addFilterTag(type,msg)
{
	return '<span class="'+type+'">'+msg+'</span>';
}


function handleRefresh(r)
{
	if(isDialogOpen('#'+r.dlg))
		sendToServer(r.cmd);
	return '';
}

function replaceColors(msg)
{
	msg = msg.replace(/&B/gm, '<span class="gray">');
	msg = msg.replace(/&R/gm, '<span class="lt-red">');
	msg = msg.replace(/&G/gm, '<span class="lt-green">');
	msg = msg.replace(/&Y/gm, '<span class="yellow">');
	msg = msg.replace(/&L/gm, '<span class="lt-blue">');
	msg = msg.replace(/&M/gm, '<span class="lt-magenta">');
	msg = msg.replace(/&C/gm, '<span class="lt-cyan">');
	msg = msg.replace(/&W/gm, '<span class="white">');
	msg = msg.replace(/&b/gm, '<span class="black">');
	msg = msg.replace(/&r/gm, '<span class="red">');
	msg = msg.replace(/&g/gm, '<span class="green">');
	msg = msg.replace(/&y/gm, '<span class="brown">');
	msg = msg.replace(/&l/gm, '<span class="blue">');
	msg = msg.replace(/&m/gm, '<span class="magenta">');
	msg = msg.replace(/&c/gm, '<span class="cyan">');
	msg = msg.replace(/&w/gm, '<span class="lt-white">');
	msg = msg.replace(/&-/gm, '</span>');

	return msg;
}

function removeColors(msg)
{
	return msg.replace(/&[BRGYLMCWbrgylmcw-]/gm, '');
}

/*
 * Lista tag:
 * %%					%
 * $$					$
 * &&					&
 * &x					input password mode
 * &e					input text mode
 * &oX					sky
 * &dXXXXXX				door status
 * &!au"X"				audio
 * &!st"X"				pc status
 * &!im"X"				image
 * &!img"X,X,X,X"		image with gamma R,G,B (TODO with CSS opacity)
 * &!logged				now in game
 * &*					clear screen
 * &!ce"X"				centered image
 * &!link"X,X"			link
 * &!ulink"X,X"			link with description
 * &!t"X"				title
 * &!d"X"				description
 * &n					repeat description
 * &!am"X,X,X,X,X,X"	mob with icon and description (icon, condition, count, mrn, desc)
 * &!ao"X,X,X,X,X,X"	object with icon and description (icon, condition, count, mrn, desc)
 * &!sm"X,X"			icon and mrn
 * &!si"X,X"			icon (with optional css class)
 * &!crlf""				Pause the output
 * &i					god
 * &IX					god invis level
 * &B					gray
 * &R					red
 * &G					lt-green
 * &Y					yellow
 * &L					lt-blue
 * &M					lt-magenta
 * &C					lt-cyan
 * &W					white
 * &b					black
 * &r					red
 * &g					green
 * &y					brown
 * &l					blue
 * &m					magenta
 * &c					cyan
 * &w					lt-white
 * &-					default
 * &!as"X"				stop sound? (TODO)
 * &!ed"X,X,X"			edit X char, title Y (TODO), old text
 * &!ea""				end edit?
 * &!eml"X"				email X (TODO)
 * &!o"X,X,X,X,X"		? (TODO)
 */


function preparseText(msg)
{
	// Remove -not-tags-
	msg = msg.replace(/\r/gm, '');
	msg = msg.replace(/&!!/gm, '');
	msg = msg.replace(/\$\$/gm, '$');
	msg = msg.replace(/%%/gm, '%');
	msg = msg.replace(/&&/gm, '&#38;');
	msg = msg.replace(/</gm, '&#60;');
	msg = msg.replace(/>/gm, '&#62;');

	return msg;
}

function parseForDisplay(msg)
{
	var pos;

	// Not repeated tags

	// Hide text (password)
	msg = msg.replace(/&x\n*/gm, function() {
		inputPassword();
		return '';
	});

	// Show text (normal input)
	msg = msg.replace(/&e\n*/gm, function() {
		inputText();
		return '';
	});

	// Sky picture
	msg = msg.replace(/&o.\n*/gm, function(sky) {
		var sky = sky.charAt(2);
		setSky(sky);
		return '';
	});

	// Exits info
	msg = msg.replace(/&d\d{6}\n*/gm, function(doors) {
		var doors = doors.substr(2, 6);
		setDoors(doors);
		return '';
	});

	// Audio
	msg = msg.replace(/&!au"[^"]*"\n*/gm, function(audio) {
		var audio = audio.slice(5, audio.lastIndexOf('"'));
		playAudio(audio);
		return '';
	});

	// Player status
	msg = msg.replace(/&!st"[^"]*"\n*/gm, function(status) {
		var st = status.slice(5, status.lastIndexOf('"')).split(',');
		return setStatus(st);
	});

	// Player status
	msg = msg.replace(/&!up"[^"]*"\n*/gm, function(update) {
		var ud = update.slice(5, status.lastIndexOf('"')).split(',');
		
		if(ud[0] > client_update.inventory.version)
			client_update.inventory.needed = true;

		if(ud[1] > client_update.equipment.version)
			client_update.equipment.needed = true;

		if(ud[2] > client_update.room.version)
			client_update.room.needed = true;
		
		return '';
	});

	// Image in side frame (with gamma)
	msg = msg.replace(/&!img"[^"]*"\n*/gm, function(image) {
		// var image = image.slice(6, image.lastIndexOf('"')).split(',');
		// showImageWithGamma(image[0], image[1], image[2], image[3]);
		return '';
	});

	// Image in side frame
	msg = msg.replace(/&!im"[^"]*"\n*/gm, function(image) {
		// var image = image.slice(5, image.lastIndexOf('"'));
		// showImage(image);
		return '';
	});

	// Player is logged in
	msg = msg.replace(/&!logged"[^"]*"/gm, function() {
		ingame = true;
		return '';
	});

	// Close the text editor
	msg = msg.replace(/&!ea"[^"]*"\n*/gm, function(options) {
		closeEditor();
		return '';
	});

	// Open the text editor
	msg = msg.replace(/&!ed"[^"]*"\n*/gm, function(options) {
		var options = options.slice(5, options.lastIndexOf('"')).split(',');
		var text = options.slice(2).toString().replace(/\n/gm, ' ');
		openEditor(options[0], options[1], text);
		return '';
	});

	// Map data
	msg = msg.replace(/&!map\{[\s\S]*?\}!/gm, function(map) {
		var map = $.parseJSON(map.slice(5, -1));
		updateMap(map);
		return '';
	});

	// Book
	msg = msg.replace(/&!book\{[\s\S]*?\}!/gm, function(b) {
		b = $.parseJSON(b.slice(6,-1));
		openBook(b);
		return '';
	});

	// List of commands
	msg = msg.replace(/&!cmdlst\{[\s\S]*?\}!/gm, function(cmd) {
		cmd = $.parseJSON(cmd.slice(8,-1).replace(/"""/,'"\\""'));
		return renderCommandsList(cmd);
	});

	// Generic page (title, text)
	msg = msg.replace(/&!page\{[\s\S]*?\}!/gm, function(p) {
		p = $.parseJSON(p.slice(6, -1)); /* .replace(/\n/gm,' ') */
		return addFrameStyle(addBannerStyle(p.title) + '<div class="text">' + p.text.replace(/\n/gm, '<br>') + '</div>');
	});

	// Generic table (title, head, data)
	msg = msg.replace(/&!table\{[\s\S]*?\}!/gm, function(t) {
		t = $.parseJSON(t.slice(7, -1));
		return renderTable(t);
	});

	// Inventory
	msg = msg.replace(/&!inv\{[\s\S]*?\}!/gm, function(inv) {
		inv = $.parseJSON(inv.slice(5, -1));
		renderInventory(inv);
		return '';
	});

	// Room details
	msg = msg.replace(/&!room\{[\s\S]*?\}!/gm, function(dtls) {
		dtls = $.parseJSON(dtls.slice(6, -1));
		return renderDetails(dtls, dtls.dir ? 'dir' : 'room');
	});

	// Person details
	msg = msg.replace(/&!pers\{[\s\S]*?\}!/gm, function(dtls) {
		dtls = $.parseJSON(dtls.slice(6, -1));
		return renderDetails(dtls, 'pers');
	});

	// Object details
	msg = msg.replace(/&!obj\{[\s\S]*?\}!/gm, function(dtls) {
		dtls = $.parseJSON(dtls.slice(5, -1).replace(/\n/gm, ' '));
		return renderDetails(dtls, 'obj');
	});

	// Equipment
	msg = msg.replace(/&!equip\{[\s\S]*?\}!/gm, function(eq) {
		eq = $.parseJSON(eq.slice(7, -1).replace(/\n/gm, '<br>'));
		renderEquipment(eq);
		return '';
	});

	// Workable lists
	msg = msg.replace(/&!wklst\{[\s\S]*?\}!/gm, function(wk) {
		wk = $.parseJSON(wk.slice(7, -1));
		return renderWorksList(wk);
	});

	// Skill list
	msg = msg.replace(/&!sklst\{[\s\S]*?\}!/gm, function(skinfo) {
		skinfo = $.parseJSON(skinfo.slice(7, -1));
		return renderSkillsList(skinfo);
	});

	// Player info
	msg = msg.replace(/&!pginf\{[\s\S]*?\}!/gm, function(info) {
		info = $.parseJSON(info.slice(7, -1));
		return renderPlayerInfo(info);
	});

	// Player status
	msg = msg.replace(/&!pgst\{[\s\S]*?\}!/gm, function(status) {
		status = $.parseJSON(status.slice(6, -1));
		return renderPlayerStatus(status);
	});

	// Selectable generic
	msg = msg.replace(/&!select\{[\s\S]*?\}!/gm, function(s) {
		s = $.parseJSON(s.slice(8, -1));
		return selectDialog(s);
	});

	// Refresh command
	msg = msg.replace(/&!refresh\{[\s\S]*?\}!/gm, function(t) {
		t = $.parseJSON(t.slice(9, -1));
		return handleRefresh(t);
	});

	// Pause scroll
	msg = msg.replace(/&!crlf"[^"]*"/gm, function() {
		pauseOn();
		return '';
	});

	// Clear message
	pos = msg.lastIndexOf('&*');
	if (pos >= 0)
	{
		clearOutput();
		msg = msg.slice(pos+2);
	}

	// Filterable messages
	msg = msg.replace(/&!m"(.*)"\{([\s\S]*?)\}!/gm, function(line,type,msg) {
		return addFilterTag(type, msg);
	});


	msg = msg.replace(/&!ce"[^"]*"/gm, function(image) {
		var image = image.slice(5, -1);
		return renderEmbeddedImage(image);
	});

	msg = msg.replace(/&!ulink"[^"]*"/gm, function(link) {
		var link = link.slice(8, -1).split(',');
		return renderLink(link[0], link[1]);
	});

	msg = msg.replace(/&!as"[^"]*"/gm, '');

	msg = msg.replace(/&!(ad|a)?m"[^"]*"/gm, function(mob) {
		var mob = mob.slice(mob.indexOf('"')+1, -1).split(',');
		var desc = mob.slice(5).toString();
		return renderMob(mob[0], mob[1], mob[2], mob[3], desc, 'interact pers');
	});

	msg = msg.replace(/&!(ad|a)?o"[^"]*"/gm, function(obj) {
		var obj = obj.slice(obj.indexOf('"')+1, -1).split(',');
		var desc = obj.slice(5).toString();
		return renderObject(obj[0], obj[1], obj[2], obj[3], desc, 'interact obj');
	});

	msg = msg.replace(/&!sm"[^"]*"/gm, function(icon) {
		var icon = icon.slice(5, -1).split(',');
		return renderIcon(icon[0], icon[1], 'room', null, null, 'interact pers');
	});

	msg = msg.replace(/&!si"[^"]*"/gm, function(icon) {
		var icon = icon.slice(5, -1).split(',');
		return renderIcon(icon[0],null,null,null,null,"v "+icon[1]);
	});

	msg = msg.replace(/&i/gm, function() {
		isgod = true;
		return '';
	});

	msg = msg.replace(/&I\d/gm, function(inv) {
		godinvlev = parseInt(inv.substr(2, 3));
		return '';
	});

	/* \r is already removed at top */
	msg = msg.replace(/\n/gm, '<br>');

	msg = '<p>'+replaceColors(msg)+'</p>';

	return msg.replace(/<p><\/p>/g, '');
}


function parseForLog(msg)
{
	// Not repeated tags

	msg = msg.replace(/&[xe]\n*/gm, '');
	msg = msg.replace(/&o.\n*/gm, '');
	msg = msg.replace(/&d\d{6}\n*/gm, '');
	msg = msg.replace(/&!au"[^"]*"\n*/gm, '');

	// Player status
	msg = msg.replace(/&!st"[^"]*"\n*/gm, function(status) {
		var st = status.slice(5, status.lastIndexOf('"')).split(',');
		return printPrompt(st);
	});

	msg = msg.replace(/&!up"[^"]*"\n*/gm, '');
	msg = msg.replace(/&!img"[^"]*"\n*/gm, '');
	msg = msg.replace(/&!im"[^"]*"\n*/gm, '');
	msg = msg.replace(/&!logged"[^"]*"/gm, '');
	msg = msg.replace(/&!e[ad]"[^"]*"\n*/gm, '');
	msg = msg.replace(/&!s[mi]"[^"]*"/gm, '');
	msg = msg.replace(/&!as"[^"]*"/gm, '');

	// Map data
	// TODO: Draw map?
	msg = msg.replace(/&!map\{[\s\S]*?\}!/gm, '');
	
	// Book
	msg = msg.replace(/&!book\{[\s\S]*?\}!/gm, '');

	// List of commands
	msg = msg.replace(/&!cmdlst\{[\s\S]*?\}!/gm, '');
	
	// Generic page (title, text)
	msg = msg.replace(/&!page\{[\s\S]*?\}!/gm, function(p) {
		p = $.parseJSON(p.slice(6, -1));
		return printPage(p)
	});
	
	// Generic table (title, head, data)
	msg = msg.replace(/&!table\{[\s\S]*?\}!/gm, function(t) {
		t = $.parseJSON(t.slice(7, -1));
		return printTable(t);
	});
	
	// Room details
	msg = msg.replace(/&!room\{[\s\S]*?\}!/gm, function(dtls) {
		dtls = $.parseJSON(dtls.slice(6, -1));
		return printDetails(dtls, 'room');
	});
	
	// Person details
	msg = msg.replace(/&!pers\{[\s\S]*?\}!/gm, function(dtls) {
		dtls = $.parseJSON(dtls.slice(6, -1));
		return printDetails(dtls, 'pers');
	});
	
	// Object details
	msg = msg.replace(/&!obj\{[\s\S]*?\}!/gm, function(dtls) {
		dtls = $.parseJSON(dtls.slice(5, -1).replace(/\n/gm, ' '));
		return printDetails(dtls, 'obj');
	});

	// Inventory
	msg = msg.replace(/&!inv\{[\s\S]*?\}!/gm, function(inv) {
		inv = $.parseJSON(inv.slice(5, -1));
		return printInventory(inv);
	});
		
	// Equipment
	msg = msg.replace(/&!equip\{[\s\S]*?\}!/gm, function(eq) {
		eq = $.parseJSON(eq.slice(7, -1).replace(/\n/gm, '<br>'));
		return printEquipment(eq);
	});
	
	// Workable lists
	msg = msg.replace(/&!wklst\{[\s\S]*?\}!/gm, function(wk) {
		wk = $.parseJSON(wk.slice(7, -1));
		return printWorksList(wk);
	});

	// Skill list
	msg = msg.replace(/&!sklst\{[\s\S]*?\}!/gm, function(skinfo) {
		skinfo = $.parseJSON(skinfo.slice(7, -1));
		return printSkillsList(skinfo);
	});

	// Player info
	msg = msg.replace(/&!pginf\{[\s\S]*?\}!/gm, function(info) {
		info = $.parseJSON(info.slice(7, -1));
		return printPlayerInfo(info);
	});

	// Player status
	msg = msg.replace(/&!pgst\{[\s\S]*?\}!/gm, function(status) {
		status = $.parseJSON(status.slice(6, -1));
		return printPlayerStatus(status);
	});

	// Refresh
	msg = msg.replace(/&!refresh\{[\s\S]*?\}!/gm, '');

	// Selectable generic
	msg = msg.replace(/&!select\{[\s\S]*?\}!/gm, '');

	msg = msg.replace(/&!crlf"[^"]*"/gm, '');
	msg = msg.replace(/&\*/gm, '');

	msg = msg.replace(/&!m"(.*)"\{([\s\S]*?)\}!/gm, function(line,type,msg) {
		return msg;
	});

	msg = msg.replace(/&!ce"[^"]*"/gm, '');

	msg = msg.replace(/&!ulink"[^"]*"/gm, function(link) {
		var link = link.slice(8, -1).split(',');
		return link[1];
	});

	msg = msg.replace(/&(i|I\d)/gm, '');

	msg = msg.replace(/\n/gm, '<br>');
	msg = '<p>'+removeColors(msg)+'</p>';

	return msg.replace(/<p><\/p>/g, '');
}


/* *****************************************************************************
 * MAIN
 */

var loader_assets = [
	"<%= image_url_from_assets_file('/loader/background.jpg') %>",
	"<%= image_url_from_assets_file('/loader/circle_shadow.png') %>",
	"<%= image_url_from_assets_file('/loader/circle.png') %>",
	"<%= image_url_from_assets_file('/loader/thegate_logo.png') %>"
];


var app_assets = [
	"<%= image_url_from_assets_file('/interface/background/deskback.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/iron-double-bl.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/iron-double-bm.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/iron-double-br.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/iron-double-ml.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/iron-double-mr.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/iron-double-tl.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/iron-double-tm.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/iron-double-tr.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/iron-single-bl.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/iron-single-bm.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/iron-single-br.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/iron-single-ml.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/iron-single-mr.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/iron-single-tl.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/iron-single-tm.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/iron-single-tr.png') %>",
	"<%= image_url_from_assets_file('/interface/tooltips/banner_body.png') %>",
	"<%= image_url_from_assets_file('/interface/tooltips/banner_left.png') %>",
	"<%= image_url_from_assets_file('/interface/tooltips/banner_right.png') %>",
	"<%= image_url_from_assets_file('/interface/status/bars.png') %>",
	"<%= image_url_from_assets_file('/interface/status/combat_panel.png') %>",
	"<%= image_url_from_assets_file('/interface/banners/body.png') %>",
	"<%= image_url_from_assets_file('/interface/banners/body_small.png') %>",
	"<%= image_url_from_assets_file('/interface/books/book.jpg') %>",
	"<%= image_url_from_assets_file('/interface/tooltips/bullet.png') %>",
	"<%= image_url_from_assets_file('/interface/buttons/buttonbar.png') %>",
	"<%= image_url_from_assets_file('/interface/buttons/buttons.png') %>",
	"<%= image_url_from_assets_file('/interface/buttons/back_block.png') %>",
	"<%= image_url_from_assets_file('/interface/buttons/buttons_sprite.png') %>",
	"<%= image_url_from_assets_file('/interface/banners/end_small.png') %>",
	"<%= image_url_from_assets_file('/interface/banners/ends.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/panel_large.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/panel_small.png') %>",
	"<%= image_url_from_assets_file('/interface/map/map_normal.png') %>",
	"<%= image_url_from_assets_file('/interface/sky/weather_l.png') %>",
	"<%= image_url_from_assets_file('/interface/map/map_small.png') %>",
	"<%= image_url_from_assets_file('/interface/sky/weather_m.png') %>",
	"<%= image_url_from_assets_file('/interface/map/map_tiny.png') %>",
	"<%= image_url_from_assets_file('/interface/sky/weather_s.png') %>",
	"<%= image_url_from_assets_file('/interface/map/pass_sprite.png') %>",
	"<%= image_url_from_assets_file('/interface/map/look_arrows.png') %>",
	"<%= image_url_from_assets_file('/interface/books/page_left.jpg') %>",
	"<%= image_url_from_assets_file('/interface/books/page_right.jpg') %>",
	"<%= image_url_from_assets_file('/interface/frame/paper1-bl.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/paper1-bm.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/paper1-br.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/paper1-ml.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/paper-mm.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/paper1-mr.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/paper1-tl.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/paper1-tm.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/paper1-tr.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/paper2-bl.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/paper2-bm.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/paper2-br.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/paper2-ml.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/paper2-mm.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/paper2-mr.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/paper2-tl.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/paper2-tm.png') %>",
	"<%= image_url_from_assets_file('/interface/frame/paper2-tr.png') %>",
	"<%= image_url_from_assets_file('/interface/buttons/pause-icon.png') %>",
	"<%= image_url_from_assets_file('/interface/buttons/play-icon.png') %>",
	"<%= image_url_from_assets_file('/interface/tooltips/tooltiprivet.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/dwarf_f.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/dwarf_m.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/elf_f.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/elf_m.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/goblin_f.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/goblin_m.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/halfling_f.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/halfling_m.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/human_f.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/human_m.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/orc_f.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/orc_m.png') %>",
	"<%= image_url_from_assets_file('/interface/status/obj_mob_health.png') %>",
	"<%= image_url_from_assets_file('/icons/tiles.png') %>",
	"<%= image_url_from_assets_file('/icons/tiles_m.png') %>",
	"<%= image_url_from_assets_file('/icons/tiles_s.png') %>",
	"<%= image_url_from_assets_file('/login/loading.gif') %>",
	"<%= image_url_from_assets_file('/login/scroll_header.png') %>",
	"<%= image_url_from_assets_file('/login/scroll_body.png') %>",
	"<%= image_url_from_assets_file('/login/scroll_footer.png') %>",
	"<%= image_url_from_assets_file('/login/black_banners.png') %>",
	"<%= image_url_from_assets_file('/login/loading.gif') %>",
	"<%= image_url_from_assets_file('/login/portrait_frame.png') %>",
	"<%= image_url_from_assets_file('/login/portrait_no_image.png') %>",
	"<%= image_url_from_assets_file('/interface/interact/elems.png') %>",
	"<%= image_url_from_assets_file('/interface/buttons/arrows.png') %>",
	"<%= image_url_from_assets_file('/interface/interact/cmds.png') %>",
	"<%= image_url_from_assets_file('/interface/buttons/filters.png') %>"
];

var creation_assets = [
	"<%= image_url_from_assets_file('/interface/buttons/smallbutton_left_right.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/select-race.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/dwarf_f_title.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/dwarf_m_title.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/elf_f_title.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/elf_m_title.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/goblin_f_title.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/goblin_m_title.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/halfling_f_title.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/halfling_m_title.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/human_f_title.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/human_m_title.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/orc_f_title.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/orc_m_title.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/select-race.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/dwarf_f_small.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/dwarf_m_small.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/elf_f_small.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/elf_m_small.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/goblin_f_small.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/goblin_m_small.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/halfling_f_small.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/halfling_m_small.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/human_f_small.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/human_m_small.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/orc_f_small.png') %>",
	"<%= image_url_from_assets_file('/interface/equip/orc_m_small.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/fighter.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/bard.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/fighter.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/worker.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/attributes.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/map.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/yes.png') %>",
	"<%= image_url_from_assets_file('/interface/creation/no.png') %>"
];

var login_heroes_assets = [
	"<%= image_url_from_assets_file('/login/hero0.png') %>",
	"<%= image_url_from_assets_file('/login/hero1.png') %>",
	"<%= image_url_from_assets_file('/login/hero2.png') %>",
	"<%= image_url_from_assets_file('/login/hero3.png') %>",
	"<%= image_url_from_assets_file('/login/hero4.png') %>",
	"<%= image_url_from_assets_file('/login/hero5.png') %>"
];



// Extension for ui 1.10 not allowing html in title



// Starting point
$(document).ready(function(){
	/*
	 * REQUIRED ONLY FOR JQ UI 1.10
	 */

	if($.ui.version.split('.')[1] == "12")
	{
		$.extend($.ui.dialog.prototype, {
			_title: function(title) {
				if ( !this.options.title ) {
					title.html( "&#160;" );
				}
				title.html(this.options.title)
			},
			_createTitlebar: function() {
				var uiDialogTitle;

				this.uiDialogTitlebar = $("<div>")
					.addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix")
					.prependTo( this.uiDialog );
				this._on( this.uiDialogTitlebar, {
					mousedown: function( event ) {
						// Don't prevent click on close button (#8838)
						// Focusing a dialog that is partially scrolled out of view
						// causes the browser to scroll it into view, preventing the click event
						if ( !$( event.target ).closest(".ui-dialog-titlebar-close") ) {
							// Dialog isn't getting focus when dragging (#8063)
							this.uiDialog.focus();
						}
				}
			});

			this.uiDialogTitlebarClose = $("<div></div>")
				.button({
					label: this.options.closeText,
					icons: {
						primary: "ui-icon-closethick"
					},
					text: false
				})
				.addClass("ui-dialog-titlebar-close")
				.appendTo( this.uiDialogTitlebar );
			this._on( this.uiDialogTitlebarClose, {
				click: function( event ) {
					event.preventDefault();
					this.close( event );
				}
			});

			uiDialogTitle = $("<span>")
				.uniqueId()
				.addClass("ui-dialog-title")
				.prependTo( this.uiDialogTitlebar );
			this._title( uiDialogTitle );

			this.uiDialog.attr({
				"aria-labelledby": uiDialogTitle.attr("id")
			});
		}

		});
	}


	// Load configuration as JSON
	$.cookie.json = true;

	// Cookie expiry 10 years
	$.cookie.defaults.expires=365*10;

	var cookie_consent = Load('cookie_consent');
	if (!cookie_consent) {

		$('#cookieconsentbutton').button().click(function() {
			Save('cookie_consent', true);
			$('#cookieconsentdialog').dialog('destroy');
			startClient();
		});

		$('#cookieconsentdialog').dialog({
			title: addBannerStyle("Informativa"),
			modal: true,
			resizable:true,
			width:500,
			height:500,
			dialogClass:'tg-dialog styledbuttons parch noclose'
		});
		$('#cookieconsentdialog').parent('.tg-dialog').css('zIndex', 10000);

	} else {
		startClient();
	}
});



function startClient() {

	// Load state
	var saved_state = $.cookie(cookiepre+'state');

	if (Modernizr.localstorage && saved_state)
	{
		Save('state', saved_state);
		$.cookie(cookiepre+'state', null);
	}
	else
	{
		saved_state = Load('state');
	}
	
	if(saved_state)
		client_state = $.extend(client_state, saved_state);
		
	if (!client_state.when)
	{
		client_state.when = new Date().getTime();
		Save('state', client_state);
	}

	// Load options
	var saved_options = $.cookie(cookiepre+'options');
	if (Modernizr.localstorage && saved_options)
	{
		Save('options', saved_options);
		$.cookie(cookiepre+'options', null);
	}
	else
	{
		saved_options = Load('options');
	}
	
	if(saved_options)
		client_options = $.extend(client_options, saved_options);

	// Check if we are on canvas or app
	if (window.location.pathname.indexOf('/fb/') == -1)
	{
		facebookMode = 'app';
		
		// Set auth for App
		facebookAuth = facebookAppAuth;
	}
	else
	{
		facebookMode = 'canvas';
		
		// Set auth for Canvas
		facebookAuth = facebookCanvasAuth;
		
		// Hide the logout button
		$('#logout').hide();
		
		// Hide the profile options
		$('#account-local-option').hide();
		
		// Hide the loca account form
		$('#local-account-form').hide();
	}

	// Start music
	audioInit();
	playAudio('thegate1.mp3');

	// Facebook integration

	// Load the FB SDK
	$.getScript('//connect.facebook.net/it_IT/sdk.js', function() {

		// Load after FB if in canvas mode
		if(facebookMode == 'canvas')
		{
			// Load loader assets
			$.imgpreload(loader_assets, {
				all: function() {
					// Show the intro
					$('.loader.window').show();

					setTimeout(load_app, 1000);
				}
			});
		}

		// Init and try login automatically
		FB.init({
			appId: facebookAuth.clientId,
			status: true,
			cookie: false,
			logging: false,
			version: 'v2.0',
			xfbml: true
		});

		// Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
		// for any authentication related change, such as login, logout or session refresh. This means that
		// whenever someone who was previously logged out tries to log in again, the correct case below 
		// will be handled.
		FB.Event.subscribe('auth.authResponseChange', function(response) {
			
			// Here we specify what we do with the response anytime this event occurs. 
			if (response.status === 'connected') {
				
				// The response object is returned with a status field that lets the app know the current
				// login status of the person. In this case, we're handling the situation where they 
				// have logged in to the app.
				var newToken = response.authResponse.accessToken;

				if (initialized)
				{
					if (facebookToken)
					{
						facebookAccountUpdate(newToken);
					}
					else
					{
						doFacebookLogin(response.authResponse.accessToken);
					}
				}
				facebookToken = newToken;
				
			} else if (response.status === 'not_authorized') {
				
				// In this case, the person is logged into Facebook, but not into the app
				
				facebookToken = null;
				
			} else {
				
				// In this case, the person is not logged into Facebook. Note that at this stage there
				// is no indication of whether they are logged into the app.
				
				facebookToken = null;
				
			}
		})
	})
	
	// Load in parallel to FB if in app mode
	if(facebookMode == 'app')
	{
		// Load loader assets
		$.imgpreload(loader_assets, {
			all: function() {
				// Show the intro
				$('.loader.window').show();

				setTimeout(load_app, 1000);
			}
		});
	}
}






function close_loader()
{
	$('#loader').remove();
}

function load_app() {

	var loaded=0, errors = 0;
	var assets = [];

	assets=assets.concat(app_assets, login_heroes_assets, creation_assets);

	$.imgpreload(assets, {
		each: function()
		{
			if($(this).data('loaded'))
				$('#loaderprc').text(Math.ceil(++loaded*100/assets.length));
			else
				errors++;
		},
		all: function()
		{
			if(errors > 0)
			{
				$('#loadermsg').text('Errore di caricamento. Per favore contatta lo staff di The Gate');
			}
			else
			{
				initApp();
			}
		}
	});
}


function initApp()
{
	outputInit();
	pauseButtonInit();
	outputSizeButtonInit();

	keyboardInit();
	doorsInit();
	mapInit();
	buttonbarInit();
	tooltipsInit();
	bookInit();
	configInit();
	logInit();

	editorDialogInit();
	equipInit(client_options.equipAsList);

	loginInit();
	interactionInit();
	textButtonsInit();
	creationInit();
	genericDialogInit();
	selectDialogInit();
	sorterInit();

	detailsInit();
	imageInit();

	if(client_options.noDetails)
	{
		closeDialog('#detailsdialog');
		openDialog('#imagedialog');
	} else {
		openDialog('#detailsdialog');
		closeDialog('#imagedialog');
		
		detailsResize.call($('#detailsdialog'));
	}

	main();
}


function leavePageAlertMessage() {
	return 'Se lasci questa pagina, perderai la connessione con The Gate. Per disconnettere correttamente il tuo personaggio, annulla la chiusura e digita il comando "fine"';
}

function setConnected()
{
	connected = true;
	$(window).bind('beforeunload', leavePageAlertMessage);
	$('#connectbutton').addClass('connected').attr('tooltip','Disconnessione');
}

function clearUpdate()
{
	client_update.inventory.version = -1;
	client_update.inventory.needed = false;
	client_update.equipment.version = -1;
	client_update.equipment.needed = false;
	client_update.room.version = -1;
	client_update.room.needed = false;
}

function setHandshaked()
{
/*
	if (!debug && connectionInfo.loginName)
		_gaq.push(['_trackEvent', 'Player', 'Connection', connectionInfo.loginName.toLowerCase(), 0, false]);
*/
	networkActivityOff();
	closeMainDialog();
	
	// Next connection will use normal login
	if (connectionInfo.mode == 'create')
	{
		connectionInfo.mode = 'login';
		connectionInfo.loginName = connectionInfo.data.name;
		connectionInfo.loginPass = connectionInfo.data.password;
		
		client_options.login = {
			name:connectionInfo.loginName,
			password:connectionInfo.loginPass
		};
		
		updateChars = true;
		resetCreationData();
	}
	
	focusInput();
	clearOutput();
	inputText();
	pauseOff();
	clearUpdate();
	
	if(client_options.log.clean)
		cleanLogs();

	if(client_options.log.enabled)
		startLogging();
}

function setDisconnected()
{
	connected = false;
	ingame = false;

	$(window).unbind('beforeunload', leavePageAlertMessage);
	$('#connectbutton').removeClass('connected').attr('tooltip','Connessione');
/*
	if(!debug && connectionInfo && connectionInfo.loginName)
		_gaq.push(['_trackEvent', 'Player', 'Disconnection', connectionInfo.loginName.toLowerCase(), 0, false]);
*/	
	if(client_options.log.save)
		saveLogs();
	
	closeAllDialogs();
	networkActivityOff();
	openMainDialog();
}

function ga_heartbeat(){
/*
	if(!debug)
	{
		if(connectionInfo && connectionInfo.loginName)
			_gaq.push(['_trackEvent', 'Player', 'Heartbeat', connected ? connectionInfo.loginName.toLowerCase() : '', 0, true]);
		setTimeout(ga_heartbeat, 60*1000);
	}
*/
}


function main_complete(success)
{
	initialized = true;
	openMainDialog();
	close_loader();
}


function main()
{
	/*
	var portarg = $(location).attr('href').match(/port=[^&]+/);
	if(portarg) {
		$.each(portarg, function(idx, val) {
			var portnum = parseInt(val.split('=')[1]);
			ws_server_addr = ':'+portnum+'/';
		});
	}
	*/

	directLogin = $(location).attr('href').search('tg') >= 0;

	
	var dbg = $(location).attr('href').match(/debug=[^&]+/);
	if(dbg) {
		$.each(dbg, function(idx, val) {
			var setting = val.split('=')[1];
			debug = setting == 'true';
		});
	}

	var dlg = $(location).attr('href').match(/direct=[^&]+/);
	if(dlg) {
		$.each(dlg, function(idx, val) {
			var setting = val.split('=')[1];
			directLogin = setting == 'true';
		});
	}
	
	var token = $(location).attr('href').match(/token=[^&]+/);
	if(token) {
		$.each(token, function(idx, val) {
			verify_token = decodeURIComponent(val.split('=')[1]);
		});
	}
	
	if(verify_token != null)
		window.history.replaceState(null,'',window.location.pathname);

	// ga_heartbeat();


	function completeFacebookLogin()
	{
		function next()
		{
			networkActivityMessage('');
			doFacebookLogin(facebookToken, main_complete);
		}
		
		accountLogout(next, next);
	}

	moveLoginPanel(directLogin ? 'assocchar' : 'account');
		
	if (verify_token != null)
	{
		// If an email and token have been specified, then it is verifying an email
		localAccountCheck(verify_token, function(data) {
			
			networkActivityMessage('');
			verify_email = data.email;
			$('#vfyemail').val(verify_email);		
			moveLoginPanel('verify');
			main_complete();
			
		}, function(error) {
			if (error.status == 400)
				networkActivityMessage("Errore nei dati della richiesta.");		
			else if (error.status == 404)
				moveLoginPanel('used');
			else
				networkActivityMessage("Errore di comunicazione con il server.");
			main_complete();
		});
	}
	else if (facebookToken != null)
	{
		// If there is a facebook token, connect with it
		completeFacebookLogin();
	}
	else if (facebookMode == 'canvas')
	{
		// If in canvas, handle login
		FB.getLoginStatus(function(response) {
			
			if (response.status === 'connected') {
				
				facebookToken = response.authResponse.accessToken;
				completeFacebookLogin();
				
			} else {
				
				FB.login(function(response) {
					if (response.authResponse) {
						
						facebookToken = response.authResponse.accessToken;
						completeFacebookLogin();
						
					} else {
						main_complete();
						genericDialog("Facebook è richiesto!", "<p>Questa App richiede la connessione a Facebook per poter giocare.</p><ul><li>Nessun dato personale sarà divulgato</li><li>Non verrà inviata alcuna email non richiesta sul tuo indirizzo</li><li>Non verrà pubblicato nulla su Facebook</li></ul><p>Per favore accedi a Facebook usando l'apposito pulsante.</p>");
					}
				}, { scope: 'public_profile,email' });
			}
		});
	}
	else if(!directLogin)
	{
		doLocalAccountAutoLogin(main_complete);
	}
	else
	{
		$('#associateback').hide();
		main_complete();
	}
}

function connectToServer()
{
	if(connectionInfo == null)
		return;
		
	connectionError = '';
	if(socket) {
		socket.destroy();
	}
	socket = io.connect(ws_server_addr, {
		'reconnect': false,
		'force new connection':true,
		'resource': socket_io_resource,
		'transports': ['polling']
	});

	socket.on('data', handleLoginData);

	socket.on('connect', function() {
		networkActivityMessage('Connessione avvenuta!');
		setConnected();
	});

	socket.on('connecting', function(t) {
/*
		if(!debug)
			_gaq.push(['_trackEvent', 'Connection', 'Transport', t, 0, true]);
*/
	});

	socket.on('error', function() {
		setDisconnected();
		loginError('Errore di connessione al server. Verifica il funzionamento della tua rete o riprova più tardi.')
	});

	socket.on('disconnect', function() {
		setDisconnected();
		if(!connectionInfo.error)
			networkActivityMessage('Connessione conclusa!');
	});
}

function performLogin()
{
	if (connectionInfo.mode == 'login')
	{
		sendToServer("login:"+connectionInfo.loginName+","+connectionInfo.loginPass+"\n");
	}
	else if (connectionInfo.mode == 'create')
	{
		sendToServer("create:"
					+connectionInfo.data.name.toString()+","
					+connectionInfo.data.password.toString()+","
					+(connectionInfo.data.email ? connectionInfo.data.email.toString() : '')+","
					+(connectionInfo.data.invitation ? connectionInfo.data.invitation.toString() : '')+","
					+connectionInfo.data.race_code.toString()+","
					+connectionInfo.data.sex.toString()+","
					+connectionInfo.data.culture.toString()+","
					+connectionInfo.data.start.toString()+","
					+connectionInfo.data.stats.strength.toString()+","
					+connectionInfo.data.stats.constitution.toString()+","
					+connectionInfo.data.stats.size.toString()+","
					+connectionInfo.data.stats.dexterity.toString()+","
					+connectionInfo.data.stats.speed.toString()+","
					+connectionInfo.data.stats.empathy.toString()+","
					+connectionInfo.data.stats.intelligence.toString()+","
					+connectionInfo.data.stats.willpower.toString()
					+"\n");
	}
}

function openMainDialog()
{
	openDialog('#'+connectionInfo.mode+'dialog');
}

function closeMainDialog()
{
	closeDialog('#'+connectionInfo.mode+'dialog');
}

function networkActivityOn()
{
	$('.networkroll').css('visibility','visible');
}

function networkActivityOff()
{
	$('.networkroll').css('visibility','hidden');
}


var login_reply_message = {
	'serverdown':'Il server di gioco è momentaneamente spento. Riprova più tardi.',
	'errorproto':'Errore di comunicazione con il server.',
	'errornonew':'In questo momento non è permessa la creazione di nuovi personaggi.',
	'invalidname':'Nome non valido.',
	'invalidpass':'Password non valida.',
	'loginerror':'Personaggio inesistente o password errata.',
	'staffonly':'In questo momento solo lo staff può collegarsi, riprova più tardi.',
	'plrreaderror':'Errore di lettura del personaggio.',
	'plrdisabled':'Il personaggio è stato disattivato.',
	'bannedip':'Connessione da un indirizzo bloccato.',
	'maxclients':'Il server ha raggiunto il massimo numero di connessioni, riprova più tardi.',
	'errorcoderequired':'Per creare un altro personaggio ti serve un codice di attivazione.',
	'errorinvalidcode':'Il codice di invito inserito non è valido. Verifica di averlo digitato correttamente.',
	'dupname':'Esiste già un personaggio con questo nome. Per favore scegli un nome diverso.',
	'invalidemail':'L\'indirizzo di email inserito non è valido.'
};


function handleLoginData(data)
{
	if(data.indexOf("&!connmsg{") == 0) {
		var end = data.indexOf('}!');
		var rep = $.parseJSON(data.slice(9, end+1));

		if(rep.msg) {
			console.log(rep.msg);
			switch(rep.msg) {
				case 'ready':
					sendOOB({ itime: client_state.when.toString(16) });
					break;

				case 'enterlogin':
					performLogin();
					break;

				case 'shutdown':
					networkActivityMessage('Attenzione, il server sarà spento entro breve per manutenzione.');
					performLogin();
					break;

				case 'reboot':
					networkActivityMessage('Attenzione, il server sarà riavviato entro breve.');
					performLogin();
					break;

				case 'created':
				case 'loginok':
					completeHandshake();
					handleServerData(data.slice(end+2));
					
					if(!directLogin)
					{
						if (updateChars)
						{
							doUpdateCharacters();
						}
						
						moveLoginPanel('login');
					}
					break;

				default:
					var connectionError = login_reply_message[rep.msg];
					if(!connectionError)
						connectionError = login_reply_message['errorproto'];

					loginError(connectionError);
					break;
			}
		}
	}
}


function completeHandshake()
{
	// Substitute with the normal data handler
	socket.removeListener('data', handleLoginData);
	socket.on('data', handleServerData);
	setHandshaked();
}

function handleServerData(msg)
{
	netdata += msg;
	var len = netdata.length;

	if(netdata.indexOf("&!!", len - 3) !== -1) {
		var data = preparseText(netdata.substr(0, len-3));
		
		if(debug) {
			showOutput(parseForDisplay(data));
		} else try {
			showOutput(parseForDisplay(data));
		} catch(err) {
			console.log(err.message);
		}

		if(client_options.log.enabled)
		{
			if(debug) {
				logAdd(parseForLog(data));
			} else try {
				logAdd(parseForLog(data));
			} catch(err) {
				console.log(err.message);
			}
		}
		
		netdata = '';
		
		var now = Date.now();
		
		if(now > client_update.last + 1000)
		{
			if (client_update.inventory.needed && isDialogOpen('#invdialog'))
			{
				sendToServer('@inv');
				client_update.inventory.needed = false;
				client_update.last = now;
			}

			if (client_update.equipment.needed && isDialogOpen('#equipdialog'))
			{
				sendToServer('@equip');
				client_update.equipment.needed = false;
				client_update.last = now;
			}

			if (client_update.room.needed && whichTabIsOpen('#detailsdialog') == 0)
			{
				sendToServer('@agg');
				client_update.room.needed = false;
				client_update.last = now;
			}			
		}
		
	} else if(len > 200000) {
		showOutput('<br>Errore di comunicazione con il server!<br>');
		netdata = '';
		setDisconnected();
	}
}

function disconnectFromServer()
{
	if(connected)
	{
		if(ingame)
			sendToServer(historyPush('fine'));
		else
			socket.disconnect();
	}
}
