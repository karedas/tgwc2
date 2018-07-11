/*
 * Copyright (c) 2013-2014 Tempus (Marco Braga), All Rights Reserved
 * The Gate MUD webclient
 * http://www.thegatemud.it
 *
 */
var ws_server_addr = "http://";

var socket_io_resource = "51.38.185.84/socket.io";

var media_server_addr = "./assets";

var ws_prefix = "/";

var images_path = media_server_addr + ws_prefix + "images";

var sounds_path = media_server_addr + ws_prefix + "sounds";

var maxmapwidth = 9;

var maxmapheight = 9;

var maptilewidth = 32;

var maptileheight = 32;

var maplight;

var mapidprefix = "mp";

var mapctx = null;

var maptileimg = null;

var mapshadowimg = [];

var maprainimg = null;

var mapsnowimg = null;

var mapfogimg = null;

var cursoronmap = false;

var mapsizedata = {
    map_n: {
        dialogClass: null,
        width: 360,
        height: 375
    },
    map_m: {
        dialogClass: "small",
        width: 287,
        height: 295
    },
    map_s: {
        dialogClass: "tiny",
        width: 216,
        height: 225
    }
};

var layermap = new Array(maxmapheight);

for (var y = 0; y < maxmapheight; ++y) {
    layermap[y] = new Array(maxmapwidth);
}

var max_history_length = 40;

var cmd_history_pos = 0;

var cmd_history = [];

var socket;

var connected = false;

var isgod = false;

var godinvlev = 0;

var netdata = "";

var exp_grp_list = {};

var max_exp_grp = 15;

var dir_north = 0;

var dir_east = 1;

var dir_south = 2;

var dir_west = 3;

var dir_up = 4;

var dir_down = 5;

var dir_names = [ "nord", "est", "sud", "ovest", "alto", "basso" ];

var dir_status = "000000";

var cmd_prefix = "";

var autoscroll_enabled = true;

var in_editor = false;

var dragging = false;

var max_drop_stack = null;

var at_drag_stop_func = null;

var debug = true;

var directLogin = false;

var verify_email, verify_token;

var user_account_data;

var enabled_chars_count = 0;

var last_room_desc = "";

var output_size_options = [ {
    name: "Piccolissimo",
    class: "xs"
}, {
    name: "Piccolo",
    class: "s"
}, {
    name: "Medio",
    class: "m"
}, {
    name: "Grande",
    class: "l"
}, {
    name: "Grandissimo",
    class: "xl"
}, {
    name: "Gigantesco",
    class: "xxl"
}, {
    name: "Enorme",
    class: "xxxl"
} ];

var wgttxtcol = [ {
    val: 80,
    txt: "orangered"
}, {
    val: 60,
    txt: "yellow"
}, {
    val: 0,
    txt: "greenyellow"
} ];

var wgtbarcol = [ {
    val: 80,
    txt: "red"
}, {
    val: 60,
    txt: "yellow"
}, {
    val: 0,
    txt: "green"
} ];

var hlttxtcol = [ {
    val: 25,
    txt: "orangered"
}, {
    val: 50,
    txt: "yellow"
}, {
    val: 100,
    txt: "greenyellow"
} ];

var eqracesex = "";

var lastEquip;

var cookiepre = "tgwc_";

var client_state = {
    window: {}
};

var client_options = {
    musicVolume: 70,
    soundVolume: 100,
    output: {
        textSize: 2,
        trimLines: 500
    },
    shortcuts: [],
    login: {},
    details: {
        compact: false,
        size: "icons_n"
    },
    combatFilter: 0,
    equipAsList: false,
    noDetails: false,
    log: {
        enabled: true,
        save: false,
        clean: true
    },
    map: {
        size: "map_n",
        sight: false
    },
    buttonsOnTop: false,
    textOnTop: false
};

var loginPortraitTimer;

var currentPortrait = Math.floor(Math.random() * 6 + 1);

var initialized = false;

var ingame = false;

var updateChars = false;

var facebookMode;

var facebookToken;

var facebookCanvasAuth = {
    clientId: "374791275967976",
    loginURL: "/api/facebook-canvas/login",
    linkURL: "/api/facebook-canvas/link"
};

var facebookAppAuth = {
    clientId: "654838687898957",
    loginURL: "/api/facebook/login",
    linkURL: "/api/facebook/link"
};

var facebookAuth = null;

var connectionInfo = {
    mode: "login",
    error: null
};

var logInfo = {
    start: null,
    saved: true
};

var shortcuts_map = {};

var in_combat = false;

var enemy_icon = 0;

var filter_out = [];

var filter_in = [];

var combat_filters = [ {
    name: "niente",
    filter_in: [ ".o_cmb_m", ".o_cmb_n", ".o_cmb_h" ],
    filter_out: []
}, {
    name: "mancato",
    filter_in: [ ".o_cmb_n", ".o_cmb_h" ],
    filter_out: [ ".o_cmb_m" ]
}, {
    name: "mancato e bloccato",
    filter_in: [ ".o_cmb_h" ],
    filter_out: [ ".o_cmb_m", ".o_cmb_n" ]
}, {
    name: "tutto",
    filter_in: [],
    filter_out: [ ".o_cmb_m", ".o_cmb_n", ".o_cmb_h" ]
} ];

var client_update = {
    last: 0,
    inventory: {
        version: -1,
        needed: false
    },
    equipment: {
        version: -1,
        needed: false
    },
    room: {
        version: -1,
        needed: false
    }
};

function Load(what) {
    what = cookiepre + what;
    if (Modernizr.localstorage) {
        var data = localStorage[what];
        return data ? JSON.parse(data) : null;
    } else return $.cookie(what);
}

function Save(what, value) {
    what = cookiepre + what;
    if (Modernizr.localstorage) localStorage[what] = JSON.stringify(value); else $.cookie(what, value);
}

function capFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function closeDialog(dialogid) {
    var d = $(dialogid);
    if (d.is(":data(uiDialog)")) return d.dialog("close");
    return null;
}

function openDialog(dialogid) {
    var d = $(dialogid);
    if (d.is(":data(uiDialog)")) return d.dialog(d.dialog("isOpen") ? "moveToTop" : "open");
    return null;
}

function isDialogOpen(dialogid) {
    var d = $(dialogid);
    return d.is(":data(uiDialog)") && d.dialog("isOpen");
}

function isDialog(dialogid) {
    var d = $(dialogid);
    return d.is(":data(uiDialog)");
}

function whichTabIsOpen(dialogid) {
    if (isDialogOpen(dialogid)) return $(dialogid).tabs("option", "active");
    return null;
}

function closeAllDialogs() {
    abortEdit();
    closeDialog("#equipdialog");
    closeDialog("#invdialog");
    closeDialog("#bookdialog");
    closeDialog("#configdialog");
    closeDialog("#infodialog");
    closeDialog("#selectdialog");
    closeDialog("#logdialog");
    closeDialog("#tabledialog");
}

function toggleDialog(dialogid) {
    if (isDialogOpen(dialogid)) closeDialog(dialogid); else openDialog(dialogid);
}

function editorDialogInit() {
    $("#editorcancel").button().click(function() {
        abortEdit();
    });
    $("#editorsave").button().click(function() {
        saveEdit(80);
    });
}

function closeEditor() {
    in_editor = false;
    $("#editordialog").dialog("close");
    focusInput();
}

function saveEdit(maxlinelen) {
    var text = $("#editortext").val().split("\n");
    for (var l = 0; l < text.length; l++) {
        var remtext = text[l];
        while (remtext.length > 0) {
            var currline;
            var slicepos = remtext.lastIndexOf(" ", maxlinelen);
            if (slicepos > 0) {
                currline = remtext.slice(0, slicepos) + "\\";
                remtext = remtext.slice(slicepos);
            } else {
                currline = remtext;
                remtext = "";
            }
            sendToServer("##ce" + currline);
        }
    }
    sendToServer("##ce_save");
}

function abortEdit() {
    if (in_editor) sendToServer("##ce_abort");
}

function openEditor(maxchars, title, text) {
    $("#editortext").val(text);
    $("#editortextmax").text(maxchars);
    $("#editortext").NobleCount("#editortextcount", {
        max_chars: parseInt(maxchars),
        on_positive: "green",
        on_negative: "red",
        block_negative: true
    });
    var options;
    if (isDialog("#editordialog")) {
        options = {
            title: addBannerStyle(title)
        };
    } else {
        options = {
            title: addBannerStyle(title),
            width: 600,
            height: 500,
            modal: true,
            dialogClass: "tg-dialog styledbuttons parch",
            close: function() {
                abortEdit();
            },
            closeText: "Annulla"
        };
    }
    $("#editordialog").dialog(options);
    in_editor = true;
}

function debug(txt) {
    $("#debug").text(txt);
}

function commandOrCloseDialog(d, c) {
    if (isDialogOpen(d)) closeDialog(d); else sendToServer(historyPush(c));
}

function keyboardInit() {
    $("#mapdialog").mouseenter(function() {
        cursoronmap = true;
    });
    $("#mapdialog").mouseleave(function() {
        cursoronmap = false;
    });
    $(document).on("keydown", function(event) {
        if (!connected) return true;
        if (event.metaKey || event.ctrlKey) return true;
        if (event.which == 27) {
            closeAllDialogs();
            return false;
        }
        if (in_editor) {
            return true;
        }
        if (event.altKey) {
            if (event.which >= 48 && event.which <= 57) {
                processCommands(String.fromCharCode(event.which));
                event.preventDefault();
                return false;
            }
            switch (String.fromCharCode(event.which)) {
              case "I":
                commandOrCloseDialog("#invdialog", "invent");
                return false;

              case "E":
                commandOrCloseDialog("#equipdialog", "equip");
                return false;

              case "M":
                sendToServer(historyPush("monete"));
                openDialog("#textdialog");
                return false;

              case "S":
                sendToServer(historyPush("stato"));
                openDialog("#textdialog");
                return false;

              case "A":
                commandOrCloseDialog("#tabledialog", "abilit");
                return false;

              case "N":
                commandOrCloseDialog("#infodialog", "info");
                return false;

              case "D":
                toggleDialog("#detailsdialog");
                return false;

              case "R":
                toggleDialog("#logdialog");
                return false;

              case "F":
                $(document).toggleFullScreen();
                return false;
            }
        }
        if (event.altKey || cursoronmap) {
            switch (event.which) {
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
        if ($(event.target).is("#inputline") === true) {
            if (event.which == 13) {
                sendInput();
                pauseOff();
                return false;
            }
            if (event.which == 49 && event.shiftKey === true && $(event.target).val().length == 0) {
                var l = cmd_history.length;
                if (l > 0) processCommands(cmd_history[l - 1]);
                return false;
            }
            switch (event.which) {
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
        if (!$(event.target).is("input")) focusInput();
        return true;
    });
}

function setWindowPosition(id, left, top) {
    if (client_state.window[id] == null) client_state.window[id] = {};
    client_state.window[id].position = [ left, top ];
}

function getWindowPosition(id) {
    if (client_state.window[id] == null) return null;
    return client_state.window[id].position;
}

function setWindowSize(id, width, height) {
    if (client_state.window[id] == null) client_state.window[id] = {};
    client_state.window[id].size = [ width, height ];
}

function getWindowSize(id) {
    if (client_state.window[id] == null) return null;
    return client_state.window[id].size;
}

function saveWindowData(event, obj) {
    var id;
    switch (event.type) {
      case "dialogdragstop":
        id = event.target.id;
        setWindowPosition(id, obj.position.left, obj.position.top);
        break;

      case "dragstop":
        id = $(event.target).children(".ui-dialog-content").attr("id");
        setWindowPosition(id, obj.position.left, obj.position.top);
        break;

      case "dialogresizestop":
        id = event.target.id;
        setWindowPosition(id, obj.position.left, obj.position.top);
        setWindowSize(id, obj.size.width, obj.size.height);
        break;

      case "resizestop":
        id = $(event.target).children(".ui-dialog-content").attr("id");
        setWindowPosition(id, obj.position.left, obj.position.top);
        setWindowSize(id, obj.size.width, obj.size.height);
        break;
    }
    Save("state", client_state);
}

function updateInput() {
    var text = cmd_history[cmd_history_pos] ? cmd_history[cmd_history_pos] : "";
    $("#inputline").val(text).focus();
}

function historyTop() {
    if (cmd_history_pos > 0) {
        cmd_history_pos = 0;
        updateInput();
    }
}

function historyBottom() {
    if (cmd_history_pos < cmd_history.length) {
        cmd_history_pos = cmd_history.length;
        updateInput();
    }
}

function historyUp() {
    if (cmd_history_pos > 0) {
        cmd_history_pos--;
        updateInput();
    }
}

function historyDown() {
    if (cmd_history_pos < cmd_history.length) {
        cmd_history_pos++;
        updateInput();
    }
}

function historyPush(text) {
    if (text.length > 0) {
        if (cmd_history.length >= max_history_length) cmd_history.shift();
        if (cmd_history.length == 0 || cmd_history[cmd_history.length - 1] != text) cmd_history.push(text);
        cmd_history_pos = cmd_history.length;
        $("#inputline").val("");
    }
    return text;
}

function inputPassword() {
    $("#inputline").get(0).type = "password";
    $("#inputline").focus();
}

function inputText() {
    $("#inputline").get(0).type = "text";
    $("#inputline").focus();
}

function updateShortcutsMap() {
    shortcuts_map = {};
    for (var idx = 0; idx < client_options.shortcuts.length; ++idx) if (client_options.shortcuts[idx] && client_options.shortcuts[idx].alias && client_options.shortcuts[idx].alias.length) shortcuts_map[client_options.shortcuts[idx].alias] = idx;
}

function substShort(input) {
    var args = input.split(/\s+/);
    var shortcut_key = args.shift();
    var shortcut_num = parseInt(shortcut_key);
    var shortcut_cmd;
    if (!isNaN(shortcut_num)) shortcut_cmd = client_options.shortcuts[shortcut_num]; else if (typeof shortcuts_map[shortcut_key] != "undefined") shortcut_cmd = client_options.shortcuts[shortcuts_map[shortcut_key]];
    if (shortcut_cmd) {
        input = shortcut_cmd.cmd;
        if (/\$\d+/.test(input)) {
            for (var arg = 0; arg < args.length; ++arg) {
                var rx = new RegExp("\\$" + (arg + 1), "g");
                input = input.replace(rx, args[arg]);
            }
            input = input.replace(/\$\d+/g, "");
        } else input += " " + args.join(" ");
    }
    if (cmd_prefix.length > 0) input = cmd_prefix + " " + input;
    return input;
}

function parseInput(input) {
    var inputs = input.split(/\s*;\s*/);
    var res = [];
    for (var i = 0; i < inputs.length; ++i) {
        var subs = substShort(inputs[i]).split(/\s*;\s*/);
        res = res.concat(subs);
    }
    return res;
}

function sendToServer(text) {
    if (!connected) return;
    socket.emit("data", text);
}

function sendOOB(data) {
    if (!connected) return;
    socket.emit("oob", data);
}

function processCommands(text) {
    if (ingame) {
        var cmds = parseInput(text);
        if (cmds) {
            historyPush(text);
            for (var i = 0; i < cmds.length; i++) sendToServer(cmds[i]);
        }
    } else {
        sendToServer(text);
        $("#inputline").val("").focus();
    }
}

function sendInput() {
    processCommands($("#inputline").val());
}

function focusInput() {
    $("#inputline").focus();
}

function pauseButtonInit() {
    $("#pausebutton").button({
        text: false,
        icons: {
            primary: "ui-icon-custom-pause"
        }
    }).click(function() {
        if (autoscroll_enabled) pauseOn(); else pauseOff();
    });
}

function pauseOn() {
    if (autoscroll_enabled) {
        autoscroll_enabled = false;
        $("#pausebutton").button("option", "icons", {
            primary: "ui-icon-custom-play"
        });
    }
}

function pauseOff() {
    if (!autoscroll_enabled) {
        autoscroll_enabled = true;
        $("#pausebutton").button("option", "icons", {
            primary: "ui-icon-custom-pause"
        });
    }
}

function setOutputSize(new_size) {
    var old_size = client_options.output.textSize;
    var old_class = output_size_options[old_size].class;
    var new_class = output_size_options[new_size].class;
    var input = $("#input");
    var resizabletext = $(".resizabletext");
    if (old_class) input.removeClass(old_class);
    input.addClass(new_class);
    if (old_class) resizabletext.removeClass(old_class);
    resizabletext.addClass(new_class);
    client_options.output.textSize = new_size;
    Save("options", client_options);
}

function outputSizeButtonInit() {
    $("#outputsizebutton").button({
        text: false
    }).click(function() {
        setOutputSize((client_options.output.textSize + 1) % output_size_options.length);
        focusInput();
    });
}

var current_login_panel;

function updateServerStats(s) {
    var txt = "<table><tr><td>Giocatori online:</td><td>" + s.players.length + "</td></tr>";
    $.each(s.races, function(k, v) {
        if (typeof races[k] !== "undefined") txt += "<tr><td>" + races[k] + "</td><td>" + v + "</td></tr>";
    });
    txt += "</table>";
    $("#online").html(txt);
}

function loginErrorClean() {
    connectionInfo.error = null;
}

function loginError(msg) {
    connectionInfo.error = msg;
    networkActivityMessage(msg);
}

function networkActivityMessage(msg) {
    $(".networkmessage").text(msg);
}

function localAccountLogin(loginData, success, error) {
    networkActivityMessage("Accesso all'account...");
    $.ajax({
        url: "/api/local/login",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(loginData),
        dataType: "json",
        success: success,
        error: error,
        beforeSend: networkActivityOn,
        complete: networkActivityOff
    });
}

function localAccountRequest(email, success, error) {
    networkActivityMessage("Invio dell'email in corso...");
    $.ajax({
        url: "/api/local/request",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            email: email
        }),
        dataType: "json",
        success: success,
        error: error,
        beforeSend: networkActivityOn,
        complete: networkActivityOff
    });
}

function localAccountVerify(email, token, name, password, success, error) {
    networkActivityMessage("Creazione dell'account in corso...");
    $.ajax({
        url: "/api/local/verify",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            email: email,
            token: token,
            name: name,
            password: password
        }),
        dataType: "json",
        success: success,
        error: error,
        beforeSend: networkActivityOn,
        complete: networkActivityOff
    });
}

function localAccountCheck(token, success, error) {
    networkActivityMessage("Verifica della richiesta in corso...");
    $.ajax({
        url: "/api/local/token/" + token,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: success,
        error: error,
        beforeSend: networkActivityOn,
        complete: networkActivityOff
    });
}

function localAccountLink(email, success, error) {
    networkActivityMessage("Invio dell'email in corso...");
    $.ajax({
        url: "/api/local/link",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            email: email
        }),
        dataType: "json",
        success: success,
        error: error,
        beforeSend: networkActivityOn,
        complete: networkActivityOff
    });
}

function changePassword(newpassword, success, error) {
    $.ajax({
        url: "/api/local/login",
        type: "PUT",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            password: newpassword
        }),
        success: success,
        error: error,
        beforeSend: networkActivityOn,
        complete: networkActivityOff
    });
}

function facebookAccountLogin(token, success, error) {
    networkActivityMessage("Accesso all'account...");
    if (!facebookAuth) {
        console.log("facebookAuth not set");
        return;
    }
    $.ajax({
        url: facebookAuth.loginURL,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            access_token: token
        }),
        dataType: "json",
        success: success,
        error: error
    });
}

function facebookAccountUpdate(token, success, error) {
    if (!facebookAuth) {
        console.log("facebookAuth not set");
        return;
    }
    $.ajax({
        url: facebookAuth.loginURL,
        type: "PUT",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            access_token: token
        }),
        dataType: "json",
        success: success,
        error: error
    });
}

function facebookAccountLink(token, success, error) {
    if (!facebookAuth) {
        console.log("facebookAuth not set");
        return;
    }
    $.ajax({
        url: facebookAuth.linkURL,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            access_token: token
        }),
        dataType: "json",
        success: success,
        error: error
    });
}

function accountLogout(success, error) {
    networkActivityMessage("Disconnessione dall'account...");
    $.ajax({
        url: "/api/login",
        type: "DELETE",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: success,
        error: error
    });
}

function getAccountProfile(success, error) {
    networkActivityMessage("Richiesta profilo...");
    $.ajax({
        url: "/api/profile",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: success,
        error: error,
        beforeSend: networkActivityOn,
        complete: networkActivityOff
    });
}

function getCharactersList(success, error) {
    networkActivityMessage("Richiesta personaggi...");
    $.ajax({
        url: "/api/characters",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: success,
        error: error,
        beforeSend: networkActivityOn,
        complete: networkActivityOff
    });
}

function setLoggedIn(user) {
    networkActivityMessage("");
    $(".account-name").text(user.name ? user.name : "straniero");
    $("#account-email").text(user.email ? user.email : "nessuna");
    if (user.has_facebook) {
        $("#account-facebook").text("Si");
    } else {
        $("#account-facebook").html('<button type="button" id="assoc-facebook-acc-button" class="tg-button l tiny">Connettiti e associa</button>');
        $("#assoc-facebook-acc-button").button().click(function() {
            FB.login(function(response) {
                if (response.authResponse) {
                    facebookToken = response.authResponse.accessToken;
                    facebookAccountLink(facebookToken, function(data) {
                        networkActivityMessage("");
                        $("#account-facebook").text("Si");
                    }, function(error) {
                        if (error.status == 401) networkActivityMessage("Richiesta da account non autenticato."); else networkActivityMessage("Errore di comunicazione con il server.");
                    });
                }
            }, {
                scope: "public_profile,email"
            });
        });
    }
    if (user.has_local) {
        $("#password-form").show();
        $("#account-local").text("Si");
    } else {
        $("#password-form").hide();
        $("#account-local").html('<button type="button" id="assoc-local-acc-button" class="tg-button l tiny">Richiedi via email</button>');
        $("#assoc-local-acc-button").button().click(function() {
            localAccountLink(user.email, function(data) {
                networkActivityMessage("");
                $("#account-local").text("Richiesto, controlla le tue email!");
                genericDialog("Email inviata!", "<p>Una email contenente un link di attivazione è stata inviata all'indirizzo:</p><p>" + user.email + "</p><p>Controlla tra qualche minuto nella tua casella di posta in arrivo," + "troverai l'email con le istruzioni per completare la creazione.<br>A presto!</p>");
            }, function(error) {
                if (error.status == 400) networkActivityMessage("Per favore specifica tutti i dati richiesti."); else if (error.status == 403) networkActivityMessage("Troppe richieste di creazione consecutive dallo stesso indirizzo ip."); else if (error.status == 409) networkActivityMessage("Email già in uso."); else if (error.status == 502) networkActivityMessage("Errore di comunicazione con il server."); else networkActivityMessage("Errore nell'invio dell'email.");
            });
        });
    }
    user_account_data = user;
    doUpdateAccountImage();
    doUpdateCharacters();
}

function setLoggedOut() {
    user_account_data = null;
    $(".account-name").text("straniero");
    $("#account-email").text("nessuna");
}

function doAccountLogout(done) {
    if (facebookToken) {
        $("#accountimg").hide().attr("src", "");
        FB.logout(function(res) {
            facebookToken = null;
        });
    }
    accountLogout(function() {
        networkActivityMessage("");
        setLoggedOut();
        moveLoginPanel("account");
        if (done) done();
    }, function(error) {
        if (error.status == 502) networkActivityMessage("Errore di comunicazione con il server."); else networkActivityMessage("Errore di disconnessione.");
        setLoggedOut();
        moveLoginPanel("account");
        if (done) done();
    });
}

function doUpdateAccountImage() {
    if (facebookToken) {
        FB.api("/me/picture", function(res) {
            if (res && !res.error) {
                $("#accountimg").attr("src", res.data.url);
            }
        });
    }
}

function doUpdateCharacters() {
    var cl = $("#chars-list");
    getCharactersList(function(data) {
        networkActivityMessage("");
        cl.empty();
        enabled_chars_count = 0;
        if (data.length > 0) {
            $.each(data, function(index, value) {
                var imageUrl = images_path + "/pg_" + value.pgid + ".jpg";
                var portEl = '<button class="char-portrait' + (value.disab ? "" : " enabled") + '" name="' + value.name + '"><img src="' + imageUrl + '"><div class="char-portrait-frame"><div class="char-portrait-name">' + value.name + "</div></button>";
                cl.append(portEl);
                if (!value.disab) enabled_chars_count++;
            });
            $("img", cl).on("load", function() {
                $(this).css("visibility", "visible");
            });
            $(cl).contents(".char-portrait.enabled").click(function(el) {
                var name = $(this).attr("name");
                doCharacterLoginWithNameAndPassword(name, "");
            });
            $(cl).contents(".char-portrait.enabled").first().focus();
        } else {
            cl.append("<p>Non ci sono personaggi in questo account. Creane uno nuovo o associa un personaggio esistente.</p>");
        }
        updateChars = false;
    }, function(error) {
        cl.empty();
        if (error.status == 401) {
            networkActivityMessage("Richiesta da account non autenticato.");
        } else if (error.status == 502) {
            networkActivityMessage("Errore di comunicazione con il server.");
        } else {
            networkActivityMessage("Errore di ricezione della lista personaggi.");
        }
    });
}

function doChangePassword() {
    var password = $("#changepass").val();
    changePassword(password, function() {
        networkActivityMessage("Password cambiata correttamente.");
    }, function(error) {
        if (error.status == 401) {
            networkActivityMessage("Richiesta da account non autenticato.");
        } else if (error.status == 502) {
            networkActivityMessage("Errore di comunicazione con il server.");
        } else {
            networkActivityMessage("Errore nel cambio della password.");
        }
    });
}

function doLocalAccountLogin() {
    var email = $.trim($("#actemail").val());
    var pass = $.trim($("#actpass").val());
    var logindata = {
        email: email,
        password: pass
    };
    localAccountLogin(logindata, function(data) {
        setLoggedIn(data.user);
        moveLoginPanel("login");
    }, function(error) {
        if (error.status == 400) {
            networkActivityMessage("Per favore specifica tutti i dati richiesti.");
        } else if (error.status == 401) {
            networkActivityMessage("Email o password errati.");
        } else if (error.status == 502) {
            networkActivityMessage("Errore di comunicazione con il server.");
        } else {
            networkActivityMessage("Errore di accesso all'account.");
        }
    });
}

function doLocalAccountAutoLogin(done) {
    getAccountProfile(function(data) {
        setLoggedIn(data.user);
        moveLoginPanel("login");
        if (done) done(true);
    }, function() {
        networkActivityMessage("");
        if (done) done(false);
    });
}

function doFacebookLogin(token, done) {
    facebookAccountLogin(token, function(data) {
        setLoggedIn(data.user);
        moveLoginPanel("login");
        if (done) done(true);
    }, function(error) {
        if (error.status == 401) {
            networkActivityMessage("Problema nella creazione dell'account.");
        } else if (error.status == 502) {
            networkActivityMessage("Errore di comunicazione con il server.");
        } else {
            networkActivityMessage("Errore di accesso all'account.");
        }
        if (done) done(false);
    });
}

function doCharacterLogin() {
    var name = $("#loginname").val();
    var pass = $("#loginpass").val();
    doCharacterLoginWithNameAndPassword(name, pass);
}

function doCharacterLoginWithNameAndPassword(name, pass) {
    connectionInfo.mode = "login";
    connectionInfo.loginName = name;
    connectionInfo.loginPass = pass;
    networkActivityOn();
    networkActivityMessage("Connessione in corso...");
    updateChars = true;
    loginErrorClean();
    connectToServer();
}

function doLocalAccountCreate() {
    var email = $("#newactemail").val();
    localAccountRequest(email, function(data) {
        networkActivityMessage("");
        genericDialog("Email inviata!", "<p>Una email contenente un link di attivazione è stata inviata all'indirizzo da " + "te specificato. Controlla tra qualche minuto nella tua casella di posta in arrivo," + "troverai l'email con le istruzioni per completare la creazione.<br>A presto!</p>");
        moveLoginPanel("account");
    }, function(error) {
        if (error.status == 400) networkActivityMessage("Per favore specifica tutti i dati richiesti."); else if (error.status == 403) networkActivityMessage("Troppe richieste di creazione consecutive dallo stesso indirizzo ip."); else if (error.status == 409) networkActivityMessage("Email già in uso, forse hai un altro account?"); else if (error.status == 502) networkActivityMessage("Errore di comunicazione con il server."); else networkActivityMessage("Errore nell'invio dell'email.");
    });
}

function doLocalAccountVerify() {
    var name = $("#vfyname").val();
    var pass = $("#vfypass").val();
    localAccountVerify(verify_email, verify_token, name, pass, function(data) {
        networkActivityMessage("");
        genericDialog("Account creato!", "<p>Il tuo account è stato creato, da ora potrai connetterti usando " + "l'indirizzo email e la password da te specficati.</p><p>Buon divertimento!</p>");
        setLoggedIn(data.user);
        moveLoginPanel("login");
    }, function(error) {
        if (error.status == 400) networkActivityMessage("Per favore specifica tutti i dati richiesti."); else if (error.status == 502) networkActivityMessage("Errore di comunicazione con il server."); else networkActivityMessage("Errore nella creazione dell'account.");
    });
}

function moveLoginPanel(new_panel, immediate) {
    if (new_panel != current_login_panel) {
        $("#" + current_login_panel + "-panel").hide();
        current_login_panel = new_panel;
        $("#" + current_login_panel + "-panel").show();
    }
}

function loginInit() {
    $("#actcrtnew").click(function() {
        moveLoginPanel("newaccount");
    });
    $("#actcntbtn").button();
    $("#local-account-form").validate({
        submitHandler: function(form) {
            try {
                doLocalAccountLogin();
            } catch (err) {
                alert(err.message);
                location.reload();
            }
        }
    });
    $("#actnewback").button().click(function() {
        moveLoginPanel("account");
    });
    $("#actnewbtn").button();
    $("#new-local-account-form").validate({
        debug: true,
        ignore: null,
        wrapper: "div",
        errorPlacement: function(error, el) {
            if (el.attr("type") == "checkbox") el = el.next();
            error.insertAfter(el);
        },
        submitHandler: function(form) {
            try {
                doLocalAccountCreate();
            } catch (err) {
                alert(err.message);
                location.reload();
            }
        }
    });
    $("#accountimg").on("error", function() {
        $(this).hide();
    }).on("load", function() {
        $(this).show();
    });
    $("#associatebtn").button().click(function() {
        moveLoginPanel("assocchar");
    });
    $("#createnewpg").button().click(function() {
        switchLoginCreation(false);
    });
    $("#logout").button().click(function() {
        doAccountLogout();
    });
    $("#profile").button().click(function() {
        moveLoginPanel("profile");
    });
    $("#associateback").button().click(function() {
        moveLoginPanel("login");
    });
    $("#connectbtn").button();
    $("#associate-character-form").validate({
        submitHandler: function(form) {
            try {
                doCharacterLogin();
            } catch (err) {
                alert(err.message);
                location.reload();
            }
        }
    });
    $("#vfybtn").button();
    $("#local-account-verify-form").validate({
        debug: true,
        submitHandler: function(form) {
            try {
                doLocalAccountVerify();
            } catch (err) {
                alert(err.message);
                location.reload();
            }
        }
    });
    $("#profileback").button().click(function() {
        moveLoginPanel("login");
    });
    $("#changepwdbtn").button();
    $("#password-form").validate({
        debug: true,
        submitHandler: function(form) {
            try {
                doChangePassword();
            } catch (err) {
                alert(err.message);
                location.reload();
            }
        }
    });
    $("#logindialog").dialog({
        autoOpen: false,
        modal: true,
        closeOnEscape: false,
        dialogClass: "tg-dialog styledbuttons notitle noclose",
        draggable: false,
        resizable: false,
        width: 830,
        height: 600,
        open: function() {
            fadeOutLoginPortrait();
            loginPortraitTimer = setInterval(fadeOutLoginPortrait, 8e3);
            if (current_login_panel == "login") {
                var chars = $("#chars-list").contents(".char-portrait.enabled");
                if (chars.length > 0) chars.first().focus(); else $("#createnewpg").focus();
            }
        },
        close: function() {
            if (loginPortraitTimer) clearInterval(loginPortraitTimer);
        },
        destroy: function() {
            if (loginPortraitTimer) clearInterval(loginPortraitTimer);
        }
    });
}

function fadeOutLoginPortrait() {
    var currentScreen = currentPortrait % 2;
    currentPortrait = (currentPortrait + 1) % 6;
    var nextScreen = currentPortrait % 2;
    $("#logindialog .loginportrait.sc" + nextScreen).attr("src", login_heroes_assets[currentPortrait]);
    $("#logindialog .loginportrait.sc" + currentScreen).fadeOut("slow", fadeInLoginPortrait);
}

function fadeInLoginPortrait() {
    var currentScreen = currentPortrait % 2;
    $("#logindialog .loginportrait.sc" + currentScreen).fadeIn("slow");
}

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
    invitation: null,
    race: null,
    sex: null,
    race_code: null,
    stats: {
        strength: 0,
        constitution: 0,
        size: 0,
        dexterity: 0,
        speed: 0,
        empathy: 0,
        intelligence: 0,
        willpower: 0
    },
    culture: null,
    religion: null,
    start: null,
    name: null,
    password: null,
    password2: null
};

var attr_help_url = {
    help: "data/attributes/help_3017eea5e45b28c21d2bc1c99e039cf3.html",
    strength: "data/attributes/strength_4d7f93dc44b005e311a8581659a448a4.html",
    constitution: "data/attributes/constitution_3acebd6bbcb2ed7ee1f0f0af0651d596.html",
    size: "data/attributes/size_28e23fd0cd97df26dfbbee2052ceb58a.html",
    dexterity: "data/attributes/dexterity_dc778c21e297954ec08f121fe05b9088.html",
    speed: "data/attributes/speed_ff7b4438c86f14c3959bbb5cf1ef63c1.html",
    empathy: "data/attributes/empathy_577dde16944a1928bec68084b58c17c8.html",
    intelligence: "data/attributes/intelligence_5d9c7b35d3707437e051a254944103ec.html",
    willpower: "data/attributes/willpower_9a22b696e0a318672ac1780abc1ced20.html"
};

function statCost(val) {
    var cost = [ -40, -30, -20, -15, -10, -5, 0, 5, 10, 15, 25, 40, 60 ];
    var idx = (30 + val) / 5;
    return cost[idx];
}

function calcUsedPoints(stats) {
    var sum = 0;
    $.each(stats, function(n, v) {
        sum -= statCost(v);
    });
    return sum;
}

function creationInit() {
    $.getJSON("data/races/data_37f54e362613cacbef981b2c40cc7896.json", function(r) {
        races = r;
    });
    $.getJSON("data/ethnicity/data_60c4b742488d79e1525ebb7f5063a75d.json", function(e) {
        ethnicities = e;
    });
    $.getJSON("data/religions/data_9f219788eecf1de0f6be1a2e75ef8d4d.json", function(r) {
        religions = r;
    });
    $.getJSON("data/cultures/data_18e67f652ab53f48d74f6b8956a74270.json", function(c) {
        cultures = c;
    });
    $.getJSON("data/locations/data_d0a0e8d635cf0eb70dc3d67c1d6600a0.json", function(l) {
        locations = l;
    });
    $("#creationnext").button().click(nextCreationPanel);
    $("#creationprev").button().click(prevCreationPanel);
    updateCreationButtons(0);
    $("#createdialog .port").button().empty().click(function(e) {
        $("#createdialog .port").removeClass("selected");
        $(this).addClass("selected");
        switchRaceSelection($(this).attr("race"));
    });
    $("#invitation").keyup(function() {
        creation_data.invitation = $(this).val();
        updateSteps(creation_data);
        updateCreationButtons(0);
    });
    $("#name").keyup(function() {
        creation_data.name = $(this).val();
        updateSteps(creation_data);
        updateCreationButtons(6);
    });
    $("#password").keyup(function() {
        creation_data.password = $(this).val();
        updateSteps(creation_data);
        updateCreationButtons(6);
    });
    $("#password2").keyup(function() {
        creation_data.password2 = $(this).val();
        updateSteps(creation_data);
        updateCreationButtons(6);
    });
    $("#createdialog .tg-slider").slider({
        min: -30,
        max: 30,
        value: 0,
        step: 5,
        slide: function(event, ui) {
            var attr = $(this).closest(".attr-div").attr("attr-name");
            creation_data.stats[attr] = ui.value;
            $("#attr-points").text(calcUsedPoints(creation_data.stats));
            updateSteps(creation_data);
            updateCreationButtons(current_creation_panel_num);
        }
    });
    $("#createdialog .attr-div").hover(function(e) {
        var attr = $(this).attr("attr-name");
        if (attr && attr_help_url[attr]) $("#attr-desc").load(attr_help_url[attr]);
    }, function(e) {
        $("#attr-desc").load(attr_help_url["help"]);
    });
    $("#race-desc").load(race_help_url["help"]);
    $("#attr-desc").load(attr_help_url["help"]);
    var masks = {
        int: /[\d]/,
        float: /[\d\.]/,
        money: /[\d\.\s,]/,
        num: /[\d\-\.]/,
        hex: /[0-9a-f]/i,
        email: /[a-z0-9_\.\-@]/i,
        alpha: /[a-z]/i,
        alphanum: /[a-z0-9]/i,
        alphanumlower: /[a-z0-9]/,
        alphaspace: /[a-z ]/i,
        alphanumspace: /[a-z0-9 ]/i,
        alphanumspacelower: /[a-z0-9 ]/
    };
    $("input[data-mask]").each(function(idx) {
        var mask = $(this).data("mask");
        var regex = masks[mask] ? masks[mask] : mask;
        $(this).filter_input({
            regex: regex,
            live: true
        });
    });
    $("#createdialog .scrollingarea > .stagepanel").first().css("visibility", "visible");
    $("#createdialog").dialog({
        autoOpen: false,
        modal: true,
        closeOnEscape: false,
        dialogClass: "tg-dialog styledbuttons notitle noclose",
        draggable: false,
        resizable: false,
        width: 900,
        height: 650
    });
}

function verifyAttrs(cfg) {
    return calcUsedPoints(creation_data.stats) >= 0;
}

var race_help_url = {
    help: "data/races/help_49d3285861ad67817ea0f117755c31b5.html",
    human: "data/races/human_1978ddd15dd88e76e942157d495e7c7a.html",
    halfling: "data/races/halfling_d149439553cc7ff2517115462533ee97.html",
    dwarf: "data/races/dwarf_a7dcf38f8881aa9727bd9c8e6147afe9.html",
    elf: "data/races/elf_540329404a9d650a2c7d15d9de472b1c.html",
    goblin: "data/races/goblin_270628956a1ecdbfed16949a56e977b6.html",
    orc: "data/races/orc_fd13c8cf2d3ddb93545bc150fc3b7b93.html"
};

function switchRaceSelection(newrace) {
    var current_race;
    if (!creation_data.race || !creation_data.sex) current_race = "race-none"; else current_race = creation_data.race + "_" + creation_data.sex;
    if (newrace != current_race) {
        $("#createdialog .port").button("disable");
        var old_race_panel_num = current_race_panel_num;
        current_race_panel_num = (current_race_panel_num + 1) % 2;
        $("#race-panel" + current_race_panel_num).addClass(newrace);
        var race_help = newrace.replace(/_[mf]/, "");
        if (!race_help_url[race_help]) race_help = "help";
        $("#race-desc").load(race_help_url[race_help]);
        $("#scrolling-race").animate({
            top: -current_race_panel_num * $("#scrolling-race .race-panel").first().outerHeight()
        }, {
            complete: function() {
                $("#race-panel" + old_race_panel_num).removeClass(current_race);
                $("#race-panel" + current_race_panel_num).addClass(newrace);
                $("#createdialog .stagepanel > .race-panel").removeClass(current_race).addClass(newrace);
                var new_race_name = newrace.split("_")[0];
                if (creation_data.race != new_race_name) {
                    creation_data.race = newrace.split("_")[0];
                    creation_data.race_code = null;
                    creation_data.culture = null;
                    creation_data.religion = null;
                    creation_data.start = null;
                }
                creation_data.sex = newrace.split("_")[1];
                updateSteps(creation_data);
                updateCreationButtons(current_creation_panel_num);
                $("#createdialog .port").button("enable");
            }
        });
    }
}

function resetCreationData() {
    switchCreationPanel(0);
    var creation_data = {
        invitation: null,
        race: null,
        sex: null,
        race_code: null,
        stats: {
            strength: 0,
            constitution: 0,
            size: 0,
            dexterity: 0,
            speed: 0,
            empathy: 0,
            intelligence: 0,
            willpower: 0
        },
        culture: null,
        religion: null,
        start: null,
        name: null,
        password: null,
        password2: null
    };
    $("#createdialog input[type=text]").val("");
    $("#createdialog input[type=password]").val("");
    $("#invitationok .okko").removeClass("ok");
    $("#createdialog .stagepanel .race-panel").attr("class", "instagepanel race-panel small-race race-none");
    $("#createdialog .port").removeClass("selected");
    $("#race-desc").load(race_help_url["help"]);
    $("#createdialog .tg-slider").slider("value", 0);
    $("#attr-points").text("0");
    $("#attr-desc").load(attr_help_url["help"]);
}

function createNewChar(cd) {
    connectionInfo.mode = "create";
    connectionInfo.data = cd;
    connectionInfo.data.email = user_account_data.email;
    networkActivityOn();
    networkActivityMessage("Connessione in corso...");
    loginErrorClean();
    connectToServer();
}

function nextCreationPanel() {
    if (current_creation_panel_num == stepVerifiers.length - 1) {
        createNewChar(creation_data);
        return;
    }
    if (verifyStep(current_creation_panel_num, creation_data)) switchCreationPanel(current_creation_panel_num + 1);
}

function prevCreationPanel() {
    if (current_creation_panel_num == 0) {
        switchLoginCreation(true);
        return;
    }
    switchCreationPanel(current_creation_panel_num - 1);
}

function switchCreationPanel(newpan) {
    if (newpan != current_creation_panel_num) {
        updateCreationPanel(newpan);
        var panels = $("#createdialog .scrollingarea > .stagepanel");
        $(panels[newpan]).css("visibility", "visible");
        $("#createdialog .scrollingarea").animate({
            left: -newpan * $("#createdialog .scrollingarea .stagepanel").first().outerWidth()
        }, {
            complete: function() {
                $(panels[current_creation_panel_num]).css("visibility", "hidden");
                current_creation_panel_num = newpan;
                updateSteps(creation_data);
                updateCreationButtons(newpan);
            }
        });
    }
}

function updateCreationButtons(pan) {
    if (pan == 0) {
        $("#creationprev span").text("Torna all'accesso");
    } else {
        $("#creationprev span").text("Indietro");
    }
    if (pan == stepVerifiers.length - 1) {
        $("#creationnext span").text("Crea!");
    } else {
        $("#creationnext span").text("Avanti");
    }
    $("#creationnext").button({
        disabled: !verifyStep(pan, creation_data)
    });
}

function switchLoginCreation(login) {
    if (login) {
        connectionInfo.mode = "login";
        closeDialog("#createdialog");
        openDialog("#logindialog");
    } else {
        connectionInfo.mode = "create";
        closeDialog("#logindialog");
        openDialog("#createdialog");
        $("#createdialog .content").get(0).scrollLeft = 0;
    }
    networkActivityMessage("");
}

function updateEthnics() {
    var dest = $("#createdialog .ethnic-panel");
    dest.empty();
    var validcode = validInvitationCode(creation_data.invitation);
    $.each(ethnicities[creation_data.race], function(idx, val) {
        var race = val["code"];
        var help_url = val["help_url"];
        var name = val["name"];
        var limited = val["limited"];
        dest.append('<input type="radio" name="ethnic" class="tg-button" value="' + race + '" id="' + race + '"' + (limited && !validcode ? " disabled" : "") + (creation_data.race_code == race ? " checked" : "") + '/><label for="' + race + '" help="' + help_url + '"><span></span>' + name + "</label><br>");
    });
    if (creation_data.race_code == null) $("#ethn-desc").load("data/ethnicity/help_4b6cbf6b2d8247aec9c4399b5a04c8be.html");
    $("label", dest).hover(function() {
        var help_url = $(this).attr("help");
        $("#ethn-desc").load(help_url);
    }, function() {
        var sel = $("input:radio[name=ethnic]:checked + label", dest);
        if (sel && sel.length) {
            var help_url = $(sel).attr("help");
            $("#ethn-desc").load(help_url);
        } else $("#ethn-desc").load("data/ethnicity/help_4b6cbf6b2d8247aec9c4399b5a04c8be.html");
    });
    $("input:radio[name=ethnic]", dest).click(function() {
        creation_data.race_code = $(this).val();
        updateSteps(creation_data);
        updateCreationButtons(current_creation_panel_num);
    });
}

function updateCultures() {
    var dest = $("#createdialog .cult-panel");
    dest.empty();
    $.each(cultures[creation_data.race_code], function(idx, val) {
        var name = val["name"];
        var help_url = val["help_url"];
        var value = name;
        dest.append('<input type="radio" name="cult" class="tg-button" value="' + name + '" id="cult' + idx + '"' + (creation_data.culture == value ? " checked" : "") + '/><label for="cult' + idx + '" help="' + help_url + '"><span></span>' + capFirstLetter(name) + "</label><br>");
    });
    if (creation_data.culture == null) $("#cult-desc").load("data/cultures/help_a3f92edbb51d508d53ebd193fc4f4692.html");
    $("label", dest).hover(function() {
        var help_url = $(this).attr("help");
        $("#cult-desc").load(help_url);
    }, function() {
        var sel = $("input:radio[name=cult]:checked + label", dest);
        if (sel && sel.length) {
            var help_url = $(sel).attr("help");
            $("#cult-desc").load(help_url);
        } else $("#cult-desc").load("data/cultures/help_a3f92edbb51d508d53ebd193fc4f4692.html");
    });
    $("input:radio[name=cult]", dest).click(function() {
        creation_data.culture = $(this).val();
        updateSteps(creation_data);
        updateCreationButtons(current_creation_panel_num);
    });
}

function updateReligion() {
    var dest = $("#createdialog .relig-panel");
    dest.empty();
    $.each(religions[creation_data.race_code], function(idx, val) {
        var name = val["name"];
        var help_url = val["help_url"];
        var value = name;
        dest.append('<input type="radio" name="relig" class="tg-button" value="' + name + '" id="relig' + idx + '"' + (creation_data.religion == value ? " checked" : "") + '/><label for="relig' + idx + '" help="' + help_url + '"><span></span>' + capFirstLetter(name) + "</label><br>");
    });
    if (creation_data.religion == null) $("#cult-desc").load("data/religions/help_fad2d8e1969c2c0248d2003e1b1c7073.html");
    $("label", dest).hover(function() {
        var help_url = $(this).attr("help");
        $("#relig-desc").load(help_url);
    }, function() {
        var sel = $("input:radio[name=relig]:checked + label", dest);
        if (sel && sel.length) {
            var help_url = $(sel).attr("help");
            $("#relig-desc").load(help_url);
        } else $("#relig-desc").load("data/religions/help_fad2d8e1969c2c0248d2003e1b1c7073.html");
    });
    $("input:radio[name=relig]", dest).click(function() {
        creation_data.religion = $(this).val();
        updateSteps(creation_data);
        updateCreationButtons(current_creation_panel_num);
    });
}

function updateStartPos() {
    var dest = $("#createdialog .map-image");
    dest.empty();
    $.each(locations[creation_data.race_code], function(idx, val) {
        var name = val["name"];
        var help_url = val["help_url"];
        var coords = val["coords"];
        dest.append('<input type="radio" name="start" class="tg-button" value="' + name + '" id="start' + idx + '"' + (creation_data.start == name ? " checked" : "") + '/><label for="start' + idx + '" style="position:absolute;top:' + coords.y + "px;left:" + coords.x + 'px;" help="' + help_url + '"><span></span></label>');
    });
    if (creation_data.start == null) $("#map-desc").load("data/locations/help_bcf95615fad7e9aeee8c0885896295ea.html");
    $("label", dest).hover(function() {
        var help_url = $(this).attr("help");
        $("#map-desc").load(help_url);
    }, function() {
        var sel = $("input:radio[name=start]:checked + label", dest);
        if (sel && sel.length) {
            var help_url = $(sel).attr("help");
            $("#map-desc").load(help_url);
        } else $("#map-desc").load("data/locations/help_bcf95615fad7e9aeee8c0885896295ea.html");
    });
    $("input:radio[name=start]", dest).click(function() {
        creation_data.start = $(this).val();
        updateSteps(creation_data);
        updateCreationButtons(current_creation_panel_num);
    });
}

var panelUpdater = [ null, null, null, updateEthnics, updateCultures, updateStartPos, null ];

function updateCreationPanel(pan) {
    if (panelUpdater[pan] != null) panelUpdater[pan]();
}

function validInvitationCode(code) {
    return code != null && code != "" && code.length == 12;
}

function verifyIntro(cfg) {
    var invok = cfg.invitation == null || cfg.invitation == "" || cfg.invitation.length == 12;
    $("#invitationok").toggleClass("ok", invok);
    return invok;
}

function verifyRace(cfg) {
    return cfg.race != null && cfg.sex != null;
}

function verifyEthnics(cfg) {
    return cfg.race_code != null;
}

function verifyCultures(cfg) {
    return cfg.culture != null;
}

function verifyReligion(cfg) {
    return cfg.religion != null;
}

function verifyMap(cfg) {
    return cfg.start != null;
}

function verifyAccess(cfg) {
    var nameok = verifyCharName(cfg.name);
    var p1ok = verifyPasswd(cfg.password);
    var p2ok = p1ok && verifyPasswd(cfg.password2) && cfg.password == cfg.password2;
    $("#nameok").toggleClass("ok", nameok);
    $("#pwdok").toggleClass("ok", p1ok);
    $("#pwd2ok").toggleClass("ok", p2ok);
    return nameok && p1ok && p2ok;
}

function verifyCharName(n) {
    return n != null && n.length > 3 && n.length < 16 && /^[a-z]+$/i.test(n);
}

function verifyEmail(e) {
    return e != null && e.length > 0 && e.length <= 40 && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(e);
}

function verifyPasswd(p) {
    return p != null && p.length >= 5 && p.length <= 10 && /^[a-z0-9]+$/i.test(p);
}

function verifyBothPasswd(p1, p2) {
    return verifyPasswd(p1) && verifyPasswd(p2) && p1 == p2;
}

var stepVerifiers = [ verifyIntro, verifyRace, verifyAttrs, verifyEthnics, verifyCultures, verifyMap, verifyAccess ];

function verifyStep(step, cfg) {
    return stepVerifiers[step](cfg);
}

function updateSteps(cfg) {
    $.each(stepVerifiers, function(i, c) {
        $("#stage" + i).toggleClass("checked", current_creation_panel_num >= i && c(cfg)).toggleClass("selected", current_creation_panel_num == i);
    });
}

function configInit() {
    $("#musicvolumeslider").slider({
        min: 0,
        max: 100,
        value: client_options.musicVolume,
        slide: function(e, ui) {
            $("#music").get(0).volume = ui.value / 100;
            client_options.musicVolume = ui.value;
            $("#musicvolume").text(ui.value);
        },
        change: function() {
            Save("options", client_options);
        }
    });
    $("#musicvolume").text(client_options.musicVolume);
    $("#soundvolumeslider").slider({
        min: 0,
        max: 100,
        value: client_options.soundVolume,
        slide: function(e, ui) {
            $("#sound").get(0).volume = ui.value / 100;
            client_options.soundVolume = ui.value;
            $("#soundvolume").text(ui.value);
        },
        change: function() {
            Save("options", client_options);
        }
    });
    $("#soundvolume").text(client_options.soundVolume);
    $("#tab-shortcuts").empty().append("<table />");
    $("#tab-shortcuts table").append('<colgroup><col class="sc-col-num"/><col class="sc-col-abbr"/><col class="sc-col-cmd"/></colgroup>');
    $("#tab-shortcuts table").append("<thead><tr><th>Num.</th><th>Abbreviazione</th><th>Comando</th></tr></thead>");
    for (var scidx = 0; scidx < 50; ++scidx) {
        var alias = "";
        var cmd = "";
        if (client_options.shortcuts[scidx]) {
            alias = client_options.shortcuts[scidx].alias ? client_options.shortcuts[scidx].alias : "";
            cmd = client_options.shortcuts[scidx].cmd ? client_options.shortcuts[scidx].cmd : "";
        }
        $("#tab-shortcuts table").append("<tr><td>" + scidx + '</td><td><input type="text" value="' + alias + '" id="sc-a-' + scidx + '"></td><td><input type="text" value="' + cmd + '" id="sc-c-' + scidx + '"></td></tr>');
    }
    $("#tab-shortcuts input").blur(function(e) {
        var idx = e.target.id.substr(5);
        var alias = $("#sc-a-" + idx).val();
        var value = $("#sc-c-" + idx).val();
        alias = $.trim(alias);
        value = $.trim(value);
        if (value) {
            client_options.shortcuts[idx] = {
                alias: alias,
                cmd: value
            };
        } else {
            delete client_options.shortcuts[idx];
        }
        updateShortcutsMap();
        Save("options", client_options);
    });
    updateShortcutsMap();
    $("#trimlinesslider").slider({
        min: 100,
        max: 1e4,
        step: 500,
        value: client_options.output.trimLines,
        change: function(e, ui) {
            client_options.output.trimLines = ui.value;
            Save("options", client_options);
        }
    });
    if (client_options.equipAsList) $("#tab-video #eqaslist").prop("checked", true);
    $("#tab-video #eqaslist").click(function() {
        client_options.equipAsList = $(this).prop("checked");
        Save("options", client_options);
        equipInit(client_options.equipAsList);
    });
    if (client_options.details.size) $("#tab-video  input:radio[name=deticolistsiz]").filter("[value=" + client_options.details.size + "]").attr("checked", true);
    $("#tab-video  input:radio[name=deticolistsiz]").click(function() {
        var val = $(this).val();
        client_options.details["size"] = val;
        $("#detailsdialog table.list.container").removeClass("icons_n icons_m icons_s").addClass(val);
        $("#invdialog table.list.container").removeClass("icons_n icons_m icons_s").addClass(val);
        $("#equipdialog table.list.container").removeClass("icons_n icons_m icons_s").addClass(val);
        Save("options", client_options);
    });
    if (client_options.details.compact) $("#tab-video  #detlistsize").prop("checked", true);
    $("#tab-video #detlistsize").click(function() {
        var en = $(this).prop("checked");
        client_options.details["compact"] = en;
        $("#detailsdialog table.list.container").toggleClass("compact", en);
        $("#invdialog table.list.container").toggleClass("compact", en);
        $("#equipdialog table.list.container").toggleClass("compact", en);
        Save("options", client_options);
    });
    if (client_options.details.size) $("#tab-video  input:radio[name=mapsiz]").filter("[value=" + client_options.map.size + "]").attr("checked", true);
    $("#tab-video  input:radio[name=mapsiz]").click(function() {
        var val = $(this).val();
        client_options.map.size = val;
        mapResize(val);
        Save("options", client_options);
    });
    if (client_options.map.sight) {
        $("#tab-video #sight").prop("checked", true);
        $("#mapsight").show();
    }
    $("#tab-video #sight").click(function() {
        client_options.map.sight = $(this).prop("checked");
        Save("options", client_options);
        $("#mapsight").toggle(client_options.map.sight);
    });
    if (client_options.textOnTop) $("#tab-video #topdowntxt").prop("checked", true);
    $("#tab-video #topdowntxt").click(function() {
        client_options.textOnTop = $(this).prop("checked");
        Save("options", client_options);
        $("#textdialog").toggleClass("topdown", client_options.textOnTop);
    });
    if (client_options.buttonsOnTop) $("#tab-video #topdownbbar").prop("checked", true);
    $("#tab-video #topdownbbar").click(function() {
        client_options.buttonsOnTop = $(this).prop("checked");
        Save("options", client_options);
        $("body").toggleClass("topdown", client_options.buttonsOnTop);
    });
    if (client_options.log.enabled) $("#tab-game #logenabled").prop("checked", true);
    $("#tab-game #logenabled").click(function() {
        client_options.log["enabled"] = $(this).prop("checked");
        Save("options", client_options);
    });
    if (client_options.log.clean) $("#tab-game #logclean").prop("checked", true);
    $("#tab-game #logclean").click(function() {
        client_options.log["clean"] = $(this).prop("checked");
        Save("options", client_options);
    });
    if (client_options.log.save) $("#tab-game #logsave").prop("checked", true);
    $("#tab-game #logsave").click(function() {
        client_options.log["save"] = $(this).prop("checked");
        Save("options", client_options);
    });
    $("#configdialog").tabs();
    $("#configdialog").dialog({
        autoOpen: false,
        title: addBannerStyle("Configurazione"),
        width: 800,
        minWidth: 450,
        height: 600,
        minHeight: 400,
        dialogClass: "tg-dialog styledbuttons parch",
        closeText: "Chiudi"
    });
}

function addHealthMoveInfo() {
    return '<div class="title-add healthcont">\t\t\t\t<div class="meter2 withtxtbox">\t\t\t\t\t<div class="barcont"><span class="healthbar red up" style="width:0%"></span><span class="movebar green low" style="width:0%"></span></div>\t\t\t\t\t<div class="metertxt">Salute: <span class="healthprc"></span>% Movimento: <span class="moveprc"></span>%</div>\t\t\t\t</div>\t\t\t</div>';
}

function addDropPanel(id, cont) {
    return '<div class="droppanel" id="' + id + '">' + cont + "</div>";
}

function addFilterButton() {
    var f = client_options.combatFilter;
    applyFilter(f);
    return '<div id="combatfilter" class="combat-filter f' + f + '"></div>';
}

function enemyInfo() {
    return '<div id="enemyicon" class="iconimg interact pers"></div>' + prcBicolorBar(0, "red", "enemyh", 0, "green", "enemym");
}

function outputInit() {
    setOutputSize(client_options.output.textSize);
    $("#textdialog").toggleClass("topdown", client_options.textOnTop);
    if (!openDialog("#textdialog")) {
        var pos = getWindowPosition("textdialog");
        var size = getWindowSize("textdialog");
        var w, h;
        if (size) {
            w = size[0];
            h = size[1];
        } else {
            w = ($(desktop).width() - 360) * .6;
            h = $(desktop).height();
        }
        if (pos == null) pos = {
            my: "left top",
            at: "left top",
            of: desktop
        };
        $("#textdialog").dialog({
            closeOnEscape: false,
            title: addBannerStyle("The Gate") + addFilterButton() + addHealthMoveInfo() + addDropPanel("combatpanel", enemyInfo()),
            dialogClass: "tg-dialog parch",
            width: w,
            height: h,
            minWidth: 550,
            minHeight: 250,
            resize: "auto",
            position: pos,
            draggable: true,
            resizable: true,
            dragStop: saveWindowData,
            resizeStop: saveWindowData,
            closeText: "Chiudi"
        });
        $("#combatfilter").button().click(function() {
            var currentFilter = client_options.combatFilter;
            var nextFilter = (currentFilter + 1) % combat_filters.length;
            $(this).addClass("f" + nextFilter).removeClass("f" + currentFilter);
            applyFilter(nextFilter);
            client_options.combatFilter = nextFilter;
            Save("options", client_options);
        });
    }
}

function applyFilter(f) {
    if (f >= 0 && f < combat_filters.length) {
        filter_in = combat_filters[f].filter_in.join(",");
        filter_out = combat_filters[f].filter_out.join(",");
        $(filter_in, "#output").show();
        $(filter_out, "#output").hide();
        if (autoscroll_enabled) $("#output").get(0).scrollTop = 1e7;
    }
}

function filterMessages(txt) {
    $(filter_out, txt).hide();
}

function showOutput(text) {
    var app = $(text);
    addDragAndDrop(app);
    makeExpandable(app);
    filterMessages(app);
    $("#output").append(app);
    if (autoscroll_enabled) {
        if (client_options.output.trimLines < 1e4) $("#output").contents().slice(0, -client_options.output.trimLines).remove();
        $("#output").get(0).scrollTop = 1e7;
    }
}

function clearOutput() {
    $("#output").empty();
}

function detailsResize(evt, obj) {
    var inner = $(".tg-dialog-inner", this);
    var w = inner.width();
    $(".detailsimage-cont", this).toggleClass("floatright", w > 320);
    if (evt && obj) saveWindowData(evt, obj);
}

function addExpandedGrp(mrn) {
    var minval = exp_grp_list[mrn] = $.now();
    var minkey;
    var keys = Object.keys(exp_grp_list);
    if (keys.length > max_exp_grp) {
        for (var k in keys) {
            var val = exp_grp_list[k];
            if (val < minval) {
                minkey = k;
                minval = val;
            }
        }
        delete exp_grp_list[minkey];
    }
}

var pos_to_order = [ {
    pos: 0,
    name: ""
}, 18, 19, 5, 8, 1, 23, 24, 15, 12, 9, 22, 13, 14, 160, 170, 10, 2, 3, 4, 20, 21, 11, 6, 7, 25 ];

function renderDetailsList(cont_type, cont_num, cont, type, style) {
    var res = "";
    if (cont.list) {
        var txt = "";
        if (cont_type == "pers" || cont_type == "equip") {
            cont.list.sort(function(a, b) {
                var eq_pos_a = $.isArray(a.eq) ? pos_to_order[a.eq[0]] : 0;
                var eq_pos_b = $.isArray(b.eq) ? pos_to_order[b.eq[0]] : 0;
                return eq_pos_a - eq_pos_b;
            });
        }
        for (var n = 0; n < cont.list.length; n++) {
            var l = cont.list[n];
            var is_group = (l.mrn && l.mrn.length) > 1;
            var opened = l.mrn && exp_grp_list[l.mrn[l.mrn.length - 1]];
            var tradd = "", tdadd = "";
            if (is_group) {
                tradd = ' class="grpcoll" mrn=' + l.mrn[l.mrn.length - 1];
                if (opened) tradd += ' style="display:none"';
                tdadd += '<div class="expicon"></div>';
            }
            txt += "<tr" + tradd + "><td>" + tdadd + "</td><td><div>" + renderIcon(l.icon, l.mrn ? l.mrn[0] : null, cont_type, l.cntnum, null, "interact " + type) + "</div></td><td>" + decoratedDescription(l.condprc, l.mvprc, l.wgt, l.sz ? l.sz : 1, (l.eq ? "<b>" + equip_positions_by_num[l.eq[0]] + "</b>: " : "") + l.desc) + "</td></tr>";
            if (is_group) {
                txt += '<tbody class="grpexp"';
                if (!opened) txt += ' style="display:none"';
                txt += ">";
                for (var m = 0; m < l.mrn.length; m++) txt += "<tr><td>" + (m == 0 ? '<div class="collicon"></div>' : "") + "</td><td><div>" + renderIcon(l.icon, l.mrn[m], cont_type, l.cntnum, null, "interact " + type) + "</div></td><td>" + decoratedDescription(l.condprc, l.mvprc, l.wgt, 1, l.desc) + "</td></tr>";
                if (l.sz && l.sz > l.mrn.length) txt += "<tr><td></td><td><div>" + renderIcon(l.icon, null, cont_type, l.cntnum, null, null) + "</div></td><td>" + decoratedDescription(l.condprc, l.mvprc, l.wgt, l.sz - l.mrn.length, l.desc) + "</td></tr>";
                txt += "</tbody>";
            }
        }
        if (cont.title && (txt.length > 0 || cont.show === true)) {
            res += "<p>" + cont.title;
            if (txt.length == 0) res += "<br>Niente.";
            res += "</p>";
        }
        if (txt.length > 0) {
            res += '<table class="list container' + (style ? " " + style : "") + (client_options.details.size ? " " + client_options.details.size : "") + (client_options.details.compact ? " compact" : "") + '" cont-type="' + cont_type + '"' + (cont_num ? ' mrn="' + cont_num + '"' : "") + ">" + txt + "</table>";
        }
    }
    return res;
}

function renderDetailsInner(info, type, inDialog) {
    var textarea = "";
    if (info.action) textarea += "<p>" + info.action + "</p>";
    if (info.desc) {
        if (info.desc.base) {
            if (type == "room") last_room_desc = formatText(info.desc.base);
            textarea += formatText(info.desc.base);
        } else if (info.desc.repeatlast && last_room_desc) textarea += last_room_desc;
        if (info.desc.details) textarea += formatText(info.desc.details, "yellow");
        if (info.desc.equip) textarea += formatText(info.desc.equip, "green");
    }
    if (inDialog) {
        if (info.perscont) textarea += renderDetailsList(type, info.num, info.perscont, "pers", "lt-green");
        if (info.objcont) textarea += renderDetailsList(type, info.num, info.objcont, "obj", "yellow");
    } else {
        if (info.objcont) textarea += renderDetailsList(type, info.num, info.objcont, "obj", "yellow");
        if (info.perscont) textarea += renderDetailsList(type, info.num, info.perscont, "pers", "lt-green");
    }
    if (info.eqcont) textarea += renderDetailsList(type, info.num, info.eqcont, "obj");
    if (info.where) textarea += "<div>" + renderIconWithBackBorder(info.where.icon, info.where.num, null, null, null, "interact where") + '<span class="desc">Si trova ' + info.where.title + ".</span></div>";
    return textarea;
}

function makeExpandable(details) {
    $(".grpcoll td:first-child", details).click(function() {
        var colgrp = $(this).closest(".grpcoll");
        var expgrp = colgrp.closest("tbody").next("tbody");
        colgrp.hide();
        expgrp.show();
        addExpandedGrp(colgrp.attr("mrn"));
    });
    $(".grpexp td:first-child", details).click(function() {
        var expgrp = $(this).closest("tbody");
        var colgrp = expgrp.prev("tbody").find(".grpcoll");
        expgrp.hide();
        colgrp.show();
        delete exp_grp_list[colgrp.attr("mrn")];
    });
}

var dirBgPos = {
    nord: "0px -64px",
    nordest: "0 -288px",
    est: "0px -160px",
    sudest: "0 -256px",
    sud: "0px -128px",
    sudovest: "0 -224px",
    ovest: "0px -96px",
    nordovest: "0 -192px",
    alto: "0",
    basso: "0"
};

function renderDetailsDialog(info, type) {
    var res = "";
    var dialog = $("#detailsdialog");
    var cont = $("#details-" + type, dialog);
    var icon = $("#detailsicon-" + type, dialog);
    var wtab = [ "room", "pers", "obj", "dir" ].indexOf(type);
    var ctab = dialog.tabs("option", "active");
    var tpos;
    if (type == "dir") tpos = dirBgPos[info.dir]; else if (type == "room" && !info.icon) tpos = $("#mp044").css("background-position"); else tpos = tileBgPos(info.icon ? info.icon : 0);
    icon.css("background-position", tpos);
    if (info.title) {
        if (type == "room" && !info.up) res += '<div class="room"><div class="lts"></div>' + info.title + '<div class="rts"></div></div>';
        var title = capFirstLetter(info.title);
        icon.attr("data-shdesc", title);
        icon.attr("tooltip", title);
        if (wtab == ctab) $("#detailstitle").text(title);
    }
    if (info.image) showImage($(".detailsimage", cont), info.image); else closeImageContainer($(".detailsimage-cont", cont));
    var textarea = $(".detailstext", cont).empty();
    var details = $(replaceColors(renderDetailsInner(info, type, true)));
    addDragAndDrop(details);
    makeExpandable(details);
    textarea.append(details);
    if (!info.mv && ctab != wtab) dialog.tabs("option", "active", wtab);
    if (info.num) cont.attr("mrn", info.num);
    if (info.where) cont.attr("cntmrn", info.where.num); else cont.attr("cnttype", "room");
    if (type == "room") {
        if (client_update.room.version < info.ver) {
            client_update.room.version = info.ver;
            client_update.room.needed = false;
        }
    }
    return res;
}

function renderDetailsInText(info, type) {
    var res = "";
    if (info.title) res += '<br><div class="room"><div class="lts"></div>' + capFirstLetter(info.title) + '<div class="rts"></div></div>';
    res += renderDetailsInner(info, type, false);
    if (info.image) showImage($("#image-cont"), info.image);
    return res;
}

function renderDetails(info, type) {
    if ($("#detailsdialog").dialog("isOpen")) return renderDetailsDialog(info, type); else return renderDetailsInText(info, type);
}

function detailsInit() {
    $(".detailsimage").on("error", function() {
        $(this).closest(".detailsimage-cont").slideUp("fast");
    }).on("load", function() {
        $(this).closest(".detailsimage-cont").slideDown("fast");
    });
    $("#detailsdialog").tabs({
        activate: function(e, ui) {
            var icon = $(".iconimg", ui.newTab);
            var title = $(icon).attr("data-shdesc");
            $("#detailstitle").text(title);
        },
        beforeActivate: function(e, ui) {
            if (e.originalEvent && e.originalEvent.type == "click") {
                if (ui.newPanel.is("#details-room")) sendToServer("@agg"); else {
                    var mrn = ui.newPanel.attr("mrn");
                    if (mrn) sendToServer("@agg &" + mrn);
                }
            }
        }
    });
    $("#detailsdialog li").off("keydown");
    if (!openDialog("#detailsdialog")) {
        var pos = getWindowPosition("detailsdialog");
        var size = getWindowSize("detailsdialog");
        var w, h;
        if (size) {
            w = size[0];
            h = size[1];
        } else {
            w = ($(desktop).width() - 360) * .4;
            h = $(desktop).height();
        }
        if (pos == null) pos = {
            my: "left top",
            at: "right top",
            of: $("#textdialog").parent()
        };
        $("#detailsdialog").dialog({
            modal: false,
            autoOpen: false,
            title: addBannerStyle('<div id="detailstitle" class="ellipsed" style="width:90%">Dettagli</div>'),
            width: w,
            height: h,
            position: pos,
            dialogClass: "tg-dialog parch",
            dragStop: saveWindowData,
            resizeStop: detailsResize,
            closeText: "Chiudi",
            open: function() {
                closeDialog("#imagedialog");
                client_options.noDetails = false;
                Save("options", client_options);
            },
            close: function() {
                openDialog("#imagedialog");
                client_options.noDetails = true;
                Save("options", client_options);
            }
        });
    }
}

function renderEmbeddedImage(image) {
    return '<img class="centered" src="' + images_path + "/" + image + '">';
}

function renderLink(href, text) {
    return '<a href="' + href + '" target="_blank">' + text + "</a>";
}

function renderMob(icon, condprc, count, mrn, desc, addclass) {
    return '<div class="mob">' + renderIcon(icon, mrn, "room", null, null, addclass) + '<span class="desc">' + decoratedDescription(condprc, null, null, count, desc) + "</span></div>";
}

function renderObject(icon, condprc, count, mrn, desc, addclass) {
    return '<div class="obj">' + renderIcon(icon, mrn, "room", null, null, addclass) + '<span class="desc">' + decoratedDescription(condprc, null, null, count, desc) + "</span></div>";
}

function renderMinidetails(condprc, moveprc, wgt) {
    var pos = -11 * Math.floor(22 * (100 - condprc) / 100);
    return '<div class="hstat" style="background-position:0 ' + pos + 'px" condprc="' + condprc + '"' + (moveprc ? ' moveprc="' + moveprc + '"' : "") + (wgt != null ? ' wgt="' + wgt + '"' : "") + "></div>";
}

function decoratedDescription(condprc, moveprc, wgt, count, desc) {
    var countStr = "";
    if (count > 1) countStr = '&#160;<span class="cnt">[x' + count + "]</span>";
    return renderMinidetails(condprc, moveprc, wgt) + desc.replace(/\n/gm, " ") + countStr;
}

function tileBgPos(tilenum) {
    var tc = tileCoords(tilenum);
    return "-" + tc[0] + "px -" + tc[1] + "px";
}

function tileCoords(tilenum) {
    var posx = 32 * (tilenum & 127);
    var posy = 32 * (tilenum >> 7);
    return [ posx, posy ];
}

function renderIcon(icon, mrn, cnttype, cntmrn, cmd, addclass) {
    if (!icon) icon = 416;
    return '<div class="iconimg' + (addclass ? " " + addclass : "") + '" style="background-position:' + tileBgPos(icon) + '"' + (mrn ? ' mrn="' + mrn + '"' : "") + (cmd ? ' cmd="' + cmd + '"' : "") + (cnttype ? ' cnttype="' + cnttype + '"' : "") + (cntmrn ? ' cntmrn="' + cntmrn + '"' : "") + "></div>";
}

function renderIconWithBorder(icon, mrn, cnttype, cntmrn, cmd, addclass) {
    return '<div class="iconslot">' + renderIcon(icon, mrn, cnttype, cntmrn, cmd, addclass) + "</div>";
}

function renderIconWithSmallBorder(icon, mrn, cnttype, cntmrn, cmd, addclass) {
    return '<div class="iconslot sm">' + renderIcon(icon, mrn, cnttype, cntmrn, cmd, addclass) + "</div>";
}

function renderIconWithBackBorder(icon, mrn, cnttype, cntmrn, cmd, addclass) {
    return '<div class="backslot">' + renderIcon(icon, mrn, cnttype, cntmrn, cmd, addclass) + "</div>";
}

function formatText(text, style) {
    var page = "";
    var parags = text.replace(/\r/gm, "").replace(/([^.:?!,])\s*\n/gm, "$1 ").split(/\n/);
    $.each(parags, function(i, p) {
        page += "<p" + (style ? ' class="' + style + '"' : "") + ">" + p + "</p>";
    });
    return page;
}

function bookInit() {}

function openBook(b) {
    $("#bookdialog").dialog({
        closeOnEscape: false,
        title: addBannerStyle(b.title),
        dialogClass: "tg-dialog book",
        width: 960,
        height: 735,
        resizable: false,
        draggable: true,
        dragStop: saveWindowData,
        closeText: "Chiudi"
    });
    $("#book").empty();
    if (b.pages.length == 0) $("#book").append("<div>Il libro non contiene pagine...</div>"); else {
        for (var p = 0; p < b.pages.length; ++p) {
            var page;
            if (b.pages[p].title) {
                page = '<div rel="' + b.pages[p].title + '" title="' + b.pages[p].title + '"><h3>' + b.pages[p].title + "</h3>";
            } else {
                page = "<div>";
            }
            page += replaceColors(formatText(b.pages[p].text)) + "</div>";
            $("#book").append(page);
        }
    }
    $("#book").booklet({
        width: 924,
        height: 660,
        pagePadding: 20,
        pageNumbers: false,
        manual: false,
        overlays: false,
        arrows: true,
        menu: "#bookmenu",
        chapterSelector: true,
        pageSelector: true,
        nextControlTitle: "Pagina successiva",
        previousControlTitle: "Pagina precedente"
    });
}

function mapId(l, x, y) {
    return mapidprefix + l + x + y;
}

function prepareTableMap(level, maxw, maxh) {
    var s = "";
    var x, y;
    s = '<table id="mapl' + level + '" class="maplayer">';
    for (y = 0; y < maxh; y++) {
        s += "<tr>";
        for (x = 0; x < maxw; x++) s += '<td id="' + mapId(level, x, y) + '"></td>';
        s += "</tr>";
    }
    s += "</table>";
    $("#map").append(s);
    mapctx = null;
}

function drawTableMap(map) {
    var l, x, y, xoff, yoff, xlim, ylim, pos, light;
    xoff = (maxmapwidth - map.d) / 2;
    yoff = (maxmapheight - map.d) / 2;
    xlim = xoff + map.d;
    ylim = yoff + map.d;
    for (l = 0; l < 2; l++) {
        pos = 0;
        for (y = 0; y < maxmapwidth; y++) {
            for (x = 0; x < maxmapheight; x++) {
                var tpos;
                if (x >= xoff && x < xlim && y >= yoff && y < ylim) {
                    var d = map.data[l][pos++];
                    tpos = tileBgPos(d);
                } else tpos = "0px 0px";
                $("#" + mapId(l, x, y)).css("background-position", tpos);
            }
        }
    }
}

function prepareCanvasMap() {
    $("#map").append('<canvas id="mapcont" width=' + maxmapwidth * maptilewidth + " height=" + maxmapheight * maptileheight + "></canvas>");
    mapctx = $("#mapcont")[0].getContext("2d");
    maptileimg = new Image();
    maptileimg.src = "assets/images/icons/tiles_715c3ba47a0c056690152033fa49177c.png";
    mapfogimg = new Image();
    mapfogimg.src = "assets/images/interface/map/fog_91416ca8fd2a64ad41a24fd88fcc57df.png";
    maprainimg = new Image();
    maprainimg.src = "assets/images/interface/map/rain_139e54286a940553812e9018a90ba624.png";
    mapsnowimg = new Image();
    mapsnowimg.src = "assets/images/interface/map/snow_bb0f40ad83c36959b042f2b6cd6e1ed1.png";
    mapshadowimg[2] = new Image();
    mapshadowimg[2].src = "assets/images/interface/map/shadow1_b99bf075569b7cccddaf6da738b91013.png";
    mapshadowimg[1] = new Image();
    mapshadowimg[1].src = "assets/images/interface/map/shadow2_2ca1dcfa042a77a7e8a28686aea1485e.png";
    mapshadowimg[0] = new Image();
    mapshadowimg[0].src = "assets/images/interface/map/shadow3_7d925b7c9aa86bd198b635e0fef3e666.png";
    mapshadowtile = new Image();
    mapshadowtile.src = "assets/images/interface/map/shadowtile_59fe727f5ccc06e586d6a5541abb704c.png";
}

function drawCanvasMap(map) {
    var xoff, yoff, xlim, ylim, light;
    xoff = (maxmapwidth - map.d) / 2;
    yoff = (maxmapheight - map.d) / 2;
    xlim = xoff + map.d;
    ylim = yoff + map.d;
    mapctx.clearRect(0, 0, maxmapwidth * maptilewidth, maxmapheight * maptileheight);
    for (var l = 0; l < 2; l++) {
        var pos = 0;
        for (var y = 0; y < maxmapwidth; y++) {
            for (var x = 0; x < maxmapheight; x++) {
                if (x >= xoff && x < xlim && y >= yoff && y < ylim) layermap[y][x] = map.data[l][pos++]; else layermap[y][x] = 59;
            }
        }
        for (var y = 0; y < maxmapwidth; y++) {
            for (var x = 0; x < maxmapheight; x++) {
                var d = layermap[y][x];
                if (d != 59) {
                    var tpos = tileCoords(d);
                    mapctx.drawImage(maptileimg, tpos[0], tpos[1], maptilewidth, maptilewidth, x * maptilewidth, y * maptileheight, maptilewidth, maptileheight);
                }
            }
        }
        if (l == 0) {
            for (y = 0; y < maxmapwidth; y++) {
                for (x = 0; x < maxmapheight; x++) {
                    if (layermap[y][x] == 59) {
                        var clipx = 0, clipy = 0, swidth = 48, sheight = 48;
                        if (y == 0 || layermap[y - 1][x] == 59) {
                            clipy = 8;
                            sheight -= 8;
                        }
                        if (y == maxmapheight - 1 || layermap[y + 1][x] == 59) {
                            sheight -= 8;
                        }
                        if (x == 0 || layermap[y][x - 1] == 59) {
                            clipx = 8;
                            swidth -= 8;
                        }
                        if (x == maxmapwidth - 1 || layermap[y][x + 1] == 59) {
                            swidth -= 8;
                        }
                        mapctx.drawImage(mapshadowtile, clipx, clipy, swidth, sheight, x * maptilewidth - 8 + clipx, y * maptileheight - 8 + clipy, swidth, sheight);
                    }
                }
            }
        }
    }
    if (mapshadowimg[map.l]) mapctx.drawImage(mapshadowimg[map.l], 96 - 32 * map.l, 96 - 32 * map.l);
    if (map.f) mapctx.drawImage(mapfogimg, 0, 0);
    if (map.r) mapctx.drawImage(maprainimg, 0, 0);
    if (map.s) mapctx.drawImage(mapsnowimg, 0, 0);
}

function updateMap(map) {
    drawCanvasMap(map);
}

function mapResize(size) {
    if (mapsizedata[size]) {
        var oldclasses = $.map(mapsizedata, function(m) {
            return m.dialogClass;
        }).join(" ");
        $("#mapdialog").removeClass(oldclasses);
        if (mapsizedata[size].dialogClass) $("#mapdialog").addClass(mapsizedata[size].dialogClass);
        $("#mapdialog").dialog({
            width: mapsizedata[size].width,
            height: mapsizedata[size].height
        });
    }
}

function mapInit() {
    prepareCanvasMap();
    var pos = getWindowPosition("mapdialog");
    if (pos == null) pos = {
        my: "right top",
        at: "right top",
        of: desktop
    };
    $("#mapdialog").dialog({
        closeOnEscape: false,
        dialogClass: "tg-dialog notitle",
        width: mapsizedata[client_options.map.size].width,
        height: mapsizedata[client_options.map.size].height,
        resizable: false,
        draggable: false,
        dragStop: saveWindowData,
        position: pos
    });
    if (mapsizedata[client_options.map.size].dialogClass) $("#mapdialog").addClass(mapsizedata[client_options.map.size].dialogClass);
    $("#mapdialog").dialog("widget").draggable({
        containment: "window",
        stop: saveWindowData
    });
}

function setSky(sky) {
    var skypos = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "N", "d", "e", "f", "g", "i", "o", "p", "q", "r", "s", "t", "u", "w", "y" ];
    $("#sky").css("background-position", "0 -" + skypos.indexOf(sky) * 29 + "px");
}

function closeLockDoor(dir) {
    var cmd;
    if (dir_status[dir] == "2") cmd = "chiudi " + dir_names[dir]; else if (dir_status[dir] == "3") cmd = "blocca " + dir_names[dir];
    if (cmd) sendToServer(cmd);
}

function goDir(dir) {
    var cmd;
    if (godinvlev == 0 && dir_status[dir] == "3") cmd = "apri " + dir_names[dir]; else if (godinvlev == 0 && dir_status[dir] == "4") cmd = "sblocca " + dir_names[dir]; else cmd = dir_names[dir];
    if (cmd) sendToServer(cmd);
}

function doorsInit() {
    $("#compassarea").mouseenter(function() {
        cursoronmap = true;
    });
    $("#compassarea").mouseleave(function() {
        cursoronmap = false;
    });
    for (var d = 0; d < dir_names.length; ++d) $("#" + dir_names[d]).button({
        text: false
    }).mousedown({
        dir: d
    }, function(event) {
        if (ingame) {
            if (event.which == 1) {
                goDir(event.data.dir);
            } else if (event.which == 3) {
                event.preventDefault();
                closeLockDoor(event.data.dir);
            }
        }
    });
}

function setDoors(doors) {
    for (var d = 0; d < dir_names.length; ++d) $("#" + dir_names[d]).css("background-position", -33 * doors[d]);
    dir_status = doors;
}

function updatePlayerStatus(hprc, mprc) {
    var hcolor = prcLowTxt(hprc, hlttxtcol);
    var mcolor = prcLowTxt(hprc, hlttxtcol);
    $(".movebar").width(limitPrc(mprc) + "%");
    $(".moveprc").css("color", mcolor).text(mprc);
    $(".healthbar").width(limitPrc(hprc) + "%");
    $(".healthprc").css("color", hcolor).text(hprc);
}

function updateEnemyStatus(hprc, mprc) {
    $("#enemyh").width(limitPrc(hprc) + "%");
    $("#enemym").width(limitPrc(mprc) + "%");
}

function updateEnemyIcon(icon) {
    if (enemy_icon != icon) {
        $("#enemyicon").css("background-position", tileBgPos(icon)).attr("mrn", 0);
        enemy_icon = icon;
    }
}

function setStatus(st) {
    if (st.length == 5) {
        if (!in_combat) {
            in_combat = true;
            $("#combatpanel").slideDown(100);
        }
        updateEnemyStatus(st[2], st[3]);
        updateEnemyIcon(st[4]);
    } else if (in_combat) {
        $("#combatpanel").slideUp(100);
        in_combat = false;
    }
    updatePlayerStatus(st[0], st[1]);
    return "";
}

function closeImageContainer(cont) {
    cont.slideUp("fast");
}

function showImage(cont, image) {
    var imgsrc = images_path + "/" + image;
    var currimgsrc = cont.attr("src");
    if (currimgsrc != imgsrc) cont.attr("src", imgsrc);
}

function showImageWithGamma(cont, image, red, green, blue) {}

function addFrameStyle(content, style) {
    var base = "paper2";
    return '<div class="' + base + " frame" + (style ? " " + style : "") + '"><div class="' + base + ' corner top left"></div><div class="' + base + ' horizontal top"></div><div class="' + base + ' corner top right"></div><div class="' + base + ' vertical left"></div><div class="' + base + ' content">' + content + '</div><div class="' + base + ' vertical right"></div><div class="' + base + ' corner bottom left"></div><div class="' + base + ' horizontal bottom"></div><div class="' + base + ' corner bottom right"></div></div>';
}

function addBannerStyle(content, style, width) {
    if (!style) style = "mini";
    if (!width) width = "long";
    return '<div class="banner ' + width + " " + style + '"><div class="left"></div><div class="content ellipsed">' + content + '</div><div class="right"></div></div>';
}

function addFramedImg(url) {
    var img = url ? '<img class="stretched" src="' + images_path + "/" + url + '"/>' : '<div style="margin:15px">Nessuna immagine!</div>';
    return '<div class="inline-img"><div class="frame corner top left"></div><div class="frame horizontal top"></div><div class="frame corner top right"></div><div class="frame vertical left"></div><div class="frame content">' + img + '</div><div class="frame vertical right"></div><div class="frame corner bottom left"></div><div class="frame horizontal bottom"></div><div class="frame corner bottom right"></div></div>';
}

function limitPrc(prc) {
    if (prc < 0) prc = 0; else if (prc > 100) prc = 100;
    return prc;
}

function prcBar(prc, color, txt) {
    return '<div class="meter2' + (txt ? " withtxtbox" : "") + '"><div class="barcont"><span class="' + color + '" style="width:' + limitPrc(prc) + '%"></span></div>' + (txt ? '<div class="metertxt">' + txt + "</div>" : "") + "</div>";
}

function prcBicolorBar(prc1, color1, id1, prc2, color2, id2, txt) {
    return '<div class="meter2' + (txt ? " withtxtbox" : "") + '"><div class="barcont"><span ' + (id1 ? 'id="' + id1 + '" ' : "") + 'class="' + color1 + ' up" style="width:' + limitPrc(prc1) + '%"></span><span ' + (id2 ? 'id="' + id2 + '" ' : "") + 'class="' + color2 + ' low" style="width:' + limitPrc(prc2) + '%"></span></div>' + (txt ? '<div class="metertxt">' + txt + "</div>" : "") + "</div>";
}

function prcLowTxt(val, values) {
    for (var i = 0; i < values.length; ++i) if (val <= values[i].val) return values[i].txt;
    return null;
}

function prcHighTxt(val, values) {
    for (var i = 0; i < values.length; ++i) if (val >= values[i].val) return values[i].txt;
    return null;
}

function buttonbarInit() {
    var buttons = [ {
        id: "#skybutton",
        cmd: "data; clima",
        text: true
    }, {
        id: "#infobutton",
        cmd: "info"
    }, {
        id: "#statusbutton",
        cmd: "stato",
        text: true
    }, {
        id: "#invbutton",
        cmd: "invent"
    }, {
        id: "#equipbutton",
        cmd: "equip"
    }, {
        id: "#skillsbutton",
        cmd: "abilit",
        text: true
    }, {
        id: "#coinsbutton",
        cmd: "monete",
        text: true
    }, {
        id: "#detailsbutton",
        cmd: function() {
            toggleDialog("#detailsdialog");
        }
    }, {
        id: "#configbutton",
        cmd: function() {
            toggleDialog("#configdialog");
        }
    }, {
        id: "#logbutton",
        cmd: function() {
            toggleDialog("#logdialog");
        }
    }, {
        id: "#fullscreenbutton",
        cmd: function() {
            $(document).toggleFullScreen();
        }
    }, {
        id: "#connectbutton",
        cmd: function() {
            disconnectFromServer();
        }
    } ];
    $.each(buttons, function(idx, bdata) {
        var button = $(bdata.id).button({
            text: false,
            label: null,
            icons: {
                primary: null,
                secondary: null
            }
        }).empty();
        if (bdata.cmd) {
            button.click(typeof bdata.cmd == "function" ? bdata.cmd : function() {
                if (ingame) processCommands(bdata.cmd);
                if (bdata.text) openDialog("#textdialog");
            });
        }
    });
    $("body").toggleClass("topdown", client_options.buttonsOnTop);
    $("#buttonsbar").fadeIn("slow");
}

function weightStr(wgt) {
    return wgt + " pietr" + (wgt == 1 ? "a" : "e");
}

function tooltipsInit() {
    if (!$.support.touch) {
        $(document).tooltip({
            items: "[tooltip], .hstat, #combatfilter",
            tooltipClass: "tg-tooltip",
            position: {
                my: "center bottom",
                at: "center top-5"
            },
            content: function(e) {
                var element = $(this);
                if (element.is(".hstat")) {
                    var c = element.attr("condprc");
                    var m = element.attr("moveprc");
                    var w = element.attr("wgt");
                    var bar;
                    if (m) bar = prcBicolorBar(c, "red", null, m, "green", null); else bar = prcBar(c, "red", w != null ? "Ingombro: " + weightStr(w) : null);
                    return bar;
                } else if (element.is('[cnttype="equip"]')) {
                    var res = '<div class="tt-bigbox">' + element.attr("tooltip");
                    var wgt = element.attr("wgt");
                    var cnd = element.attr("condprc");
                    if (wgt) res += "<p>Ingombro: " + weightStr(wgt) + "</p>";
                    if (cnd) res += prcBar(cnd, "red");
                    res += "</div>";
                    return res;
                } else if (element.is("#combatfilter")) {
                    var title = combat_filters[client_options.combatFilter].name;
                    if (title.length > 0) return '<div class="tt-paper"><em class="tt-rivet ellipsed">Filtra: ' + title + "</em></div>"; else return null;
                } else if (element.is("[tooltip]")) {
                    var title = element.attr("tooltip");
                    if (title.length > 0) return '<div class="tt-paper"><em class="tt-rivet ellipsed">' + title + "</em></div>"; else return null;
                }
            }
        });
    }
}

function audioInit() {
    if (typeof client_options.musicVolume != "number" || client_options.musicVolume < 0 || client_options.musicVolume > 100) client_options.musicVolume = 70;
    if (typeof client_options.soundVolume != "number" || client_options.soundVolume < 0 || client_options.soundVolume > 100) client_options.soundVolume = 100;
    $("#music").get(0).volume = client_options.musicVolume / 100;
    $("#sound").get(0).volume = client_options.soundVolume / 100;
}

function playMusic(music) {
    if (client_options.musicVolume > 0) {
        var current_src = $("#music").attr("src");
        var new_src = sounds_path + "/" + music;
        if (current_src != new_src || $("#music").prop("paused") == true) $("#music").attr("src", new_src);
    }
}

function playSound(sound) {
    if (client_options.soundVolume > 0) {
        var current_src = $("#sound").attr("src");
        var new_src = sounds_path + "/" + sound;
        if (current_src != new_src || $("#sound").prop("ended")) $("#sound").attr("src", new_src);
    }
}

function playAudio(audio) {
    var mp3 = ".mp3";
    var mid = ".mid";
    if (audio.indexOf(mp3, audio.length - mp3.length) !== -1) {
        playMusic(audio);
    } else if (audio.indexOf(mid, audio.length - mid.length) !== -1) {
        playMusic(audio.replace(".mid", ".mp3"));
    } else if (client_options.soundVolume > 0) {
        playSound(audio.replace(".wav", ".mp3"));
    }
}

function textButtonsInit() {
    $("#inputmodifiers").buttonset();
    $("#inputmodifiers :radio").click(function(e) {
        cmd_prefix = $(this).val();
    });
}

var equip_races = [ "human_m", "human_f", "halfling_m", "halfling_f", "elf_m", "elf_f", "dwarf_m", "dwarf_f", "goblin_m", "goblin_f", "orc_m", "orc_f" ];

var equip_positions_by_name = {
    r_finger: "Al dito destro",
    l_finger: "Al dito sinistro",
    neck: "Al collo",
    body: "Sul corpo",
    head: "In testa",
    legs: "Sulle gambe",
    feet: "Ai piedi",
    hands: "Sulle mani",
    arms: "Sulle braccia",
    around: "Attorno al corpo",
    waist: "In vita",
    r_wrist: "Al polso destro",
    l_wrist: "Al polso sinistro",
    r_hand: "Nella mano destra",
    l_hand: "Nella mano sinistra",
    back: "Sulla schiena",
    r_ear: "All'orecchio destro",
    l_ear: "All'orecchio sinistro",
    eyes: "Sugli occhi",
    sheath: "Nel fodero",
    belt: "Alla cintura",
    over: "A tracolla",
    r_shoulder: "Sulla spalla destra",
    l_shoulder: "Sulla spalla sinistra",
    tied: "Imprigionato"
};

var equip_positions_by_num = [ "" ].concat($.map(equip_positions_by_name, function(v) {
    return v;
}));

var race_to_class = {
    uma: "human",
    ume: "human",
    eal: "elf",
    esi: "elf",
    dra: "elf",
    drw: "elf",
    meu: "human",
    mel: "human",
    hal: "halfling",
    nan: "dwarf",
    orc: "orc",
    gob: "goblin",
    els: "elf"
};

function updateWeight(weight, wprc) {
    wprc = limitPrc(wprc);
    var txtcolor = prcHighTxt(wprc, wgttxtcol);
    var barcolor = prcHighTxt(wprc, wgtbarcol);
    $(".carrywgt").css("color", txtcolor).text(weight);
    $(".carrywgtprc").css("color", txtcolor).text(wprc);
    $(".carrywgtbar").css("width", wprc + "%").removeClass("red yellow green").addClass(barcolor);
}

function equipSetRace(racesex) {
    if (eqracesex != racesex) {
        eqracesex = racesex;
        $("#equipcont").removeClass(equip_races.join(" ")).addClass(racesex);
    }
}

function equipPosItem(idx) {
    return '<li class="eqslot eq' + idx + '"></li>';
}

function equipPosContainer(posname, cont) {
    return '<ul id="' + posname + '" class="' + posname + '">' + cont + "</ul>";
}

function equipShowSub() {
    $(this).siblings("ul").fadeOut("fast");
    $(this).children(".enabled").show().each(function(idx, slot) {
        if (idx > 0) {
            var offx = 43 * (idx & 3);
            var offy = 43 * (idx >> 2);
            $(slot).animate({
                left: "+=" + offx,
                top: "+=" + offy,
                "z-index": "+=5"
            }, "fast");
        }
    });
}

function equipHideSub() {
    $(this).siblings("ul").fadeIn("fast");
    $(this).children(".enabled").each(function(idx, slot) {
        if (idx > 0) {
            var offx = 43 * (idx & 3);
            var offy = 43 * (idx >> 2);
            $(slot).animate({
                left: "-=" + offx,
                top: "-=" + offy,
                "z-index": "-=5"
            }, "fast", function() {
                $(this).hide();
            });
        }
    });
}

function equipInit(aslist) {
    $("#equipdialog .iron.content").empty();
    $("#equipdialog").toggleClass("aslist", aslist);
    if (aslist) {
        $("#equipdialog .iron.content").append('<div id="equipcont" class="scrollable-y" cont-type="pc-equip"></div>');
    } else {
        $("#equipdialog .iron.content").append('<div id="equipcont" class="equip-inner container human_m" cont-type="pc-equip"></div>');
        var innercontainer = $("#equipcont");
        $.each(equip_positions_by_name, function(posname, posdesc) {
            var elems = "";
            for (var i = 0; i < 8; ++i) elems += equipPosItem(i);
            innercontainer.append(equipPosContainer(posname, elems));
        });
        $("ul", innercontainer).hoverIntent({
            timeout: 500,
            interval: 200,
            over: equipShowSub,
            out: equipHideSub
        });
    }
    if (isDialog("#equipdialog")) {
        var mw, mh, w, h;
        if ($("#equipdialog").is(".aslist")) {
            mw = 360;
            mh = 200;
        } else {
            mw = 550;
            mh = 710;
        }
        $("#equipdialog").dialog({
            minWidth: mw,
            minHeight: mh
        });
        w = $("#equipdialog").dialog("option", "width");
        h = $("#equipdialog").dialog("option", "height");
        if (w < mw) $("#equipdialog").dialog("option", "width", mw);
        if (h < mh) $("#equipdialog").dialog("option", "height", mh);
    }
    if (lastEquip) equipUpdate(lastEquip);
}

function equipUpdate(eq) {
    if ($("#equipdialog").is(".aslist")) {
        var cont = {
            list: []
        };
        $.each(eq, function(poskey, eqdata) {
            var where = equip_positions_by_name[poskey];
            if (where) cont.list = cont.list.concat(eqdata);
        });
        var invdata = $(replaceColors(renderDetailsList("equip", null, cont, "obj")));
        makeExpandable(invdata);
        $("#equipcont").empty().append(invdata);
    } else {
        if (!eq.race) eq.race = 0;
        if (!eq.sex) eq.sex = "f";
        equipSetRace(race_to_class[eq.race] + "_" + eq.sex);
        $(".enabled", "#equipcont").removeClass("enabled");
        $(".iconimg", "#equipcont").remove();
        $("#equipcont").children("ul").each(function(idx, pos) {
            var where = equip_positions_by_name[pos.id];
            var eqdata = eq[pos.id];
            var cont = $(pos);
            if (eqdata) {
                eqdata.sort(function(a, b) {
                    var eq_pos_a = $.isArray(a.eq) ? a.eq[1] : 0;
                    var eq_pos_b = $.isArray(b.eq) ? b.eq[1] : 0;
                    return eq_pos_b - eq_pos_a;
                });
                $.each(eqdata, function(idx, obj) {
                    var slot = $(".eq" + idx, cont);
                    var desc = where + ": " + obj.desc;
                    var img = $(renderIcon(obj.icon, obj.mrn[0], "equip", null, null, "interact obj")).attr("tooltip", desc).attr("wgt", obj.wgt).attr("condprc", obj.condprc);
                    slot.append(img).addClass("enabled");
                });
            }
        });
    }
    addDragAndDrop("#equipcont");
    updateWeight(eq.weight, eq.wprc);
    lastEquip = eq;
    if (client_update.equipment.version < eq.ver) {
        client_update.equipment.version = eq.ver;
        client_update.equipment.needed = false;
    }
}

function renderEquipment(eq) {
    if (!eq.up) {
        if (!openDialog("#equipdialog")) {
            var pos = getWindowPosition("equipdialog");
            var size = getWindowSize("equipdialog");
            var w, h, mw, mh;
            if (size) {
                w = size[0];
                h = size[1];
            } else {
                if ($("#equipdialog").is(".aslist")) {
                    w = 360;
                    h = 300;
                } else {
                    w = 550;
                    h = 710;
                }
            }
            if ($("#equipdialog").is(".aslist")) {
                mw = 360;
                mh = 200;
            } else {
                mw = 550;
                mh = 710;
            }
            if (w < mw) w = mw;
            if (h < mh) h = mh;
            if (pos == null) pos = {
                my: "center",
                at: "center",
                of: desktop
            };
            $("#equipdialog").dialog({
                modal: false,
                title: addBannerStyle("Equipaggiamento"),
                width: w,
                height: h,
                minWidth: mw,
                minHeight: mh,
                position: pos,
                dialogClass: "tg-dialog parch equip",
                dragStop: saveWindowData,
                resizeStop: saveWindowData,
                closeText: "Chiudi"
            });
        }
    }
    equipUpdate(eq);
}

function updateInventory(inv) {
    var invcont = $("#invcont");
    updateWeight(inv.weight, inv.wprc);
    invcont.empty();
    if (inv.list.length == 0) invcont.append("<tr><td></td><td>Non hai niente in inventario!</td></tr>"); else {
        var invdata = $(replaceColors(renderDetailsList("inv", null, inv, "obj")));
        makeExpandable(invdata);
        addDragAndDrop(invdata);
        invcont.append(invdata);
    }
    if (client_update.inventory.version < inv.ver) {
        client_update.inventory.version = inv.ver;
        client_update.inventory.needed = false;
    }
}

function renderInventory(invent) {
    if (!invent.up) {
        if (!openDialog("#invdialog")) {
            var pos = getWindowPosition("invdialog");
            var size = getWindowSize("invdialog");
            var w, h;
            if (size) {
                w = size[0];
                h = size[1];
            } else {
                w = 360;
                h = $(desktop).height() - 386;
            }
            if (pos == null) pos = {
                my: "right top",
                at: "right bottom",
                of: "#mapdialog"
            };
            $("#invdialog").dialog({
                modal: false,
                title: addBannerStyle("Inventario"),
                width: w,
                height: h,
                minWidth: 360,
                minHeight: 200,
                position: pos,
                dialogClass: "tg-dialog parch",
                dragStop: saveWindowData,
                resizeStop: saveWindowData,
                closeText: "Chiudi"
            });
        }
    }
    updateInventory(invent);
}

function interactEvent(event) {
    if (ingame && !dragging) {
        if ($(this).is("td")) {
            switch (event.which) {
              case 1:
                var dir = $(this).attr("dir");
                if (dir == "here") sendToServer("guarda"); else sendToServer("guarda " + dir);
                break;
            }
        } else {
            switch (event.which) {
              case 1:
                var mrn = $(this).attr("mrn");
                var cmd = $(this).attr("cmd");
                if (cmd == null) {
                    cmd = $(this).is(".where") ? "@agg" : "guarda";
                }
                if (!mrn || mrn == 0) {
                    sendToServer(cmd);
                } else {
                    var cnttype = $(this).attr("cnttype");
                    var cntmrn = $(this).attr("cntmrn");
                    if (cnttype == "inv") sendToServer(cmd + " &" + mrn); else if (cntmrn && !isNaN(parseInt(cntmrn))) sendToServer(cmd + " &" + mrn + " &" + cntmrn); else sendToServer(cmd + " &" + mrn);
                }
                break;
            }
        }
    }
    return true;
}

var obj_interaction_config = {
    equip: [ ".eqp-out", ".inv-out", ".wpn-out", ".wpn-in" ],
    inv: [ ".inv-out", ".eqp-in", ".wpn-in" ],
    room: [ ".inv-in", ".eqp-in", ".wpn-in" ],
    obj: [ ".inv-in", ".inv-out", ".eqp-in", ".wpn-in" ],
    pers: [ ".inv-out", ".meq-out", ".meq-in" ]
};

function updateInteractBox(config) {
    if (config && config.length) {
        var box = $("#interactbox");
        var cont = $("#interactbox");
        $(".interact-elem", cont).hide();
        $.each(config, function(idx, elemclass) {
            $(elemclass, cont).show();
        });
        box.height(18 + 64 * config.length);
        return true;
    }
    return false;
}

function addDragAndDrop(objs) {
    $(".iconimg.interact", objs).draggable({
        addClasses: false,
        appendTo: "body",
        helper: function() {
            return $(this).clone().removeAttr("tooltip");
        },
        revert: "invalid",
        scroll: false,
        zIndex: 1e4,
        distance: 5,
        start: function(event, ui) {
            dragging = true;
            var what = $(this);
            if (what.is(".obj")) if (updateInteractBox(obj_interaction_config[what.attr("cnttype")])) $("#interactbox").show().position({
                my: "right center",
                at: "left center",
                of: what
            });
        },
        stop: function(event, ui) {
            dragging = false;
            $("#interactbox").hide();
            if (at_drag_stop_func) {
                at_drag_stop_func();
                max_drop_stack = 0;
                at_drag_stop_func = null;
            }
        }
    }).droppable({
        accept: ".obj",
        greedy: true,
        drop: function(event, ui) {
            iconToIcon(ui.draggable, $(this));
        }
    });
}

function interactionInit() {
    $(document).bind("contextmenu", function(e) {
        e.preventDefault();
    });
    $(document).on("mouseup", ".interact", interactEvent);
    var cont = $("#interactbox");
    $(".inv-in", cont).droppable({
        accept: ".obj",
        hoverClass: "valid",
        greedy: true,
        drop: function(event, ui) {
            var zidx = 1e4;
            if (max_drop_stack < zidx) {
                at_drag_stop_func = function() {
                    toInventory(ui.draggable);
                };
                max_drop_stack = zidx;
            }
            return false;
        }
    });
    $(".inv-out", cont).droppable({
        accept: ".obj",
        hoverClass: "valid",
        greedy: true,
        drop: function(event, ui) {
            var zidx = 1e4;
            if (max_drop_stack < zidx) {
                at_drag_stop_func = function() {
                    fromInventory(ui.draggable);
                };
                max_drop_stack = zidx;
            }
            return false;
        }
    });
    $(".eqp-in", cont).droppable({
        accept: ".obj",
        hoverClass: "valid",
        greedy: true,
        drop: function(event, ui) {
            var zidx = 1e4;
            if (max_drop_stack < zidx) {
                at_drag_stop_func = function() {
                    toEquip(ui.draggable);
                };
                max_drop_stack = zidx;
            }
            return false;
        }
    });
    $(".eqp-out", cont).droppable({
        accept: ".obj",
        hoverClass: "valid",
        greedy: true,
        drop: function(event, ui) {
            var zidx = 1e4;
            if (max_drop_stack < zidx) {
                at_drag_stop_func = function() {
                    fromEquip(ui.draggable);
                };
                max_drop_stack = zidx;
            }
            return false;
        }
    });
    $(".wpn-in", cont).droppable({
        accept: ".obj",
        hoverClass: "valid",
        greedy: true,
        drop: function(event, ui) {
            var zidx = 1e4;
            if (max_drop_stack < zidx) {
                at_drag_stop_func = function() {
                    toHand(ui.draggable);
                };
                max_drop_stack = zidx;
            }
            return false;
        }
    });
    $(".wpn-out", cont).droppable({
        accept: ".obj",
        hoverClass: "valid",
        greedy: true,
        drop: function(event, ui) {
            var zidx = 1e4;
            if (max_drop_stack < zidx) {
                at_drag_stop_func = function() {
                    fromHand(ui.draggable);
                };
                max_drop_stack = zidx;
            }
            return false;
        }
    });
    $(".meq-in", cont).droppable({
        accept: ".obj",
        hoverClass: "valid",
        greedy: true,
        drop: function(event, ui) {
            var zidx = 1e4;
            if (max_drop_stack < zidx) {
                at_drag_stop_func = function() {
                    toMobEquip(ui.draggable);
                };
                max_drop_stack = zidx;
            }
            return false;
        }
    });
    $(".meq-out", cont).droppable({
        accept: ".obj",
        hoverClass: "valid",
        greedy: true,
        drop: function(event, ui) {
            var zidx = 1e4;
            if (max_drop_stack < zidx) {
                at_drag_stop_func = function() {
                    fromEquip(ui.draggable);
                };
                max_drop_stack = zidx;
            }
            return false;
        }
    });
    $("#invdialog").droppable({
        accept: ".obj",
        hoverClass: "valid",
        greedy: true,
        drop: function(event, ui) {
            var zidx = parseInt($(this).dialog("widget").css("z-index"));
            if (max_drop_stack < zidx) {
                at_drag_stop_func = function() {
                    toInventory(ui.draggable);
                };
                max_drop_stack = zidx;
            }
            return false;
        }
    });
    $("#equipdialog").droppable({
        accept: ".obj",
        hoverClass: "valid",
        greedy: true,
        drop: function(event, ui) {
            var zidx = parseInt($(this).dialog("widget").css("z-index"));
            if (max_drop_stack < zidx) {
                at_drag_stop_func = function() {
                    toEquip(ui.draggable);
                };
                max_drop_stack = zidx;
            }
            return false;
        }
    });
    $("#details-room .content").droppable({
        accept: ".obj",
        hoverClass: "valid",
        greedy: true,
        drop: function(event, ui) {
            var zidx = parseInt($("#detailsdialog").dialog("widget").css("z-index"));
            if (max_drop_stack < zidx) {
                at_drag_stop_func = function() {
                    fromInventory(ui.draggable);
                };
                max_drop_stack = zidx;
            }
            return false;
        }
    });
    $("#details-pers .content").droppable({
        accept: ".obj",
        hoverClass: "valid",
        greedy: true,
        drop: function(event, ui) {
            var zidx = parseInt($("#detailsdialog").dialog("widget").css("z-index"));
            if (max_drop_stack < zidx) {
                at_drag_stop_func = function() {
                    var cnt = $("#details-pers");
                    iconToDest(ui.draggable, "pers", cnt.attr("mrn"), cnt.attr("cnttype"), cnt.attr("cntmrn"));
                };
                max_drop_stack = zidx;
            }
            return false;
        }
    });
    $("#details-obj .content").droppable({
        accept: ".obj",
        hoverClass: "valid",
        greedy: true,
        drop: function(event, ui) {
            var zidx = parseInt($("#detailsdialog").dialog("widget").css("z-index"));
            if (max_drop_stack < zidx) {
                at_drag_stop_func = function() {
                    var cnt = $("#details-obj");
                    iconToDest(ui.draggable, "obj", cnt.attr("mrn"), cnt.attr("cnttype"), cnt.attr("cntmrn"));
                };
                max_drop_stack = zidx;
            }
            return false;
        }
    });
}

function iconToDest(obj1, type2, mrn2, cnttype2, cntmrn2) {
    var mrn1 = $(obj1).attr("mrn");
    var cnttype1 = $(obj1).attr("cnttype");
    switch (cnttype1) {
      case "inv":
        if (type2 == "obj") {
            cmd = "metti &" + mrn1 + " &" + mrn2;
            if (whichTabIsOpen("#detailsdialog") == 2) cmd += "; @agg &" + mrn2;
        } else if (type2 == "pers") {
            cmd = "dai &" + mrn1 + " &" + mrn2;
            if (whichTabIsOpen("#detailsdialog") == 1) cmd += "; @agg &" + mrn2;
        } else return;
        break;

      case "room":
        switch (cnttype2) {
          case "room":
            cmd = "carica &" + mrn1 + " &" + mrn2;
            if (whichTabIsOpen("#detailsdialog") == 2) cmd += "; @agg &" + mrn2;
            if (whichTabIsOpen("#detailsdialog") == 0) cmd += "; @agg";
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

function iconToIcon(obj1, obj2) {
    var mrn2 = $(obj2).attr("mrn");
    var cnttype2 = $(obj2).attr("cnttype");
    var cntmrn2 = $(obj2).attr("cntmrn");
    var type2;
    if ($(obj2).is(".obj")) type2 = "obj"; else if ($(obj2).is(".pers")) type2 = "pers";
    iconToDest(obj1, type2, mrn2, cnttype2, cntmrn2);
}

function toMobEquip(obj) {
    var mrn = $(obj).attr("mrn");
    var cnttype = $(obj).attr("cnttype");
    var cmd;
    switch (cnttype) {
      case "pers":
        var cntmrn = $(obj).attr("cntmrn");
        cmd = "barda &" + cntmrn + " &" + mrn;
        if (whichTabIsOpen("#detailsdialog") == 1) cmd += "; @agg &" + cntmrn;
        break;

      default:
        return;
    }
    processCommands(cmd);
}

function toEquip(obj) {
    var mrn = $(obj).attr("mrn");
    var cnttype = $(obj).attr("cnttype");
    var cmd;
    switch (cnttype) {
      case "room":
        cmd = "prendi &" + mrn + "; indossa &" + mrn;
        if (whichTabIsOpen("#detailsdialog") == 0) cmd += "; @agg";
        break;

      case "inv":
        cmd = "indossa &" + mrn;
        break;

      case "obj":
        var cntmrn = $(obj).attr("cntmrn");
        cmd = "prendi &" + mrn + " &" + cntmrn + "; indossa &" + mrn;
        if (whichTabIsOpen("#detailsdialog") == 2) cmd += "; @agg &" + cntmrn;
        break;

      case "pers":
        var cntmrn = $(obj).attr("cntmrn");
        cmd = "barda &" + cntmrn + " &" + mrn;
        if (whichTabIsOpen("#detailsdialog") == 1) cmd += "; @agg &" + cntmrn;
        break;

      default:
        return;
    }
    processCommands(cmd);
}

function fromEquip(obj) {
    var mrn = $(obj).attr("mrn");
    var cnttype = $(obj).attr("cnttype");
    var cmd;
    switch (cnttype) {
      case "equip":
        cmd = "rimuovi &" + mrn;
        break;

      case "pers":
        var cntmrn = $(obj).attr("cntmrn");
        cmd = "rimuovi &" + mrn + " &" + cntmrn;
        if (whichTabIsOpen("#detailsdialog") == 1) cmd += "; @agg &" + cntmrn;
        break;

      default:
        return;
    }
    processCommands(cmd);
}

function toInventory(obj) {
    var mrn = $(obj).attr("mrn");
    var cnttype = $(obj).attr("cnttype");
    var cmd;
    switch (cnttype) {
      case "room":
        cmd = "prendi &" + mrn;
        if (whichTabIsOpen("#detailsdialog") == 0) cmd += "; @agg";
        break;

      case "equip":
        cmd = "rimuovi &" + mrn;
        break;

      case "obj":
        var cntmrn = $(obj).attr("cntmrn");
        cmd = "prendi &" + mrn + " &" + cntmrn;
        if (whichTabIsOpen("#detailsdialog") == 2) cmd += "; @agg &" + cntmrn;
        break;

      case "pers":
        var cntmrn = $(obj).attr("cntmrn");
        cmd = "prendi &" + mrn + " &" + cntmrn;
        if (whichTabIsOpen("#detailsdialog") == 1) cmd += "; @agg &" + cntmrn;
        break;

      default:
        return;
    }
    processCommands(cmd);
}

function fromInventory(obj) {
    var mrn = $(obj).attr("mrn");
    var cnttype = $(obj).attr("cnttype");
    var cmd;
    switch (cnttype) {
      case "inv":
        cmd = "posa &" + mrn;
        break;

      case "equip":
        cmd = "rimuovi &" + mrn + "; posa &" + mrn;
        break;

      case "obj":
        var cntmrn = $(obj).attr("cntmrn");
        cmd = "scarica &" + mrn + " &" + cntmrn;
        if (whichTabIsOpen("#detailsdialog") == 2) cmd += "; @agg &" + cntmrn;
        break;

      case "pers":
        var cntmrn = $(obj).attr("cntmrn");
        cmd = "scarica &" + mrn + " &" + cntmrn;
        if (whichTabIsOpen("#detailsdialog") == 1) cmd += "; @agg &" + cntmrn;
        break;

      default:
        return;
    }
    processCommands(cmd);
}

function toHand(obj) {
    var mrn = $(obj).attr("mrn");
    var cnttype = $(obj).attr("cnttype");
    var cmd;
    switch (cnttype) {
      case "room":
        cmd = "prendi &" + mrn + "; impugna &" + mrn;
        if (whichTabIsOpen("#detailsdialog") == 0) cmd += "; @agg";
        break;

      case "inv":
        cmd = "impugna &" + mrn;
        break;

      case "equip":
        cmd = "sfodera &" + mrn;
        break;

      case "obj":
        var cntmrn = $(obj).attr("cntmrn");
        cmd = "prendi &" + mrn + " &" + cntmrn + "; impugna &" + mrn;
        if (whichTabIsOpen("#detailsdialog") == 2) cmd += "; @agg &" + cntmrn;
        break;

      default:
        return;
    }
    processCommands(cmd);
}

function fromHand(obj) {
    var mrn = $(obj).attr("mrn");
    var cnttype = $(obj).attr("cnttype");
    var cmd;
    switch (cnttype) {
      case "equip":
        cmd = "riponi &" + mrn;
        break;

      default:
        return;
    }
    processCommands(cmd);
}

function imageInit() {
    var pos = getWindowPosition("imagedialog");
    if (pos == null) pos = {
        my: "right bottom",
        at: "right bottom",
        of: desktop
    };
    $("#imagedialog").dialog({
        closeOnEscape: false,
        autoOpen: false,
        dialogClass: "tg-dialog notitle",
        width: 208,
        height: 178,
        resizable: false,
        draggable: false,
        dragStop: saveWindowData,
        position: pos
    });
    $("#imagedialog").dialog("widget").draggable({
        containment: "window",
        stop: saveWindowData
    });
    $("#image-cont").on("error", function() {
        showImage($(this), "tglogo.jpg");
    });
}

function renderTable(t) {
    var txt = "<table>";
    if (t.title && t.dialog == false) txt += "<caption>" + (t.plain ? t.title : addBannerStyle(t.title)) + "</caption>";
    if (t.head) {
        txt += "<thead><tr>";
        $.each(t.head, function(i, v) {
            switch ($.type(v)) {
              case "object":
                txt += "<th>" + v.title + "</th>";
                break;

              default:
                txt += "<th>" + v + "</th>";
                break;
            }
        });
        txt += "</tr></thead>";
    }
    if (t.data) {
        $.each(t.data, function(ri, row) {
            txt += "<tr>";
            $.each(row, function(di, elem) {
                var h = t.head ? t.head[di] : null;
                switch ($.type(h)) {
                  case "object":
                    switch (h.type) {
                      case "account":
                        txt += '<td><a target="_blank" href="/admin/accounts/' + elem + '">' + elem + "</a></td>";
                        break;

                      case "ipaddr":
                        txt += '<td><a target="_blank" href="http://www.infosniper.net/index.php?ip_address=' + elem + '">' + elem + "</a></td>";
                        break;

                      case "icon":
                        txt += "<td>" + renderIcon(elem) + "</td>";
                        break;

                      default:
                        txt += "<td>" + elem + "</td>";
                        break;
                    }
                    break;

                  default:
                    txt += "<td>" + elem + "</td>";
                    break;
                }
            });
            txt += "</tr>";
        });
    }
    txt += "</table>";
    if (t.dialog == false) return t.plain ? txt : addFrameStyle(txt);
    renderInTableDialog(t.title ? t.title : "Informazioni", txt);
    if (t.head) $("#tablecont table").tablesorter();
    return "";
}

function renderCommandsList(cmd) {
    var cols = 6;
    var txt = '<table class="cmd"><caption>' + addBannerStyle(cmd.title) + "</caption>";
    delete cmd.title;
    $.each(cmd, function(group, data) {
        txt += '<tr><th colspan="' + cols + '">Comandi ' + group + ":</th></tr>";
        $.each(data.sort(), function(idx, command) {
            if (idx % cols == 0) txt += "<tr>";
            txt += "<td>" + command + "</td>";
            if (idx % cols == cols - 1 || idx == data.length - 1) txt += "</tr>";
        });
    });
    txt += "</table>";
    return addFrameStyle(txt, "small");
}

function renderInTableDialog(title, txt) {
    var options = {};
    if (!openDialog("#tabledialog")) {
        var pos = getWindowPosition("tabledialog");
        var size = getWindowSize("tabledialog");
        var w, h;
        if (size) {
            w = size[0];
            h = size[1];
        } else {
            w = 650;
            h = 600;
        }
        if (pos == null) pos = {
            my: "center",
            at: "center",
            of: desktop
        };
        options = {
            modal: false,
            width: w,
            height: h,
            minWidth: 550,
            maxWidth: 1e3,
            minHeight: 200,
            position: pos,
            dialogClass: "tg-dialog parch styledbuttons",
            dragStop: saveWindowData,
            resizeStop: saveWindowData,
            closeText: "Chiudi"
        };
    }
    $.extend(options, {
        title: addBannerStyle(title)
    });
    $("#tablecont").empty().append(addFrameStyle(removeColors(txt), "large"));
    $("#tabledialog").dialog(options);
}

function renderWorksList(wk) {
    var txt = '<table class="list"><thead><tr><th>#</th><th style="width:50px"></th><th>Difficolt&agrave;</th><th>Puoi?</th><th>Descrizione</th></tr></thead><tbody>';
    for (var n = 0; n < wk.list.length; n++) {
        txt += "<tr><td>" + (n + 1) + "</td><td>" + renderIconWithSmallBorder(wk.list[n].icon, null, null, null, wk.cmd ? wk.cmd + " " + (n + 1) : null, "interact obj") + "</td><td>" + wk.list[n].diff + '</td><td><div class="checkbox' + (wk.list[n].cando ? " checked" : "") + '"></div></td><td>' + wk.list[n].desc + "</td></tr>";
    }
    txt += "</tbody></table>";
    renderInTableDialog("Potresti " + wk.verb + ":", txt);
    $("#tablecont table").tablesorter({
        headers: {
            1: {
                sorter: false
            },
            2: {
                sorter: "difficulties"
            },
            3: {
                sorter: "checks"
            },
            4: {
                sorter: "names"
            }
        }
    });
    return "";
}

function renderSkillsList(skinfo) {
    var txt = '<table class="skills">';
    if (skinfo.dialog == false) txt += "<caption>" + addBannerStyle("Abilit&agrave; conosciute") + "</caption>";
    for (var groupname in skinfo) {
        txt += '<tr><td colspan="1000" class="skillsep">' + addBannerStyle(groupname, "parch") + "</td></tr>";
        var group = skinfo[groupname];
        for (var skname in group) {
            txt += "<tr><th>" + skname + "</th>";
            var sk = group[skname];
            if ("prac" in sk && "theo" in sk) txt += "<td>" + prcBicolorBar(sk.prac, "yellow", null, sk.theo, "green", null) + "</td>";
            if ("auto" in sk) txt += "<td>" + (sk.auto ? "autodidatta" : "") + "</td>";
            if ("exp" in sk) txt += "<td>" + sk.exp + "</td>";
            if ("check" in sk) txt += "<td>" + sk.check + "</td>";
            txt += "</tr>";
        }
    }
    txt += "</table>";
    if (skinfo.dialog == false) return addFrameStyle(txt, "small");
    renderInTableDialog("Abilit&agrave; conosciute", txt);
    return "";
}

function renderPlayerStatus(status) {
    var sttxt = '<table class="stats"><caption>' + addBannerStyle("Condizioni") + "</caption>";
    var colors = [ {
        val: 15,
        txt: "red"
    }, {
        val: 40,
        txt: "brown"
    }, {
        val: 100,
        txt: "green"
    } ];
    sttxt += '<tr><th>Salute</th><td><span class="' + prcLowTxt(status.hit, colors) + '">' + status.hit + "</span>%</td><td>0%&#160;" + prcBar(status.hit, "red") + "&#160;100%</td></tr>";
    sttxt += '<tr><th>Movimento</th><td><span class="' + prcLowTxt(status.move, colors) + '">' + status.move + "</span>%</td><td>0%&#160;" + prcBar(status.move, "green") + "&#160;100%</td></tr>";
    sttxt += '<tr><th>Fame</th><td><span class="' + prcLowTxt(status.food, colors) + '">' + status.food + "</span>%</td><td>0%&#160;" + prcBar(status.food, "cookie") + "&#160;100%</td></tr>";
    sttxt += '<tr><th>Sete</th><td><span class="' + prcLowTxt(status.drink, colors) + '">' + status.drink + "</span>%</td><td>0%&#160;" + prcBar(status.drink, "blue") + "&#160;100%</td></tr>";
    if (status.msg) sttxt += "<tr><td colspan=1000>" + status.msg + "</td></tr>";
    sttxt += "</table>";
    return addFrameStyle(sttxt, "small");
}

var abiltxt = [ {
    val: 6,
    txt: "Terribile"
}, {
    val: 14,
    txt: "Pessima"
}, {
    val: 24,
    txt: "Scarsa"
}, {
    val: 34,
    txt: "Discreta"
}, {
    val: 64,
    txt: "Normale"
}, {
    val: 74,
    txt: "Buona"
}, {
    val: 84,
    txt: "Ottima"
}, {
    val: 94,
    txt: "Eccellente"
}, {
    val: 100,
    txt: "Leggendaria"
} ];

function renderPlayerInfo(info) {
    var d = $("#infocontent");
    if (info.image) $("#infoimage", d).attr("src", images_path + "/" + info.image);
    $("#infotitle", d).text(info.title);
    if (info.adjective) {
        $("#infoadj", d).text(info.adjective);
        $("#changeadj").hide();
    } else {
        $("#infoadj", d).text("Nessuno");
        $("#changeadj").show();
    }
    $("#inforace", d).text(info.race.name);
    $("#infocult", d).text(info.cult);
    $("#infoethn", d).text(info.ethn);
    $("#inforelig", d).text(info.relig ? info.relig : "Nessuna");
    $("#infoheight", d).text(info.height);
    $("#infosex", d).text(info.sex.name);
    $("#infocity", d).text(info.city ? info.city : "Nessuna");
    $("#infowgt", d).text(info.weight);
    $("#infoage", d).text(info.age);
    $("#infolang", d).text(info.lang);
    $("#infoborn", d).text(info.born);
    $("#infodesc", d).text(info.desc.replace(/([.:?!,])\s*\n/gm, "$1<p></p>").replace(/\n/gm, " "));
    $("#raceimage", d).attr("class", race_to_class[info.race.code] + "_" + info.sex.code + " img");
    $("#infowil", d).width(limitPrc(info.abil.wil.prc) + "%");
    $("#infowillvl", d).text(prcLowTxt(info.abil.wil.prc, abiltxt));
    $("#infoint", d).width(limitPrc(info.abil.int.prc) + "%");
    $("#infointlvl", d).text(prcLowTxt(info.abil.int.prc, abiltxt));
    $("#infoemp", d).width(limitPrc(info.abil.emp.prc) + "%");
    $("#infoemplvl", d).text(prcLowTxt(info.abil.emp.prc, abiltxt));
    $("#infosiz", d).width(limitPrc(info.abil.siz.prc) + "%");
    $("#infosizlvl", d).text(prcLowTxt(info.abil.siz.prc, abiltxt));
    $("#infocon", d).width(limitPrc(info.abil.con.prc) + "%");
    $("#infoconlvl", d).text(prcLowTxt(info.abil.con.prc, abiltxt));
    $("#infostr", d).width(limitPrc(info.abil.str.prc) + "%");
    $("#infostrlvl", d).text(prcLowTxt(info.abil.str.prc, abiltxt));
    $("#infodex", d).width(limitPrc(info.abil.dex.prc) + "%");
    $("#infodexlvl", d).text(prcLowTxt(info.abil.dex.prc, abiltxt));
    $("#infospd", d).width(limitPrc(info.abil.spd.prc) + "%");
    $("#infospdlvl", d).text(prcLowTxt(info.abil.spd.prc, abiltxt));
    if (!openDialog("#infodialog")) {
        var pos = getWindowPosition("infodialog");
        var size = getWindowSize("infodialog");
        var w, h;
        if (size) {
            w = size[0];
            h = size[1];
        } else {
            w = 800;
            h = 600;
        }
        if (pos == null) pos = {
            my: "center",
            at: "center",
            of: desktop
        };
        $("#infodialog").dialog({
            modal: false,
            title: addBannerStyle('<div class="left iconslot sm"><div class="iconimg" id="infoicon"></div></div><div id="infotitle" class="ellipsed" style="width:87%;padding-left:15px">Informazioni</div>'),
            width: w,
            height: h,
            minWidth: 700,
            minHeight: 400,
            position: pos,
            dialogClass: "tg-dialog parch styledbuttons",
            dragStop: saveWindowData,
            resizeStop: saveWindowData,
            closeText: "Chiudi"
        });
        $("#changedesc").button().click(function() {
            sendToServer("cambia desc");
        });
        $("#changeadj").button().click(function() {
            sendToServer("aggett list");
        });
        $("#infoimage").on("error", function() {
            $(this).hide();
        }).on("load", function() {
            $(this).show();
        });
    }
    $("#infotitle").text(info.name + ", " + info.title);
    $("#infoicon").css("background-position", tileBgPos(info.icon));
    return "";
}

function printPrompt(st) {
    return "";
}

function printPage(p) {
    return "<h3>" + p.title + "</h3><div>" + p.text.replace(/\n/gm, "<br>") + "</div>";
}

function printDecoratedDescription(type, condprc, moveprc, count, desc) {
    var res = "[" + type[0] + "]&#160;" + desc.replace(/\n/gm, " ");
    if (condprc || moveprc) {
        res += "&#160;{";
        if (condprc) res += "pf" + condprc + "%";
        if (moveprc) res += "mv" + moveprc + "%";
        res += "}";
    }
    if (count > 1) res += "&#160;[x" + count + "]";
    return res;
}

function printDetailsList(cont, type) {
    var res = "";
    if (cont.list) {
        if (cont.title) res += "<p>" + cont.title + "</p>";
        for (var n = 0; n < cont.list.length; n++) {
            var l = cont.list[n];
            res += printDecoratedDescription(type, l.condprc, l.mvprc, l.mrn ? l.mrn.length : 0, l.desc) + "<br>";
        }
        if (cont.title && (cont.list.length > 0 || cont.show === true)) res += "Niente.<br>";
    }
    return res;
}

function printDetails(info, type) {
    var res = "";
    if (info.title) res += "<h3>" + capFirstLetter(info.title) + "</h3>";
    if (info.action) res += "<p>" + info.action + "</p>";
    if (info.desc) {
        if (info.desc.base) res += formatText(info.desc.base);
        if (info.desc.details) res += formatText(info.desc.details);
        if (info.desc.equip) res += formatText(info.desc.equip);
    }
    if (info.perscont) res += printDetailsList(info.perscont, "pers");
    if (info.objcont) res += printDetailsList(info.objcont, "obj");
    if (info.eqcont) res += printDetailsList(info.eqcont, "obj");
    return res;
}

function printInventory(inv) {
    if (inv.list.length == 0) return "<p>Non hai niente in inventario!</p>"; else return "<h4>Il tuo inventario:</h4>" + removeColors(printDetailsList(inv, "obj"));
}

function printEquipment(eq) {
    var res = "";
    var eqcount = 0;
    $.each(equip_positions_by_name, function(posname, posdesc) {
        var eqdata = eq[posname];
        if (eqdata) {
            $.each(eqdata, function(idx, obj) {
                res += posdesc + ": " + printDecoratedDescription("obj", obj.condprc, null, 1, obj.desc) + "<br>";
                eqcount++;
            });
        }
    });
    if (eqcount == 0) return "<p>Non hai equipaggiato nulla!</p>"; else return "<p>Equipaggiamento:</p>" + res;
}

function printWorksList(wk) {
    var txt = "<table><caption>Potresti " + wk.verb + ":</caption>";
    txt += "<thead><tr><th>#</th><th>Difficolt&agrave;</th><th>Puoi?</th><th>Descrizione</th></tr></thead><tbody>";
    for (var n = 0; n < wk.list.length; n++) txt += "<tr><td>" + (n + 1) + "</td><td>" + wk.list[n].diff + "</td><td>" + (wk.list[n].cando ? "si" : "no") + "</td><td>" + wk.list[n].desc + "</td></tr>";
    txt += "</tbody></table>";
    return txt;
}

function printSkillsList(skinfo) {
    var txt = "<table><caption>Abilit&agrave; conosciute</caption>";
    for (var groupname in skinfo) {
        txt += '<tr><td colspan="1000"><h3>' + groupname + "</h3></td></tr>";
        var group = skinfo[groupname];
        for (var skname in group) {
            txt += "<tr><th>" + skname + "</th>";
            var sk = group[skname];
            if ("prac" in sk && "theo" in sk) txt += "<td>" + sk.prac + "</td><td>" + sk.theo + "</td>";
            if ("auto" in sk) txt += "<td>" + (sk.auto ? "autodidatta" : "") + "</td>";
            txt += "</tr>";
        }
    }
    txt += "</table>";
    return txt;
}

function printPlayerInfo(info) {
    var abiltxt = [ {
        val: 6,
        txt: "Terribile"
    }, {
        val: 14,
        txt: "Pessima"
    }, {
        val: 24,
        txt: "Scarsa"
    }, {
        val: 34,
        txt: "Discreta"
    }, {
        val: 64,
        txt: "Normale"
    }, {
        val: 74,
        txt: "Buona"
    }, {
        val: 84,
        txt: "Ottima"
    }, {
        val: 94,
        txt: "Eccellente"
    }, {
        val: 100,
        txt: "Leggendaria"
    } ];
    return "<table><caption>" + info.name + ", " + info.title + "</caption>" + "<tr><th>Descrizione</th><td colspan=3>" + info.desc.replace(/([.:?!,])\s*\n/gm, "$1<p></p>").replace(/\n/gm, " ") + "</td></tr>" + "<tr><th>Razza</th><td>" + info.race.name + "</td><th>Cultura</th><td>" + info.cult + "</td></tr>" + "<tr><th>Etnia</th><td>" + info.ethn + "</td><th>Religione</th><td>" + (info.relig ? info.relig : "nessuna") + "</td></tr>" + "<tr><th>Altezza</th><td>" + info.height + " cm.</td><th>Sesso</th><td>" + info.sex.name + "</td></tr>" + "<tr><th>Peso</th><td>" + info.weight + " pietre</td><th>Citt&agrave;</th><td>" + (info.city ? info.city : "nessuna") + "</td></tr>" + "<tr><th>Et&agrave;</th><td>" + info.age + " anni</td><th>Lingua</th><td>" + info.lang + "</td></tr>" + "<tr><th>Nascita:</th><td colspan=3>" + info.born + "</td></tr>" + "</table><table><caption>Caratteristiche:</caption>" + '<tr><td colspan="3"><h4>Mente</h4></td></tr>' + "<tr><th>Volontà</th><td>" + info.abil.wil.prc + "</td><td>" + prcLowTxt(info.abil.wil.prc, abiltxt) + "</td></tr>" + "<tr><th>Intelligenza</th><td>" + info.abil.int.prc + "</td><td>" + prcLowTxt(info.abil.int.prc, abiltxt) + "</td></tr>" + "<tr><th>Empatia</th><td>" + info.abil.emp.prc + "</td><td>" + prcLowTxt(info.abil.emp.prc, abiltxt) + "</td></tr>" + '<tr><td colspan="3"><h4>Corpo</h4></td></tr>' + "<tr><th>Taglia</th><td>" + info.abil.siz.prc + "</td><td>" + prcLowTxt(info.abil.siz.prc, abiltxt) + "</td></tr>" + "<tr><th>Forza</th><td>" + info.abil.str.prc + "</td><td>" + prcLowTxt(info.abil.str.prc, abiltxt) + "</td></tr>" + "<tr><th>Costituzione</th><td>" + info.abil.con.prc + "</td><td>" + prcLowTxt(info.abil.con.prc, abiltxt) + "</td></tr>" + '<tr><td colspan="3"><h4>Agilità</h4></td></tr>' + "<tr><th>Destrezza</th><td>" + info.abil.dex.prc + "</td><td>" + prcLowTxt(info.abil.dex.prc, abiltxt) + "</td></tr>" + "<tr><th>Velocità</th><td>" + info.abil.spd.prc + "</td><td>" + prcLowTxt(info.abil.spd.prc, abiltxt) + "</td></tr>" + "</table>";
}

function printPlayerStatus(status) {
    var sttxt = "<h4>Condizioni</h4>";
    sttxt += "<p>Salute: " + status.hit + "</p>";
    sttxt += "<p>Movimento: " + status.move + "</p>";
    sttxt += "<p>Fame: " + status.food + "</p>";
    sttxt += "<p>Sete: " + status.drink + "</p>";
    if (status.msg) sttxt += "<p>" + status.msg + "</p>";
    return sttxt;
}

function printTable(t) {
    t.plain = true;
    t.dialog = false;
    return renderTable(t);
}

function logInit() {
    $("#logdialog").dialog({
        autoOpen: false,
        title: addBannerStyle("Registro connessione"),
        width: 800,
        minWidth: 650,
        height: 600,
        minHeight: 300,
        modal: false,
        dialogClass: "tg-dialog styledbuttons parch"
    });
    $("#selectallbutton").button().click(function() {
        SelectText("logtext");
    });
    $("#savebutton").button().click(function() {
        saveLogs();
    });
    $("#cleanallbutton").button().click(function() {
        cleanLogs();
        if (client_options.log.enabled) startLogging();
    });
}

function cleanLogs() {
    $("#logtext").empty();
}

function startLogging() {
    logInfo.start = new Date();
    logAdd("<h1>Inizio log: " + logInfo.start.format("yyyy-mm-dd HH:MM:ss") + "</h1>");
    logInfo.saved = true;
}

function logAdd(text) {
    logInfo.saved = false;
    $("#logtext").append(text);
}

function saveLogs() {
    if (logInfo.start) {
        var lb = new Blob([ $("#logtext").html() ], {
            type: "text/plain;charset=utf-8"
        });
        saveAs(lb, logInfo.start.format("yyyy-mm-dd_HH:MM:ss") + "_thegate.html");
    }
}

function SelectText(element) {
    var doc = document, text = doc.getElementById(element), range, selection;
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

function sorterInit() {
    $.tablesorter.addParser({
        id: "difficulties",
        is: function(s) {
            return false;
        },
        format: function(s) {
            var difficulties = [ "routine", "banale", "molto facile", "facile", "normale", "impegnativa", "difficile", "molto difficile", "arduo", "quasi impossibile", "miracolo" ];
            return difficulties.indexOf(s);
        },
        type: "numeric"
    });
    $.tablesorter.addParser({
        id: "names",
        is: function(s) {
            return false;
        },
        format: function(s) {
            return s.toLowerCase().replace(/^un[oa']? /, "");
        },
        type: "text"
    });
    $.tablesorter.addParser({
        id: "checks",
        is: function() {
            return false;
        },
        format: function(s, t, c, i) {
            return $("div", c).is(".checked") ? 1 : 0;
        },
        type: "numeric"
    });
}

function genericDialogInit() {
    $("#genericdialog-button").button().click(function() {
        closeDialog("#genericdialog");
    });
}

function genericDialog(title, content) {
    var options;
    var title = addBannerStyle(title ? title : "Notizia");
    var d = $("#genericdialog");
    $("#genericdialog-desc").html(content);
    if (isDialog(d)) {
        options = {
            title: title
        };
    } else {
        options = {
            title: title,
            width: 600,
            height: 400,
            minWidth: 400,
            minHeight: 300,
            modal: true,
            dialogClass: "tg-dialog styledbuttons parch",
            closeText: "Annulla"
        };
    }
    d.dialog(options);
}

function selectDialogInit() {
    $("#selectcancel").button().click(function() {
        closeDialog("#selectdialog");
    });
    $("#selectenter").button().click(function() {
        var cmd = $(this).attr("cmd");
        var val = $("#selectlist").val();
        if (cmd && val) sendToServer(cmd + " " + val);
        closeDialog("#selectdialog");
    });
}

function selectDialog(s) {
    if (s.cmd) {
        var d = $("#selectdialog");
        if (s.desc) $("#selectdescription", d).text(s.desc); else $("#selectdescription", d).empty();
        if (s.prefix) $("#selectprefix", d).text(s.prefix); else $("#selectprefix", d).empty();
        var l = $("#selectlist", d);
        l.empty();
        if ($.isArray(s.list)) {
            $.each(s.list, function(i, n) {
                o.append("<option>").attr("value", n.sel).text(n.show);
            });
        } else {
            $.each(s.list, function(k, v) {
                var g = $("<optgroup>").attr("label", k);
                l.append(g);
                $.each(v, function(i, n) {
                    g.append($("<option>").attr("value", n.sel).text(n.show));
                });
            });
        }
        $("#selectenter").attr("cmd", s.cmd);
        $("#selectenter").attr("refresh", s.refresh);
        var options;
        var t = addBannerStyle(s.title ? s.title : "Seleziona");
        if (isDialog(d)) {
            options = {
                title: t
            };
        } else {
            options = {
                title: t,
                width: 500,
                height: 300,
                minHeight: 300,
                minWidth: 400,
                modal: true,
                dialogClass: "tg-dialog styledbuttons parch",
                closeText: "Annulla"
            };
        }
        d.dialog(options);
    }
    return "";
}

function addFilterTag(type, msg) {
    return '<span class="' + type + '">' + msg + "</span>";
}

function handleRefresh(r) {
    if (isDialogOpen("#" + r.dlg)) sendToServer(r.cmd);
    return "";
}

function replaceColors(msg) {
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
    msg = msg.replace(/&-/gm, "</span>");
    return msg;
}

function removeColors(msg) {
    return msg.replace(/&[BRGYLMCWbrgylmcw-]/gm, "");
}

function preparseText(msg) {
    msg = msg.replace(/\r/gm, "");
    msg = msg.replace(/&!!/gm, "");
    msg = msg.replace(/\$\$/gm, "$");
    msg = msg.replace(/%%/gm, "%");
    msg = msg.replace(/&&/gm, "&#38;");
    msg = msg.replace(/</gm, "&#60;");
    msg = msg.replace(/>/gm, "&#62;");
    return msg;
}

function parseForDisplay(msg) {
    var pos;
    msg = msg.replace(/&x\n*/gm, function() {
        inputPassword();
        return "";
    });
    msg = msg.replace(/&e\n*/gm, function() {
        inputText();
        return "";
    });
    msg = msg.replace(/&o.\n*/gm, function(sky) {
        var sky = sky.charAt(2);
        setSky(sky);
        return "";
    });
    msg = msg.replace(/&d\d{6}\n*/gm, function(doors) {
        var doors = doors.substr(2, 6);
        setDoors(doors);
        return "";
    });
    msg = msg.replace(/&!au"[^"]*"\n*/gm, function(audio) {
        var audio = audio.slice(5, audio.lastIndexOf('"'));
        playAudio(audio);
        return "";
    });
    msg = msg.replace(/&!st"[^"]*"\n*/gm, function(status) {
        var st = status.slice(5, status.lastIndexOf('"')).split(",");
        return setStatus(st);
    });
    msg = msg.replace(/&!up"[^"]*"\n*/gm, function(update) {
        var ud = update.slice(5, status.lastIndexOf('"')).split(",");
        if (ud[0] > client_update.inventory.version) client_update.inventory.needed = true;
        if (ud[1] > client_update.equipment.version) client_update.equipment.needed = true;
        if (ud[2] > client_update.room.version) client_update.room.needed = true;
        return "";
    });
    msg = msg.replace(/&!img"[^"]*"\n*/gm, function(image) {
        return "";
    });
    msg = msg.replace(/&!im"[^"]*"\n*/gm, function(image) {
        return "";
    });
    msg = msg.replace(/&!logged"[^"]*"/gm, function() {
        ingame = true;
        return "";
    });
    msg = msg.replace(/&!ea"[^"]*"\n*/gm, function(options) {
        closeEditor();
        return "";
    });
    msg = msg.replace(/&!ed"[^"]*"\n*/gm, function(options) {
        var options = options.slice(5, options.lastIndexOf('"')).split(",");
        var text = options.slice(2).toString().replace(/\n/gm, " ");
        openEditor(options[0], options[1], text);
        return "";
    });
    msg = msg.replace(/&!map\{[\s\S]*?\}!/gm, function(map) {
        var map = $.parseJSON(map.slice(5, -1));
        updateMap(map);
        return "";
    });
    msg = msg.replace(/&!book\{[\s\S]*?\}!/gm, function(b) {
        b = $.parseJSON(b.slice(6, -1));
        openBook(b);
        return "";
    });
    msg = msg.replace(/&!cmdlst\{[\s\S]*?\}!/gm, function(cmd) {
        cmd = $.parseJSON(cmd.slice(8, -1).replace(/"""/, '"\\""'));
        return renderCommandsList(cmd);
    });
    msg = msg.replace(/&!page\{[\s\S]*?\}!/gm, function(p) {
        p = $.parseJSON(p.slice(6, -1));
        return addFrameStyle(addBannerStyle(p.title) + '<div class="text">' + p.text.replace(/\n/gm, "<br>") + "</div>");
    });
    msg = msg.replace(/&!table\{[\s\S]*?\}!/gm, function(t) {
        t = $.parseJSON(t.slice(7, -1));
        return renderTable(t);
    });
    msg = msg.replace(/&!inv\{[\s\S]*?\}!/gm, function(inv) {
        inv = $.parseJSON(inv.slice(5, -1));
        renderInventory(inv);
        return "";
    });
    msg = msg.replace(/&!room\{[\s\S]*?\}!/gm, function(dtls) {
        dtls = $.parseJSON(dtls.slice(6, -1));
        return renderDetails(dtls, dtls.dir ? "dir" : "room");
    });
    msg = msg.replace(/&!pers\{[\s\S]*?\}!/gm, function(dtls) {
        dtls = $.parseJSON(dtls.slice(6, -1));
        return renderDetails(dtls, "pers");
    });
    msg = msg.replace(/&!obj\{[\s\S]*?\}!/gm, function(dtls) {
        dtls = $.parseJSON(dtls.slice(5, -1).replace(/\n/gm, " "));
        return renderDetails(dtls, "obj");
    });
    msg = msg.replace(/&!equip\{[\s\S]*?\}!/gm, function(eq) {
        eq = $.parseJSON(eq.slice(7, -1).replace(/\n/gm, "<br>"));
        renderEquipment(eq);
        return "";
    });
    msg = msg.replace(/&!wklst\{[\s\S]*?\}!/gm, function(wk) {
        wk = $.parseJSON(wk.slice(7, -1));
        return renderWorksList(wk);
    });
    msg = msg.replace(/&!sklst\{[\s\S]*?\}!/gm, function(skinfo) {
        skinfo = $.parseJSON(skinfo.slice(7, -1));
        return renderSkillsList(skinfo);
    });
    msg = msg.replace(/&!pginf\{[\s\S]*?\}!/gm, function(info) {
        info = $.parseJSON(info.slice(7, -1));
        return renderPlayerInfo(info);
    });
    msg = msg.replace(/&!pgst\{[\s\S]*?\}!/gm, function(status) {
        status = $.parseJSON(status.slice(6, -1));
        return renderPlayerStatus(status);
    });
    msg = msg.replace(/&!select\{[\s\S]*?\}!/gm, function(s) {
        s = $.parseJSON(s.slice(8, -1));
        return selectDialog(s);
    });
    msg = msg.replace(/&!refresh\{[\s\S]*?\}!/gm, function(t) {
        t = $.parseJSON(t.slice(9, -1));
        return handleRefresh(t);
    });
    msg = msg.replace(/&!crlf"[^"]*"/gm, function() {
        pauseOn();
        return "";
    });
    pos = msg.lastIndexOf("&*");
    if (pos >= 0) {
        clearOutput();
        msg = msg.slice(pos + 2);
    }
    msg = msg.replace(/&!m"(.*)"\{([\s\S]*?)\}!/gm, function(line, type, msg) {
        return addFilterTag(type, msg);
    });
    msg = msg.replace(/&!ce"[^"]*"/gm, function(image) {
        var image = image.slice(5, -1);
        return renderEmbeddedImage(image);
    });
    msg = msg.replace(/&!ulink"[^"]*"/gm, function(link) {
        var link = link.slice(8, -1).split(",");
        return renderLink(link[0], link[1]);
    });
    msg = msg.replace(/&!as"[^"]*"/gm, "");
    msg = msg.replace(/&!(ad|a)?m"[^"]*"/gm, function(mob) {
        var mob = mob.slice(mob.indexOf('"') + 1, -1).split(",");
        var desc = mob.slice(5).toString();
        return renderMob(mob[0], mob[1], mob[2], mob[3], desc, "interact pers");
    });
    msg = msg.replace(/&!(ad|a)?o"[^"]*"/gm, function(obj) {
        var obj = obj.slice(obj.indexOf('"') + 1, -1).split(",");
        var desc = obj.slice(5).toString();
        return renderObject(obj[0], obj[1], obj[2], obj[3], desc, "interact obj");
    });
    msg = msg.replace(/&!sm"[^"]*"/gm, function(icon) {
        var icon = icon.slice(5, -1).split(",");
        return renderIcon(icon[0], icon[1], "room", null, null, "interact pers");
    });
    msg = msg.replace(/&!si"[^"]*"/gm, function(icon) {
        var icon = icon.slice(5, -1).split(",");
        return renderIcon(icon[0], null, null, null, null, "v " + icon[1]);
    });
    msg = msg.replace(/&i/gm, function() {
        isgod = true;
        return "";
    });
    msg = msg.replace(/&I\d/gm, function(inv) {
        godinvlev = parseInt(inv.substr(2, 3));
        return "";
    });
    msg = msg.replace(/\n/gm, "<br>");
    msg = "<p>" + replaceColors(msg) + "</p>";
    return msg.replace(/<p><\/p>/g, "");
}

function parseForLog(msg) {
    msg = msg.replace(/&[xe]\n*/gm, "");
    msg = msg.replace(/&o.\n*/gm, "");
    msg = msg.replace(/&d\d{6}\n*/gm, "");
    msg = msg.replace(/&!au"[^"]*"\n*/gm, "");
    msg = msg.replace(/&!st"[^"]*"\n*/gm, function(status) {
        var st = status.slice(5, status.lastIndexOf('"')).split(",");
        return printPrompt(st);
    });
    msg = msg.replace(/&!up"[^"]*"\n*/gm, "");
    msg = msg.replace(/&!img"[^"]*"\n*/gm, "");
    msg = msg.replace(/&!im"[^"]*"\n*/gm, "");
    msg = msg.replace(/&!logged"[^"]*"/gm, "");
    msg = msg.replace(/&!e[ad]"[^"]*"\n*/gm, "");
    msg = msg.replace(/&!s[mi]"[^"]*"/gm, "");
    msg = msg.replace(/&!as"[^"]*"/gm, "");
    msg = msg.replace(/&!map\{[\s\S]*?\}!/gm, "");
    msg = msg.replace(/&!book\{[\s\S]*?\}!/gm, "");
    msg = msg.replace(/&!cmdlst\{[\s\S]*?\}!/gm, "");
    msg = msg.replace(/&!page\{[\s\S]*?\}!/gm, function(p) {
        p = $.parseJSON(p.slice(6, -1));
        return printPage(p);
    });
    msg = msg.replace(/&!table\{[\s\S]*?\}!/gm, function(t) {
        t = $.parseJSON(t.slice(7, -1));
        return printTable(t);
    });
    msg = msg.replace(/&!room\{[\s\S]*?\}!/gm, function(dtls) {
        dtls = $.parseJSON(dtls.slice(6, -1));
        return printDetails(dtls, "room");
    });
    msg = msg.replace(/&!pers\{[\s\S]*?\}!/gm, function(dtls) {
        dtls = $.parseJSON(dtls.slice(6, -1));
        return printDetails(dtls, "pers");
    });
    msg = msg.replace(/&!obj\{[\s\S]*?\}!/gm, function(dtls) {
        dtls = $.parseJSON(dtls.slice(5, -1).replace(/\n/gm, " "));
        return printDetails(dtls, "obj");
    });
    msg = msg.replace(/&!inv\{[\s\S]*?\}!/gm, function(inv) {
        inv = $.parseJSON(inv.slice(5, -1));
        return printInventory(inv);
    });
    msg = msg.replace(/&!equip\{[\s\S]*?\}!/gm, function(eq) {
        eq = $.parseJSON(eq.slice(7, -1).replace(/\n/gm, "<br>"));
        return printEquipment(eq);
    });
    msg = msg.replace(/&!wklst\{[\s\S]*?\}!/gm, function(wk) {
        wk = $.parseJSON(wk.slice(7, -1));
        return printWorksList(wk);
    });
    msg = msg.replace(/&!sklst\{[\s\S]*?\}!/gm, function(skinfo) {
        skinfo = $.parseJSON(skinfo.slice(7, -1));
        return printSkillsList(skinfo);
    });
    msg = msg.replace(/&!pginf\{[\s\S]*?\}!/gm, function(info) {
        info = $.parseJSON(info.slice(7, -1));
        return printPlayerInfo(info);
    });
    msg = msg.replace(/&!pgst\{[\s\S]*?\}!/gm, function(status) {
        status = $.parseJSON(status.slice(6, -1));
        return printPlayerStatus(status);
    });
    msg = msg.replace(/&!refresh\{[\s\S]*?\}!/gm, "");
    msg = msg.replace(/&!select\{[\s\S]*?\}!/gm, "");
    msg = msg.replace(/&!crlf"[^"]*"/gm, "");
    msg = msg.replace(/&\*/gm, "");
    msg = msg.replace(/&!m"(.*)"\{([\s\S]*?)\}!/gm, function(line, type, msg) {
        return msg;
    });
    msg = msg.replace(/&!ce"[^"]*"/gm, "");
    msg = msg.replace(/&!ulink"[^"]*"/gm, function(link) {
        var link = link.slice(8, -1).split(",");
        return link[1];
    });
    msg = msg.replace(/&(i|I\d)/gm, "");
    msg = msg.replace(/\n/gm, "<br>");
    msg = "<p>" + removeColors(msg) + "</p>";
    return msg.replace(/<p><\/p>/g, "");
}

var loader_assets = [ "assets/images/loader/background_baa670c49ee75f7fa4ab68d44dfec977.jpg", "assets/images/loader/circle_shadow_2699755bd386f402f4c94c25a1e36ef2.png", "assets/images/loader/circle_d1c5fb37ba069c686ec3f2c48886c18f.png", "assets/images/loader/thegate_logo_6839c46b9a79dd1c905cdebabcfa0c61.png" ];

var app_assets = [ "assets/images/interface/background/deskback_325856332bc3a6749c3a596fda2b29da.png", "assets/images/interface/frame/iron-double-bl_abd049c83d93936ec100a98e85ff2b5d.png", "assets/images/interface/frame/iron-double-bm_df564ea025a6d4a15696a5d810bff35e.png", "assets/images/interface/frame/iron-double-br_e9c270d8af1ba19ff839cfbfc8ab757a.png", "assets/images/interface/frame/iron-double-ml_72430e9382fc0e71756bc65a1de97eba.png", "assets/images/interface/frame/iron-double-mr_b03be7abe033d19b6656802f4c22d64c.png", "assets/images/interface/frame/iron-double-tl_d4a1d8788ebe14f4d5f95c4045b04d5d.png", "assets/images/interface/frame/iron-double-tm_6e6c45996831105fa03dfea0663a5e6c.png", "assets/images/interface/frame/iron-double-tr_59ff2db06645869324191b6de13a0a54.png", "assets/images/interface/frame/iron-single-bl_5540c5b28b1b231d6159af3f5a235d22.png", "assets/images/interface/frame/iron-single-bm_7b38099f938bdeed0c24989a19dff899.png", "assets/images/interface/frame/iron-single-br_71011d8c95303427f18fb2ce969bf8a2.png", "assets/images/interface/frame/iron-single-ml_d97dff880092dfc39540f33072785ff0.png", "assets/images/interface/frame/iron-single-mr_78cb59d51da9d35a643c1104c04978c0.png", "assets/images/interface/frame/iron-single-tl_0276510e4cadcee4e2933d7c129a50ae.png", "assets/images/interface/frame/iron-single-tm_0f77ec4bc2dfde0dfd6df79960831c9a.png", "assets/images/interface/frame/iron-single-tr_ee379c6b49b1933077e2f5cf5a3b02e7.png", "assets/images/interface/tooltips/banner_body_df408b8962f73d63093f242a1192e807.png", "assets/images/interface/tooltips/banner_left_a32c1ab43d6301aa39312fb4bbe80098.png", "assets/images/interface/tooltips/banner_right_f546ecb0e060ece8da048e01ff800b3d.png", "assets/images/interface/status/bars_6fb3c4396d13bf81e6c7ef3ae43d9125.png", "assets/images/interface/status/combat_panel_afad82838d12e3b77f1fe69d04262f91.png", "assets/images/interface/banners/body_cd132d74cb0c31ad198556e406071f10.png", "assets/images/interface/banners/body_small_495664293693dba9b14a3f3ec91e3337.png", "assets/images/interface/books/book_8ce4675f3a34472f44944b0449f7e354.jpg", "assets/images/interface/tooltips/bullet_a9f6c88dfdb62480b732e51edc1629b6.png", "assets/images/interface/buttons/buttonbar_f1dcb9b433ccb5e593645be8000b2cf5.png", "assets/images/interface/buttons/buttons_4b4698e5ba203b7f0e024ea815b6e9b6.png", "assets/images/interface/buttons/back_block_b1c8db73cf022cf9619e4e45515f1609.png", "assets/images/interface/buttons/buttons_sprite_5079d65a2e2896651483ea691d900804.png", "assets/images/interface/banners/end_small_9dd79442008ba149a97c18ce21ba60c6.png", "assets/images/interface/banners/ends_d17662bf1535cb7995bcc1db674bc786.png", "assets/images/interface/equip/panel_large_4c1eb14077dbb8734721559bf66e23fe.png", "assets/images/interface/equip/panel_small_f191217a9377c6a334f400507e2a9492.png", "assets/images/interface/map/map_normal_1518c5ada5f9198c6fadc753d46f1f59.png", "assets/images/interface/sky/weather_l_1afd2f03bf72412560c9e17848373e5b.png", "assets/images/interface/map/map_small_d1fc119db83c473bd26a6f8a49adcf15.png", "assets/images/interface/sky/weather_m_a818c186f09cfa769e33cc4dbdeff1ef.png", "assets/images/interface/map/map_tiny_87d669e47f1ab0a8e114b55e98d861f6.png", "assets/images/interface/sky/weather_s_7bec9fe255ae0d9742cd51794285af9e.png", "assets/images/interface/map/pass_sprite_059a9ce5ba783abeef64c5bf477f8ce9.png", "assets/images/interface/map/look_arrows_eb90c46d53563a7cb6961b0a19cde594.png", "assets/images/interface/books/page_left_c57ab61ddcc67b3a40349d917fb971ba.jpg", "assets/images/interface/books/page_right_0f7e5f77fe79cd599ff842bb5ed0dd17.jpg", "assets/images/interface/frame/paper1-bl_ae0de81e7dd5b13ea22731d61ca56df8.png", "assets/images/interface/frame/paper1-bm_2457bba99864bf4cb2e27d152f444f27.png", "assets/images/interface/frame/paper1-br_6779f4f96c642dbe22e91a5dee5815af.png", "assets/images/interface/frame/paper1-ml_2299f9e059f2dfad15b3373d93a73304.png", "assets/images/interface/frame/paper-mm_a356ab2e68f2fdbcc0941e2554436780.png", "assets/images/interface/frame/paper1-mr_07fe9b693c11f54825bb69ad11850858.png", "assets/images/interface/frame/paper1-tl_12c64871c3dd039d462c876bd2397345.png", "assets/images/interface/frame/paper1-tm_035c0a086cd4058bda9411e170fe741f.png", "assets/images/interface/frame/paper1-tr_7c699da3d60660376fdcaa1751a55302.png", "assets/images/interface/frame/paper2-bl_6f6e3cdb42c15577ffa772b8489658c0.png", "assets/images/interface/frame/paper2-bm_31aab6b01c65520778f6d59eadbdfcef.png", "assets/images/interface/frame/paper2-br_cd0845f501d6eb77a191915e9426666a.png", "assets/images/interface/frame/paper2-ml_2f337aa275ed59e82275b2fe610f4a3d.png", "assets/images/interface/frame/paper2-mm_158faf574c2cddbce76b815ddbdd880f.png", "assets/images/interface/frame/paper2-mr_93f663e58d3ad1444934dd54cc5b62a3.png", "assets/images/interface/frame/paper2-tl_e297974d6babc4b303a35a7eede65cd1.png", "assets/images/interface/frame/paper2-tm_cc4b288d820dd9669358a5b98087ec20.png", "assets/images/interface/frame/paper2-tr_0c1fce6e6e952c7c437488fee066c72d.png", "assets/images/interface/buttons/pause-icon_baacf1ea1257f5a53fb8ff7c7dbc29d6.png", "assets/images/interface/buttons/play-icon_6e11f4b4725b520c2194102664df4f0a.png", "assets/images/interface/tooltips/tooltiprivet_6b2aced42a2cf152432b5f0e007ad711.png", "assets/images/interface/equip/dwarf_f_d35ed2afc5677985313266145c2ef80e.png", "assets/images/interface/equip/dwarf_m_b878051322baa20c412baef043a201bc.png", "assets/images/interface/equip/elf_f_006a85f0423b69cdae43133efb6c710a.png", "assets/images/interface/equip/elf_m_7fa81f09e787f5a66cc70deaa43730a5.png", "assets/images/interface/equip/goblin_f_389182dfbdb5965507e9975597d5d5bc.png", "assets/images/interface/equip/goblin_m_d5655062298d890a97430c983aa7aa3f.png", "assets/images/interface/equip/halfling_f_f77fbc484bfa72a56e2b088271b6e55c.png", "assets/images/interface/equip/halfling_m_38ec58e398a12b6483dab716e5e63c94.png", "assets/images/interface/equip/human_f_ec263981d695c63aba202d32df1e270e.png", "assets/images/interface/equip/human_m_e7bfc399a5876ee1cdb184b049e5447b.png", "assets/images/interface/equip/orc_f_8aa62ab6b03b31fdab346c4ce1494e9b.png", "assets/images/interface/equip/orc_m_c6526e0b5b085ba882c4eb269a593a87.png", "assets/images/interface/status/obj_mob_health_e47fafc8798dd5056178157277446d79.png", "assets/images/icons/tiles_715c3ba47a0c056690152033fa49177c.png", "assets/images/icons/tiles_m_ff622dd2a9817fd8cffa5b70e493c861.png", "assets/images/icons/tiles_s_559cf6c862be319a2e0e1c063ee860cf.png", "assets/images/login/loading_d08194ff2bc48356edc6c562aafe5f3a.gif", "assets/images/login/scroll_header_81d0a46e4f137bd645536fb86c0db101.png", "assets/images/login/scroll_body_313cf09f8ac64f91315b583dea880b44.png", "assets/images/login/scroll_footer_30043079def9439c0873477fdfe7bae1.png", "assets/images/login/black_banners_86150f31f5e63f75436c0079a30d3365.png", "assets/images/login/loading_d08194ff2bc48356edc6c562aafe5f3a.gif", "assets/images/login/portrait_frame_668bd9111fdf6a9e4bcd1b14e811b539.png", "assets/images/login/portrait_no_image_1b3678154e6f8eadb262d439fa1f971a.png", "assets/images/interface/interact/elems_180a16a1ffeac0cda6ac160c3637f051.png", "assets/images/interface/buttons/arrows_99a03e51c896376da0caa5f72c59b2ca.png", "assets/images/interface/interact/cmds_763e105ac28838708bfbf61b1fa784a2.png", "assets/images/interface/buttons/filters_5486abafd36d11bd04853525f73c4731.png" ];

var creation_assets = [ "assets/images/interface/buttons/smallbutton_left_right_ade529c74777da586052e6f916cce35b.png", "assets/images/interface/creation/select-race_9373d98241539a88ceffc25177f7f589.png", "assets/images/interface/creation/dwarf_f_title_f5150cea7dc30960c1cf3a9f7ebd7fde.png", "assets/images/interface/creation/dwarf_m_title_1e2f087bdb2ef7b8b58c5d08b2c18a89.png", "assets/images/interface/creation/elf_f_title_07792e6c60866efdf4d345d2ebbe9e7e.png", "assets/images/interface/creation/elf_m_title_db88e20bb43781e3d270ebd9442412c8.png", "assets/images/interface/creation/goblin_f_title_c16c9a515580c5d0cddde5e78847daca.png", "assets/images/interface/creation/goblin_m_title_e997f26dbc09fd2890b7cdd5b7e08b73.png", "assets/images/interface/creation/halfling_f_title_ba82904c91c16e98c09819857e562653.png", "assets/images/interface/creation/halfling_m_title_e5d9fb1f67bb94a540477fb48bbc40c6.png", "assets/images/interface/creation/human_f_title_5c8d2b3b7891649ef7fc5e92c3e745d6.png", "assets/images/interface/creation/human_m_title_66920b5ac56db7d21ad423dd9d2cfcfc.png", "assets/images/interface/creation/orc_f_title_0ca73c5ccd59aacc606a96764f0149ad.png", "assets/images/interface/creation/orc_m_title_a9bab70f9f34842d0ed55d100a298ee9.png", "assets/images/interface/creation/select-race_9373d98241539a88ceffc25177f7f589.png", "assets/images/interface/equip/dwarf_f_small_78e6a9561fcae4b15e25a1fcb12df7d6.png", "assets/images/interface/equip/dwarf_m_small_b8ab7c38b2255249251ed8728a2b5de7.png", "assets/images/interface/equip/elf_f_small_1cb15ada69c264ddf6f1d7e7f7b3358e.png", "assets/images/interface/equip/elf_m_small_cee22112d9ba8bfde967745954927148.png", "assets/images/interface/equip/goblin_f_small_5bde0928e9977c5616b7a4d597220138.png", "assets/images/interface/equip/goblin_m_small_b5069bfe0c01cabb83a27cd8af481178.png", "assets/images/interface/equip/halfling_f_small_06ceb2b66c63972501f499b8a0ebe756.png", "assets/images/interface/equip/halfling_m_small_1eaf27c286a32526205c393f65e7aae2.png", "assets/images/interface/equip/human_f_small_a258db0758ea176e775aeaebaf4ee480.png", "assets/images/interface/equip/human_m_small_14fcb1818d9485ae901d19b2319df5f5.png", "assets/images/interface/equip/orc_f_small_8f402636972c9699e4193068179098f5.png", "assets/images/interface/equip/orc_m_small_25449a0b2c0587d6b6b43ccda2516dda.png", "assets/images/interface/creation/fighter_15703293a833a06a8c22e8418f34e72b.png", "assets/images/interface/creation/bard_04b1c3c30ce0d34952caf665737ae23f.png", "assets/images/interface/creation/fighter_15703293a833a06a8c22e8418f34e72b.png", "assets/images/interface/creation/worker_9171d5874691d34c81a9547a33812142.png", "assets/images/interface/creation/attributes_9c2e2a1626a771a453365ac6166dabc9.png", "assets/images/interface/creation/map_26d968fd8bac13a5d4dc38d1d3a9a909.png", "assets/images/interface/creation/yes_03c37cfcd53c585da9607622b1547617.png", "assets/images/interface/creation/no_7d527e96189e8858e0f09357450c875c.png" ];

var login_heroes_assets = [ "assets/images/login/hero0_e00eb74b57ecf3252183cc7b98207925.png", "assets/images/login/hero1_7c500e69df02ea7d5f7b839f51bec4d6.png", "assets/images/login/hero2_03f2949b62b6d52ef1830c5292c539f5.png", "assets/images/login/hero3_d484cd215c3409baa165770f85cb5bce.png", "assets/images/login/hero4_c89ea910366a59e0ee22e83e3055f666.png", "assets/images/login/hero5_0ee0aa08e1b94b1e7b66bb045d21fd50.png" ];

$(document).ready(function() {
    if ($.ui.version.split(".")[1] == "12") {
        $.extend($.ui.dialog.prototype, {
            _title: function(title) {
                if (!this.options.title) {
                    title.html("&#160;");
                }
                title.html(this.options.title);
            },
            _createTitlebar: function() {
                var uiDialogTitle;
                this.uiDialogTitlebar = $("<div>").addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(this.uiDialog);
                this._on(this.uiDialogTitlebar, {
                    mousedown: function(event) {
                        if (!$(event.target).closest(".ui-dialog-titlebar-close")) {
                            this.uiDialog.focus();
                        }
                    }
                });
                this.uiDialogTitlebarClose = $("<div></div>").button({
                    label: this.options.closeText,
                    icons: {
                        primary: "ui-icon-closethick"
                    },
                    text: false
                }).addClass("ui-dialog-titlebar-close").appendTo(this.uiDialogTitlebar);
                this._on(this.uiDialogTitlebarClose, {
                    click: function(event) {
                        event.preventDefault();
                        this.close(event);
                    }
                });
                uiDialogTitle = $("<span>").uniqueId().addClass("ui-dialog-title").prependTo(this.uiDialogTitlebar);
                this._title(uiDialogTitle);
                this.uiDialog.attr({
                    "aria-labelledby": uiDialogTitle.attr("id")
                });
            }
        });
    }
    $.cookie.json = true;
    $.cookie.defaults.expires = 365 * 10;
    var cookie_consent = Load("cookie_consent");
    if (!cookie_consent) {
        $("#cookieconsentbutton").button().click(function() {
            Save("cookie_consent", true);
            $("#cookieconsentdialog").dialog("destroy");
            startClient();
        });
        $("#cookieconsentdialog").dialog({
            title: addBannerStyle("Informativa"),
            modal: true,
            resizable: true,
            width: 500,
            height: 500,
            dialogClass: "tg-dialog styledbuttons parch noclose"
        });
        $("#cookieconsentdialog").parent(".tg-dialog").css("zIndex", 1e4);
    } else {
        startClient();
    }
});

function startClient() {
    var saved_state = $.cookie(cookiepre + "state");
    if (Modernizr.localstorage && saved_state) {
        Save("state", saved_state);
        $.cookie(cookiepre + "state", null);
    } else {
        saved_state = Load("state");
    }
    if (saved_state) client_state = $.extend(client_state, saved_state);
    if (!client_state.when) {
        client_state.when = new Date().getTime();
        Save("state", client_state);
    }
    var saved_options = $.cookie(cookiepre + "options");
    if (Modernizr.localstorage && saved_options) {
        Save("options", saved_options);
        $.cookie(cookiepre + "options", null);
    } else {
        saved_options = Load("options");
    }
    if (saved_options) client_options = $.extend(client_options, saved_options);
    if (window.location.pathname.indexOf("/fb/") == -1) {
        facebookMode = "app";
        facebookAuth = facebookAppAuth;
    } else {
        facebookMode = "canvas";
        facebookAuth = facebookCanvasAuth;
        $("#logout").hide();
        $("#account-local-option").hide();
        $("#local-account-form").hide();
    }
    audioInit();
    playAudio("thegate1.mp3");
    $.getScript("//connect.facebook.net/it_IT/sdk.js", function() {
        if (facebookMode == "canvas") {
            $.imgpreload(loader_assets, {
                all: function() {
                    $(".loader.window").show();
                    setTimeout(load_app, 1e3);
                }
            });
        }
        FB.init({
            appId: facebookAuth.clientId,
            status: true,
            cookie: false,
            logging: false,
            version: "v2.0",
            xfbml: true
        });
        FB.Event.subscribe("auth.authResponseChange", function(response) {
            if (response.status === "connected") {
                var newToken = response.authResponse.accessToken;
                if (initialized) {
                    if (facebookToken) {
                        facebookAccountUpdate(newToken);
                    } else {
                        doFacebookLogin(response.authResponse.accessToken);
                    }
                }
                facebookToken = newToken;
            } else if (response.status === "not_authorized") {
                facebookToken = null;
            } else {
                facebookToken = null;
            }
        });
    });
    if (facebookMode == "app") {
        $.imgpreload(loader_assets, {
            all: function() {
                $(".loader.window").show();
                setTimeout(load_app, 1e3);
            }
        });
    }
}

function close_loader() {
    $("#loader").remove();
}

function load_app() {
    var loaded = 0, errors = 0;
    var assets = [];
    assets = assets.concat(app_assets, login_heroes_assets, creation_assets);
    $.imgpreload(assets, {
        each: function() {
            if ($(this).data("loaded")) $("#loaderprc").text(Math.ceil(++loaded * 100 / assets.length)); else errors++;
        },
        all: function() {
            if (errors > 0) {
                $("#loadermsg").text("Errore di caricamento. Per favore contatta lo staff di The Gate");
            } else {
                initApp();
            }
        }
    });
}

function initApp() {
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
    if (client_options.noDetails) {
        closeDialog("#detailsdialog");
        openDialog("#imagedialog");
    } else {
        openDialog("#detailsdialog");
        closeDialog("#imagedialog");
        detailsResize.call($("#detailsdialog"));
    }
    main();
}

function leavePageAlertMessage() {
    return 'Se lasci questa pagina, perderai la connessione con The Gate. Per disconnettere correttamente il tuo personaggio, annulla la chiusura e digita il comando "fine"';
}

function setConnected() {
    connected = true;
    $(window).bind("beforeunload", leavePageAlertMessage);
    $("#connectbutton").addClass("connected").attr("tooltip", "Disconnessione");
}

function clearUpdate() {
    client_update.inventory.version = -1;
    client_update.inventory.needed = false;
    client_update.equipment.version = -1;
    client_update.equipment.needed = false;
    client_update.room.version = -1;
    client_update.room.needed = false;
}

function setHandshaked() {
    networkActivityOff();
    closeMainDialog();
    if (connectionInfo.mode == "create") {
        connectionInfo.mode = "login";
        connectionInfo.loginName = connectionInfo.data.name;
        connectionInfo.loginPass = connectionInfo.data.password;
        client_options.login = {
            name: connectionInfo.loginName,
            password: connectionInfo.loginPass
        };
        updateChars = true;
        resetCreationData();
    }
    focusInput();
    clearOutput();
    inputText();
    pauseOff();
    clearUpdate();
    if (client_options.log.clean) cleanLogs();
    if (client_options.log.enabled) startLogging();
}

function setDisconnected() {
    connected = false;
    ingame = false;
    $(window).unbind("beforeunload", leavePageAlertMessage);
    $("#connectbutton").removeClass("connected").attr("tooltip", "Connessione");
    if (client_options.log.save) saveLogs();
    closeAllDialogs();
    networkActivityOff();
    openMainDialog();
}

function ga_heartbeat() {}

function main_complete(success) {
    initialized = true;
    openMainDialog();
    close_loader();
}

function main() {
    directLogin = $(location).attr("href").search("tg") >= 0;
    var dbg = $(location).attr("href").match(/debug=[^&]+/);
    if (dbg) {
        $.each(dbg, function(idx, val) {
            var setting = val.split("=")[1];
            debug = setting == "true";
        });
    }
    var dlg = $(location).attr("href").match(/direct=[^&]+/);
    if (dlg) {
        $.each(dlg, function(idx, val) {
            var setting = val.split("=")[1];
            directLogin = setting == "true";
        });
    }
    var token = $(location).attr("href").match(/token=[^&]+/);
    if (token) {
        $.each(token, function(idx, val) {
            verify_token = decodeURIComponent(val.split("=")[1]);
        });
    }
    if (verify_token != null) window.history.replaceState(null, "", window.location.pathname);
    function completeFacebookLogin() {
        function next() {
            networkActivityMessage("");
            doFacebookLogin(facebookToken, main_complete);
        }
        accountLogout(next, next);
    }
    moveLoginPanel("account");
    if (verify_token != null) {
        localAccountCheck(verify_token, function(data) {
            networkActivityMessage("");
            verify_email = data.email;
            $("#vfyemail").val(verify_email);
            moveLoginPanel("verify");
            main_complete();
        }, function(error) {
            if (error.status == 400) networkActivityMessage("Errore nei dati della richiesta."); else if (error.status == 404) moveLoginPanel("used"); else networkActivityMessage("Errore di comunicazione con il server.");
            main_complete();
        });
    } else if (facebookToken != null) {
        completeFacebookLogin();
    } else if (facebookMode == "canvas") {
        FB.getLoginStatus(function(response) {
            if (response.status === "connected") {
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
                }, {
                    scope: "public_profile,email"
                });
            }
        });
    } else if (!directLogin) {
        doLocalAccountAutoLogin(main_complete);
    } else {
        $("#associateback").hide();
        main_complete();
    }
}

function connectToServer() {
    if (connectionInfo == null) return;
    connectionError = "";
    if (socket) {
        socket.destroy();
    }
    socket = io.connect(ws_server_addr, {
        reconnect: false,
        "force new connection": true,
        resource: socket_io_resource,
        transports: [ "polling" ]
    });
    socket.on("data", handleLoginData);
    socket.on("connect", function() {
        networkActivityMessage("Connessione avvenuta!");
        setConnected();
    });
    socket.on("connecting", function(t) {});
    socket.on("error", function() {
        setDisconnected();
        loginError("Errore di connessione al server. Verifica il funzionamento della tua rete o riprova più tardi.");
    });
    socket.on("disconnect", function() {
        setDisconnected();
        if (!connectionInfo.error) networkActivityMessage("Connessione conclusa!");
    });
}

function performLogin() {
    if (connectionInfo.mode == "login") {
        sendToServer("login:" + connectionInfo.loginName + "," + connectionInfo.loginPass + "\n");
    } else if (connectionInfo.mode == "create") {
        sendToServer("create:" + connectionInfo.data.name.toString() + "," + connectionInfo.data.password.toString() + "," + (connectionInfo.data.email ? connectionInfo.data.email.toString() : "") + "," + (connectionInfo.data.invitation ? connectionInfo.data.invitation.toString() : "") + "," + connectionInfo.data.race_code.toString() + "," + connectionInfo.data.sex.toString() + "," + connectionInfo.data.culture.toString() + "," + connectionInfo.data.start.toString() + "," + connectionInfo.data.stats.strength.toString() + "," + connectionInfo.data.stats.constitution.toString() + "," + connectionInfo.data.stats.size.toString() + "," + connectionInfo.data.stats.dexterity.toString() + "," + connectionInfo.data.stats.speed.toString() + "," + connectionInfo.data.stats.empathy.toString() + "," + connectionInfo.data.stats.intelligence.toString() + "," + connectionInfo.data.stats.willpower.toString() + "\n");
    }
}

function openMainDialog() {
    openDialog("#" + connectionInfo.mode + "dialog");
}

function closeMainDialog() {
    closeDialog("#" + connectionInfo.mode + "dialog");
}

function networkActivityOn() {
    $(".networkroll").css("visibility", "visible");
}

function networkActivityOff() {
    $(".networkroll").css("visibility", "hidden");
}

var login_reply_message = {
    serverdown: "Il server di gioco è momentaneamente spento. Riprova più tardi.",
    errorproto: "Errore di comunicazione con il server.",
    errornonew: "In questo momento non è permessa la creazione di nuovi personaggi.",
    invalidname: "Nome non valido.",
    invalidpass: "Password non valida.",
    loginerror: "Personaggio inesistente o password errata.",
    staffonly: "In questo momento solo lo staff può collegarsi, riprova più tardi.",
    plrreaderror: "Errore di lettura del personaggio.",
    plrdisabled: "Il personaggio è stato disattivato.",
    bannedip: "Connessione da un indirizzo bloccato.",
    maxclients: "Il server ha raggiunto il massimo numero di connessioni, riprova più tardi.",
    errorcoderequired: "Per creare un altro personaggio ti serve un codice di attivazione.",
    errorinvalidcode: "Il codice di invito inserito non è valido. Verifica di averlo digitato correttamente.",
    dupname: "Esiste già un personaggio con questo nome. Per favore scegli un nome diverso.",
    invalidemail: "L'indirizzo di email inserito non è valido."
};

function handleLoginData(data) {
    if (data.indexOf("&!connmsg{") == 0) {
        var end = data.indexOf("}!");
        var rep = $.parseJSON(data.slice(9, end + 1));
        if (rep.msg) {
            switch (rep.msg) {
              case "ready":
                sendOOB({
                    itime: client_state.when.toString(16)
                });
                break;

              case "enterlogin":
                performLogin();
                break;

              case "shutdown":
                networkActivityMessage("Attenzione, il server sarà spento entro breve per manutenzione.");
                performLogin();
                break;

              case "reboot":
                networkActivityMessage("Attenzione, il server sarà riavviato entro breve.");
                performLogin();
                break;

              case "created":
              case "loginok":
                completeHandshake();
                handleServerData(data.slice(end + 2));
                if (!directLogin) {
                    if (updateChars) {
                        doUpdateCharacters();
                    }
                    moveLoginPanel("login");
                }
                break;

              default:
                var connectionError = login_reply_message[rep.msg];
                if (!connectionError) connectionError = login_reply_message["errorproto"];
                loginError(connectionError);
                break;
            }
        }
    }
}

function completeHandshake() {
    socket.removeListener("data", handleLoginData);
    socket.on("data", handleServerData);
    setHandshaked();
}

function handleServerData(msg) {
    netdata += msg;
    var len = netdata.length;
    if (netdata.indexOf("&!!", len - 3) !== -1) {
        var data = preparseText(netdata.substr(0, len - 3));
        if (debug) {
            showOutput(parseForDisplay(data));
        } else try {
            showOutput(parseForDisplay(data));
        } catch (err) {
            console.log(err.message);
        }
        if (client_options.log.enabled) {
            if (debug) {
                logAdd(parseForLog(data));
            } else try {
                logAdd(parseForLog(data));
            } catch (err) {
                console.log(err.message);
            }
        }
        netdata = "";
        var now = Date.now();
        if (now > client_update.last + 1e3) {
            if (client_update.inventory.needed && isDialogOpen("#invdialog")) {
                sendToServer("@inv");
                client_update.inventory.needed = false;
                client_update.last = now;
            }
            if (client_update.equipment.needed && isDialogOpen("#equipdialog")) {
                sendToServer("@equip");
                client_update.equipment.needed = false;
                client_update.last = now;
            }
            if (client_update.room.needed && whichTabIsOpen("#detailsdialog") == 0) {
                sendToServer("@agg");
                client_update.room.needed = false;
                client_update.last = now;
            }
        }
    } else if (len > 2e5) {
        showOutput("<br>Errore di comunicazione con il server!<br>");
        netdata = "";
        setDisconnected();
    }
}

function disconnectFromServer() {
    if (connected) {
        if (ingame) sendToServer(historyPush("fine")); else socket.disconnect();
    }
}
