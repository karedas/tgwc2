// ========== NPM Modules
import io from 'socket.io-client';
import Modernizr from "modernizr";
import Cookies from 'js-cookie';
import PerfectScrollbar from 'perfect-scrollbar';
import 'bootstrap';
import 'magnific-popup';

/* Jquery UI */
import position from 'jquery-ui/ui/position';
import draggable from 'jquery-ui/ui/widgets/draggable';
import droppable from 'jquery-ui/ui/widgets/droppable';
import dialog from 'jquery-ui/ui/widgets/dialog';
//============ Assets file list.
import AssetsList from 'assets_list.json';
//============ Custom
//import FacebookSDK from 'facebookSdk';
import Preloader from 'preloader';
import Map from 'mapDrawer';
import uploadAvatar from 'uploadAvatar';

export default class TgGui {

    constructor(options) {

        this.ws_server_addr = 'http://51.38.185.84:3335';
        this.socket_io_resource = 'socket.io';
        this.media_server_addr = 'http://play.thegatemud.it/images/';
        this.ws_prefix = '/';
        this.images_path = './images/';
        this.sounds_path = './sounds/';

        this.socketListener = {}

        /* Cookies Settings */
        this.cookies = {
            prefix: 'tgwc_',
            expires: 365 * 10
        };

        /* Connection */
        this.isConnected = false;
        this.socket = null;
        this.netdata = '';

        /* Login */
        this.inGame = false;
        this.isGod = false;
        this.godInvLev = 0;

        this.connectionInfo = {
            loginName: null,
            loginPass: null,
            error: null
        };

        this.client_state = {
            news_showed: false,
            max_drop_stack: null,
            window: {}
        };

        this.client_open = false;
        this.ajax_loaded = [];

        this.dialog = null;
        this.viewport = null;

        /* UI Game Options */
        this.client_options = {
            news_date_last: null,
            news_wantsee: true,
            musicVolume: 70,
            soundVolume: 100,
            skysize: 215,
            alpha_approved: false,
            shortcuts: [],
            login: {},
            dashboard: "0",
            extradetail_open: true,
            mrn_highlights: [],
            output_width: '50%',
            output_trimlines: 500,
        };

        /* Status */
        this.in_editor = false;
        this.cursor_on_map = false;
        this.dragging = null;
        this.at_drag_stop_func = null;

        /* History */
        this.max_history_length = 40;
        this.cmd_history_pos = 0;
        this.cmd_history = [];

        /* Exits */
        this.dir_north = 0;
        this.dir_east = 1;
        this.dir_south = 2;
        this.dir_west = 3;
        this.dir_up = 4;
        this.dir_down = 5;

        this.dir_names = ['nord', 'est', 'sud', 'ovest', 'alto', 'basso'];
        this.dir_status = '000000';

        /* Shortcuts */
        this.shortcuts_map = {};

        /* Combat Panel */
        this.in_combat = false;
        this.enemy_icon = 0;

        /* Input */
        this.cmd_prefix = '';

        /* Output */
        this.last_room_desc = '';

        /* Details */
        this.exp_grp_list = {}
        this.max_exp_grp = 15;

        /* Health bars */
        this.hlttxtcol = [{
                let: 25,
                txt: 'orangered'
            },
            {
                let: 50,
                txt: 'yellow'
            },
            {
                let: 100,
                txt: 'greenyellow'
            },
        ];

        this.client_update = {
            data: {
                info: false,
                stato: false,
                player_name: null,
                player_image: null,
            },
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

        this.scrollbar = {
            output: null
        };

        /* References to the instantiated classes */
        this.MAP_OBJECT = null;
        this.AVUPLOAD = null;

        this.race_to_class = {
            "uma": "human",
            "ume": "human",
            "eal": "elf",
            "esi": "elf",
            "dra": "elf",
            "drw": "elf",
            "meu": "human",
            "mel": "human",
            "hal": "halfling",
            "nan": "dwarf",
            "orc": "orc",
            "gob": "goblin",
            "els": "elf"
        };


        this.equip_positions_by_name = {
            "r_finger": "Al dito destro",
            "l_finger": "Al dito sinistro",
            "neck": "Al collo",
            "body": "Sul corpo",
            "head": "In testa",
            "legs": "Sulle gambe",
            "feet": "Ai piedi",
            "hands": "Sulle mani",
            "arms": "Sulle braccia",
            "around": "Attorno al corpo",
            "waist": "In vita",
            "r_wrist": "Al polso destro",
            "l_wrist": "Al polso sinistro",
            "r_hand": "Nella mano destra",
            "l_hand": "Nella mano sinistra",
            "back": "Sulla schiena",
            "r_ear": "All'orecchio destro",
            "l_ear": "All'orecchio sinistro",
            "eyes": "Sugli occhi",
            "sheath": "Nel fodero",
            "belt": "Alla cintura",
            "over": "A tracolla",
            "r_shoulder": "Sulla spalla destra",
            "l_shoulder": "Sulla spalla sinistra",
            "tied": "Imprigionato"
        };

        this.dirBgPos = {
            "nord": "0px -64px",
            "nordest": "0 -288px",
            "est": "0px -160px",
            "sudest": "0 -256px",
            "sud": "0px -128px",
            "sudovest": "0 -224px",
            "ovest": "0px -96px",
            "nordovest": "0 -192px",
            "alto": "0",
            "basso": "0"
        }

        this.pos_to_order = [{
                pos: 0,
                name: ""
            },
            18, // Finger R
            19, // Finger L
            5, // Neck
            8, // Body
            1, // Head
            23, // Legs
            24, // Feet
            15, // Hands
            12, // Arms
            9, // About
            22, // Waist
            13, // Wrist R
            14, // Wrist L
            160, // Hand R
            170, // Hand L
            10, // Back
            2, // Ear R
            3, // Ear L
            4, // Eyes
            20, // Sheath
            21, // Belt
            11, // Back
            6, // Shoulder R
            7, // Shoulder L
            25 // Tied
        ];


        this.equip_positions_by_num = [''].concat($.map(this.equip_positions_by_name, function (v) {
            return v;
        }));


        this.obj_interaction_config = {
            // rimuovi, rimuovi+posa, riponi, impugna
            'equip': ['.watch', '.eqp-out', '.inv-out', '.wpn-out', '.wpn-in', '.input-concat'],
            'inv': ['.watch', '.inv-out', '.eqp-in', '.wpn-in', '.input-concat'],
            'room': ['.watch', '.inv-in', '.eqp-in', '.wpn-in', '.input-concat'],
            'obj': ['.watch', '.inv-in', '.inv-out', '.eqp-in', '.wpn-in', '.input-concat'],
            'pers': ['.watch', '.inv-out', '.meq-out', '.meq-in', '.input-concat']
        };

        this.abiltxt = [{
                val: 6,
                txt: "Terribile"
            },
            {
                val: 14,
                txt: "Pessima"
            },
            {
                val: 24,
                txt: "Scarsa"
            },
            {
                val: 34,
                txt: "Discreta"
            },
            {
                val: 64,
                txt: "Normale"
            },
            {
                val: 74,
                txt: "Buona"
            },
            {
                val: 84,
                txt: "Ottima"
            },
            {
                val: 94,
                txt: "Eccellente"
            },
            {
                val: 100,
                txt: "Leggendaria"
            }
        ];

        /* Debug */
        this.debug = true;

        $.extend(this, options);
    }

    startClient() {
        let _ = this;
        /* let facebookSDK = new FacebookSDK();
         facebookSDK.load();
         */
        // Init the Session
        _.initSessionData();
        // Start Server Connection
        _.connectToServer().then(function (resolve, reject) {
            if (_.isConnected) {
                _.initLoginPanel();
            }
            if (_.debug) {
                console.log('Server Online: %c' + _.isConnected, 'font-weight:bold;');
            }
        });
    }

    /* *****************************************************************************
    * COOKIES
    */

    showCookieLawDisclaimer() {
        let _ = this;
        let def = $.Deferred();
        $(document).on('change', '#cookieCheckbox', function () {
            $('#cookieconsentbutton')
                .toggleClass('invisible')
                .one('click', function () {
                    _.SaveStorage('cookie_consent', true);
                    _.closePopup();
                    //Done deferred back
                    def.resolve();
                });
        });
        _.openCookieLawPopup();
        return def;
    }

    removeCookieLawDisclaimer() {
        $('.tg-cookielawcontent').remove();
    }

    initSessionData() {
        let _ = this;
        // Load State
        let saved_state = Cookies.getJSON(_.cookies.prefix + 'state');

        if (Modernizr.localstorage && saved_state) {
            _.SaveStorage('state', saved_state);
            Cookies.set(_.cookies.prefix + 'state', null);
        } else {
            saved_state = _.LoadStorage('state');
        }
        if (saved_state) {
            $.extend(_.client_state, saved_state);
        }
        if (!_.client_state.when) {
            _.client_state.when = new Date().getTime();
            _.SaveStorage('state', _.client_state);
        }

        // Load Options
        let saved_options = Cookies.getJSON(_.cookies.prefix + 'options');
        if (Modernizr.localstorage && saved_options) {
            _.SaveStorage('options', saved_options);
            Cookies.set(_.cookies.prefix + 'options', null);
        } else {
            saved_options = _.LoadStorage('options');
        }

        if (saved_options) {
            $.extend(_.client_options, saved_options);
        }
    }

    LoadStorage(what) {

        what = this.cookies.prefix + what;

        if (Modernizr.localstorage) {
            let data = localStorage[what];
            return data ? JSON.parse(data) : null;
        } else {
            return Cookies.get(what);
        }
    }

    SaveStorage(what, value) {
        let _ = this;
        what = _.cookies.prefix + what;
        if (Modernizr.localstorage) {
            localStorage[what] = JSON.stringify(value);
        } else {
            Cookies.set(what, value, {
                'expires': _.cookies.expires,
                'path': _.cookies.path
            });
        }
    }


    /* *****************************************************************************
    * WINDOWS
    */

    setWindowPosition(id, left, top) {
        if(this.client_state.window[id] == null) {
            this.client_state.window[id] = {};
        }
        this.client_state.window[id].position = [-left, +top];
    }

    getWindowPosition(id) {
        if(this.client_state.window[id] == null) {
            return null;
        }
        return this.client_state.window[id].position;
    }

    setWindowSize(id, width, height) {
        if(this.client_state.window[id] == null) {
            this.client_state.window[id] = {};
        }
        this.client_state.window[id].size = [width, height];
    }

    getWindowSize(id) {
        if(this.client_state.window[id] == null)
            return null;

        return this.client_state.window[id].size;
    }

    saveWindowData(event, obj) {
        let _ = this,  
            id;
        switch(event.type) {
            case 'dialogdragstop':
                id = event.target.id;
                _.setWindowPosition(id, obj.position.left, obj.position.top);
                break;

            case 'dragstop':
                id = $(event.target).children('.ui-dialog-content').attr('id');
                _.setWindowPosition(id, obj.position.left, obj.position.top);
                break;

            case 'dialogresizestop':
                id = event.target.id;
                _.setWindowPosition(id, obj.position.left, obj.position.top);
                _.setWindowSize(id, obj.size.width, obj.size.height);
                break;

            case 'resizestop':
                id = $(event.target).children('.ui-dialog-content').attr('id');
                _.setWindowPosition(id, obj.position.left, obj.position.top);
                _.setWindowSize(id, obj.size.width, obj.size.height);
                break;
            }

            _.SaveStorage('state', _.client_state);
    }


    /* *****************************************************************************
     * LOGIN & SERVER CONNECTION 
     */
     
    connectToServer() {
        let _ = this;

        return new Promise(function (resolve, reject) {
            if (_.socket) {
                _.socket.destroy();
                delete _.socket;
                _.socket = null;
            }

            // Initialize Connection to the WebSocket
            _.socket = io.connect(_.ws_server_addr, {
                'reconnection': false,
                'autoConnect:': true,
                'forceNew': true,
                'resource': _.socket_io_resource,
                'transports': ['websocket']
            });

            // Server status
            _.socket.on('connect', function () {
                _.isConnected = true;
                _.networkActivityMessage("Server Online", 1);
                resolve(true);
            });

            _.socket.on('disconnect', function () {
                _.setDisconnect();
                _.connectToServer();
                /* Login Widget on Disconnect (small panel) */
                if (_.client_open) {
                    _.clearDataInterface();
                    if (!_.ajax_loaded.includes('loginwidget')) {
                        _.loadWidgetLogin();
                    } else {
                        _.showWidgetLogin();
                    }
                }
                if (!_.connectionInfo.error) {
                    _.networkActivityMessage("Disconnesso dal server");
                }
            });

            _.socket.on('reconnect_attempt', function () {
                console.log('User Reconnected');
            });

            _.socket.on('connect_error', function (e) {
                if (_.isConnected) {
                    _.networkActivityMessage("Connessione chiusa");
                } else {
                    _.networkActivityMessage("Il server di gioco è offline.", 0);
                }
                resolve(false);
            });
        });
    }

    handleLoginData(data) {
        let _ = this;
        if (data.indexOf("&!connmsg{") == 0) {
            let end = data.indexOf('}!');
            let rep = $.parseJSON(data.slice(9, end + 1));
            if (rep.msg) {
                switch (rep.msg) {
                    case 'ready':
                        _.sendOOB({
                            itime: _.client_state.when.toString(16)
                        });
                        break;

                    case 'enterlogin':
                        _.performLogin();
                        break;

                    case 'shutdown':
                        console.log('shutdown');
                        _.networkActivityMessage('Attenzione, il server sarà spento entro breve per manutenzione.');
                        _.performLogin();
                        break;

                    case 'reboot':
                        console.log('reboot');
                        _.networkActivityMessage('Attenzione, il server sarà riavviato entro breve.');
                        _.performLogin();
                        break;

                    case 'created':
                    case 'loginok':
                        // Preload client then start the magic
                        let clientPreloader = new Preloader(AssetsList, _.images_path);
                        // If UI has been past loaded (like on disconnection user action)
                        if (_.client_open) {
                            _.closePopup();
                            _.completeHandshake();
                            _.handleServerData(data.slice(end + 2));
                        } else {
                            clientPreloader.init().then(function () {
                                _.dismissLoginPanel();
                                _.loadInterface();
                                _.completeHandshake();
                                _.handleServerData(data.slice(end + 2));
                            }, () => {
                                console.log("Assets error") // Error!
                            });
                        }

                        // User loged in with Facebook SDK.

                        /*if(!directLogin)
                        {
                            if (updateChars)
                            {
                                doUpdateCharacters();
                            }
                            
                            moveLoginPanel('login');
                        }*/
                        break;

                    default:
                        let connectionError = _.getLoginReplyMessage(rep.msg);
                        if (!connectionError) {
                            connectionError = _.getLoginReplyMessage('errorproto');
                        }
                        _.loginError(connectionError);
                        break;

                }
            }
        }
    }

    completeHandshake() {
        let _ = this;
        _.socket.off('data');
        _.socket.on('data', _.handleServerData.bind(_));
        _.setHandshaked();
    }

    handleServerData(msg) {
        let _ = this;
        _.netdata += msg;
        let len = _.netdata.length;

        if (_.netdata.indexOf("&!!", len - 3) !== -1) {

            let data = _.preparseText(_.netdata.substr(0, len - 3));

            try {
                _.showOutput(_.parseForDisplay(data));
            } catch (err) {
                console.log(err);
            }

            _.netdata = '';

            let now = Date.now();
            if (now > _.client_update.last + 1000) {
                if (_.client_update.inventory.needed && _.client_options.extradetail_open) {
                    _.sendToServer('@inv');
                    _.client_update.inventory.needed = false;
                    _.client_update.last = now;
                }

                /*if (_.client_update.equipment.needed && _.isDialogOpen('#equipdialog')){
                    sendToServer('@equip');
                    client_update.equipment.needed = false;
                    client_update.last = now;
                }*/

                if (_.client_update.room.needed && _.client_options.extradetail_open) {
                    _.sendToServer('@agg');
                    _.client_update.room.needed = false;
                    _.client_update.last = now;
                }
            }

        } else if (len > 200000) {
            _.showOutput('<br>Errore di comunicazione con il server!<br>');
            _.netdata = '';
            _.setDisconnect();
        }
    }

    setHandshaked() {
        this.clearUpdate();
    }

    clearUpdate() {
        this.client_update.inventory.version = -1;
        this.client_update.inventory.needed = false;
        this.client_update.equipment.version = -1;
        this.client_update.equipment.needed = false;
        this.client_update.room.version = -1;
        this.client_update.room.needed = false;
    }

    setDisconnect() {
        let _ = this;
        _.clearDataInterface();
        _.isConnected = false;
        _.inGame = false;
    }

    clearDataInterface() {
        let _ = this;
        _.client_update.data.info = false;
        _.client_update.data.stato = false;
    }

    dismissLoginPanel() {
        $('.tg-loginpanel').remove();
    }

    initLoginPanel() {

        let _ = this;

        _.initIntroTextRotator();
        _.addScrollBar('.tg-loginpanel', 'loginpanel');

        //toggle logo visibility
        $('.tg-logo-composit').css('visibility', 'visible');


        $('#login_username').focus();

        $('#loginForm').on('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();

            let el = $('.tg-loginbtn');
            el.prop('disabled', true);

            setTimeout(function () {
                el.prop('disabled', false);
            }, 1500);

            let name = $('#login_username').val();
            let pass = $('#login_password').val();

            if ($(this)[0].checkValidity() === false) {
                $(this).addClass('was-validated');
                return;
            };

            _.loginNetworkActivityMessage("Connessione in corso...");

            _.connectionInfo.loginName = name;
            _.connectionInfo.loginPass = pass;
            _.connectionInfo.mode = "login";
            //Attach oob Socket Handler
            _.socket.on('data', _.handleLoginData.bind(_));
            _.socket.emit('loginrequest');
        });

        // On New  Character Creation button
        $('#doNewCharacter').on('click', function () {
            _.openNoFeaturePopup();
        });
    }

    initIntroTextRotator(index) {
        let _ = this;

        let quotes = $("#rotateText .phrase");
        let quoteIndex = index == null ? -1 : index;
        ++quoteIndex;
        quotes.eq(quoteIndex % quotes.length)
            .fadeIn(1500)
            .delay(4000)
            .fadeOut(1500, function () {
                _.initIntroTextRotator(quoteIndex);
            });
    }

    /* Mini Panel showed after disconnect or InGame Error (with disconection)*/
    initWidgetLoginPanel() {
        let _ = this;

        /* Set Player Image (Last) */
        let playerImg = $('<img/>', {
            src: _.client_update.data.player_image
        });

        /* Set Player Name */
        $('span', '#widgetLoginReconnect').text(_.client_update.data.player_name);

        $('.tg-charavatar-last').html(playerImg);

        /* Reconnect Button */
        $('#widgetLoginReconnect').on('click', function (e) {
            _.socket.off('data');
            //Attach oob Socket Handler
            _.socket.on('data', _.handleLoginData.bind(_));
            _.socket.emit('loginrequest');
        });

        /* Exit */
        $('#widgetLoginExit').on('click', function () {
            location.reload();
        })

        $('#widgetLoginNewConnection').on('click', function () {
            $('.tg-widgetlogin-menu').hide();
            $('#widgetLoginForm').show();
        })

        /* New Login */
        $('#widgetLoginForm').on('submit', function (e) {
            e.preventDefault();
            let name = $('#widget_username').val();
            let pass = $('#widget_password').val();
            if (!name || !pass) {
                //TODO: Notify user to provide credentials
                return;
            }
            _.widgetLoginNetworkActivityMessage("Connessione in corso...");

            _.connectionInfo.loginName = name;
            _.connectionInfo.loginPass = pass;
            _.connectionInfo.mode = "login";
            _.socket.off('data');
            //Attach oob Socket Handler
            _.socket.on('data', _.handleLoginData.bind(_));
            _.socket.emit('loginrequest');
        });
    }

    performLogin() {
        let _ = this;
        if (_.connectionInfo.mode == 'login') {
            _.sendToServer("login:" + _.connectionInfo.loginName + "," + _.connectionInfo.loginPass + "\n");
        }
    }

    loginErrorClean() {
        _.connectionInfo.error = null;
    }

    loginError(msg) {
        this.connectionInfo.error = msg;
        this.loginNetworkActivityMessage(msg);
    }

    loginNetworkActivityMessage(msg) {
        $('#loginNetworkActivityMessage').text(msg)
    }

    widgetLoginNetworkActivityMessage(msg) {
        $('#widgetLoginStatus').text(msg);
    }

    networkActivityMessage(msg, status) {
        $('.tg-serverstatus').text(msg)
        $('body').attr('data-serverstatus', status);
    }

    disconnectFromServer() {
        let _ = this;
        if (_.isConnected) {
            if (_.inGame)
                _.sendToServer(_.historyPush('fine'));
            else
                _.socket.disconnect();
        }
    }

    sendOOB(data) {
        let _ = this;

        if (!_.isConnected) {
            return;
        }
        _.socket.emit('oob', data);
    }

    processCommands(text, save_history) {
        let _ = this;
        if (_.inGame) {
            let cmds = _.parseInput(text);

            if (cmds) {
                //check if cmd will be pushed in the history array
                if (save_history) {
                    _.historyPush(text);
                }
                for (let i = 0; i < cmds.length; i++) {
                    _.sendToServer(cmds[i]);
                }
            }
        } else {
            _.sendToServer(text);
            $('#tgInputUser').val('').focus();
        }
    }

    parseInput(input) {

        let _ = this;
        /* Split input separated by ; */
        let inputs = input.split(/\s*;\s*/);
        let res = [];

        /* Substitute shortcuts on each command and join results */
        for (let i = 0; i < inputs.length; ++i) {
            let subs = _.substShort(inputs[i]).split(/\s*;\s*/);
            res = res.concat(subs);
        }
        /* Return the resulting array */
        return res;
    }

    substShort(input) {

        let _ = this;
        // Split into arguments
        let args = input.split(/\s+/);

        // Get the shortcut index
        let shortcut_key = args.shift();
        let shortcut_num = parseInt(shortcut_key);
        let shortcut_cmd;
        if (!isNaN(shortcut_num)) {
            shortcut_cmd = _.client_options.shortcuts[shortcut_num];
        } else if (typeof (_.shortcuts_map[shortcut_key]) != 'undefined') {
            shortcut_cmd = _.client_options.shortcuts[_.shortcuts_map[shortcut_key]];
        }

        // Check if the shortcut is defined
        if (shortcut_cmd) {
            // Use the shortcut text as command
            input = shortcut_cmd.cmd;

            if (/\$\d+/.test(input)) {
                // Substitute the arguments
                for (let arg = 0; arg < args.length; ++arg) {
                    let rx = new RegExp("\\$" + (arg + 1), 'g');
                    input = input.replace(rx, args[arg]);
                }

                // Remove remaining letiables
                input = input.replace(/\$\d+/g, '');
            } else
                input += " " + args.join(" ");
        }

        if (_.cmd_prefix.length > 0) {
            input = _.cmd_prefix + " " + input;
        }

        return input;
    }

    /* *****************************************************************************
     * MESSAGES PARSE
     */

    preparseText(msg) {

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

    parseForDisplay(msg) {
        let _ = this,
            pos;

        //Hide text (password)
        msg = msg.replace(/&x\n*/gm, function () {
            _.inputPassword();
            return '';
        });

        //Show text (normal input)
        msg = msg.replace(/&e\n*/gm, function () {
            _.inputText();
            return '';
        });

        // Sky picture
        msg = msg.replace(/&o.\n*/gm, function (sky) {
            let sky_parse = sky.charAt(2);
            _.setSky(sky_parse);
            return '';
        });

        // Exits info
        msg = msg.replace(/&d\d{6}\n*/gm, function (doors) {
            let doors_parse = doors.substr(2, 6);
            _.setDoors(doors_parse);
            return '';
        });

        // Audio
        msg = msg.replace(/&!au"[^"]*"\n*/gm, function (audio) {
            let audio_parse = audio.slice(5, audio.lastIndexOf('"'));
            _.playAudio(audio_parse);
            return '';
        });

        // Player status
        msg = msg.replace(/&!st"[^"]*"\n*/gm, function (status) {
            let status_parse = status.slice(5, status.lastIndexOf('"')).split(',');
            return _.setStatus(status_parse);
        });

        // Player status
        msg = msg.replace(/&!up"[^"]*"\n*/gm, function (update) {
            let update_parse = update.slice(5, status.lastIndexOf('"')).split(',');

            if (update_parse[0] > _.client_update.inventory.version)
                _.client_update.inventory.needed = true;

            if (update_parse[1] > _.client_update.equipment.version)
                _.client_update.equipment.needed = true;

            if (update_parse[2] > _.client_update.room.version)
                _.client_update.room.needed = true;

            return '';
        });

        // Image in side frame (with gamma)
        msg = msg.replace(/&!img"[^"]*"\n*/gm, function (image) {
            console.log('image gamma');
            // let image = image.slice(6, image.lastIndexOf('"')).split(',');
            // showImageWithGamma(image[0], image[1], image[2], image[3]);
            return '';
        });

        // Image in side frame
        msg = msg.replace(/&!im"[^"]*"\n*/gm, function (image) {
            let image_parse = image.slice(5, image.lastIndexOf('"'));
            _.showImage(image_parse);
            return '';
        });

        // Player is logged in
        msg = msg.replace(/&!logged"[^"]*"/gm, function () {
            _.inGame = true;
            _.processCommands('info; stato; @rima', false);
            return '';
        });

        // Close the text editor
        msg = msg.replace(/&!ea"[^"]*"\n*/gm, function (options) {
            _.closeEditor();
            return '';
        });

        // Open the text editor
        msg = msg.replace(/&!ed"[^"]*"\n*/gm, function (options) {
            let options_parse = options.slice(5, options.lastIndexOf('"')).split(',');
            let text = options_parse.slice(2).toString().replace(/\n/gm, ' ');
            _.openEditor(options_parse[0], options_parse[1], text);
            return '';
        });

        // Map data
        msg = msg.replace(/&!map\{[\s\S]*?\}!/gm, function (map) {
            let map_parse = $.parseJSON(map.slice(5, -1));
            _.MAP_OBJECT.updateMap(map_parse);
            return '';
        });

        // Book
        msg = msg.replace(/&!book\{[\s\S]*?\}!/gm, function (b) {
            let b_parse = $.parseJSON(b.slice(6, -1));
            console.log('open book');
            // openBook(b);
            return '';
        });

        // List of commands
        msg = msg.replace(/&!cmdlst\{[\s\S]*?\}!/gm, function (cmd) {
            let cmd_parse = $.parseJSON(cmd.slice(8, -1).replace(/"""/, '"\\""'));
            return _.renderCommandsList(cmd_parse);
        });

        // Generic page (title, text)
        msg = msg.replace(/&!page\{[\s\S]*?\}!/gm, function (p) {
            let page_parse = $.parseJSON(p.slice(6, -1)); /* .replace(/\n/gm,' ') */
            return _.renderGenericPage(page_parse)
        });

        // Generic table (title, head, data)
        msg = msg.replace(/&!table\{[\s\S]*?\}!/gm, function (t) {
            let gtable_parse = $.parseJSON(t.slice(7, -1));
            return _.renderTable(gtable_parse);
        });

        // Inventory
        msg = msg.replace(/&!inv\{[\s\S]*?\}!/gm, function (inv) {
            let inv_parse = $.parseJSON(inv.slice(5, -1));
            console.log('inventory');
            return _.renderInventory(inv_parse);
            return '';
        });

        // Room details
        msg = msg.replace(/&!room\{[\s\S]*?\}!/gm, function (dtls) {
            let dtls_parse = $.parseJSON(dtls.slice(6, -1));
            return _.renderDetails(dtls_parse, dtls_parse.dir ? 'dir' : 'room');
        });

        // Person details
        msg = msg.replace(/&!pers\{[\s\S]*?\}!/gm, function (dtls) {
            let dtls_parse = $.parseJSON(dtls.slice(6, -1));
            return _.renderDetails(dtls_parse, 'pers');
        });

        // Object details
        msg = msg.replace(/&!obj\{[\s\S]*?\}!/gm, function (dtls) {
            let dtls_parse = $.parseJSON(dtls.slice(5, -1).replace(/\n/gm, ' '));
            return _.renderDetails(dtls_parse, 'obj');
        });

        // Equipment
        msg = msg.replace(/&!equip\{[\s\S]*?\}!/gm, function (eq) {
            let eq_parse = $.parseJSON(eq.slice(7, -1).replace(/\n/gm, '<br>'));
            return _.renderEquipment(eq_parse);
        });

        // Workable lists
        msg = msg.replace(/&!wklst\{[\s\S]*?\}!/gm, function (wk) {
            let wk_parse = $.parseJSON(wk.slice(7, -1));
            console.log('renderworkslist');
            _.openNoFeaturePopup();
            //return renderWorksList(wk);
        });

        // Skill list
        msg = msg.replace(/&!sklst\{[\s\S]*?\}!/gm, function (skinfo) {
            let skinfo_parse = $.parseJSON(skinfo.slice(7, -1));
            console.log('renderSkillsList');
            //return renderSkillsList(skinfo_parse);
        });

        // Player info
        msg = msg.replace(/&!pginf\{[\s\S]*?\}!/gm, function (info) {
            let info_parse = $.parseJSON(info.slice(7, -1));
            if (!_.client_update.data.info) {
                _.setDataInterface('info', info_parse);
                return '';
            } else {
                return _.renderPlayerInfo(info_parse);
            }
        });

        // Player status
        msg = msg.replace(/&!pgst\{[\s\S]*?\}!/gm, function (status) {
            let status_parse = $.parseJSON(status.slice(6, -1));
            if (!_.client_update.data.stato) {
                _.setDataInterface('stato', status_parse);
                return '';
            } 
            else {
                return _.renderPlayerStatus(status_parse);
            }

        });

        // (New) Image Request Box
        msg = msg.replace(/&!imgreq\{[\s\S]*?\}!/gm, function (imgreq) {
            //  imgreq = $.parseJSON(imgreq.slice())
            return _.renderUserImageRequest(imgreq);
        });

        // Selectable generic
        msg = msg.replace(/&!select\{[\s\S]*?\}!/gm, function (s) {
            s = $.parseJSON(s.slice(8, -1));
            console.log('selectDialog');
            //return selectDialog(s);
        });

        // Refresh command
        msg = msg.replace(/&!refresh\{[\s\S]*?\}!/gm, function (t) {
            let rcommand_parse = $.parseJSON(t.slice(9, -1));
            return _.handleRefresh(rcommand_parse);
        });

        // Pause scroll
        msg = msg.replace(/&!crlf"[^"]*"/gm, function () {
            _.pauseOn();
            return '';
        });

        // Clear message
        pos = msg.lastIndexOf('&*');
        if (pos >= 0) {
            _.clearOutput();
            msg = msg.slice(pos + 2);
        }

        // Filterable messages
        msg = msg.replace(/&!m"(.*)"\{([\s\S]*?)\}!/gm, function (line, type, msg) {
            console.log('addFilterTag');
            //  return addFilterTag(type, msg);
        });


        msg = msg.replace(/&!ce"[^"]*"/gm, function (image) {
            let image_parse = image.slice(5, -1);
            console.log('renderEmbeddedImage');
            //return renderEmbeddedImage(image_parse);
        });

        msg = msg.replace(/&!ulink"[^"]*"/gm, function (link) {
            let link_parse = link.slice(8, -1).split(',');
            return _.renderLink(link_parse[0], link_parse[1]);
        });

        msg = msg.replace(/&!as"[^"]*"/gm, '');

        msg = msg.replace(/&!(ad|a)?m"[^"]*"/gm, function (mob) {
            let mob_parse = mob.slice(mob.indexOf('"') + 1, -1).split(',');
            let desc_parse = mob.slice(5).toString();
            return _.renderMob(mob_parse[0], mob_parse[1], mob_parse[2], mob_parse[3], desc_parse, 'interact pers');
        });

        msg = msg.replace(/&!(ad|a)?o"[^"]*"/gm, function (obj) {
            let obj_parse = obj.slice(obj.indexOf('"') + 1, -1).split(',');
            let desc_parse = obj.slice(5).toString();
            return _.renderObject(obj_parse[0], obj_parse[1], obj_parse[2], obj_parse[3], desc_parse, 'interact obj');
        });

        msg = msg.replace(/&!sm"[^"]*"/gm, function (icon) {
            let icon_parse = icon.slice(5, -1).split(',');
            return _.renderIcon(icon_parse[0], icon_parse[1], 'room', null, null, 'interact pers');
        });

        msg = msg.replace(/&!si"[^"]*"/gm, function (icon) {
            let icon_parse = icon.slice(5, -1).split(',');
            return _.renderIcon(icon_parse[0], null, null, null, null, "v" + icon_parse[1]);
        });

        msg = msg.replace(/&i/gm, function () {
            _.isGod = true;
            return '';
        });

        msg = msg.replace(/&I\d/gm, function (inv) {
            _.godInvLev = parseInt(inv.substr(2, 3));
            return '';
        });
        /* \r is already removed at top */
        msg = msg.replace(/\n/gm, '</br>');

        if (msg != '') {
            msg = '<div class="tg-line">' + _.replaceColors(msg) + '</div>';
        }
        return msg.replace(/<p><\/p>/g, '');

    }

    handleRefresh(r) {
        let _ = this;
        if (this.isModalOpen) {
            _.sendToServer(r.cmd);
        }
        return '';
    }

    replaceColors(msg) {
        msg = msg.replace(/&B/gm, '<span class="tg-gray">');
        msg = msg.replace(/&R/gm, '<span class="tg-lt-red">');
        msg = msg.replace(/&G/gm, '<span class="tg-lt-green">');
        msg = msg.replace(/&Y/gm, '<span class="tg-yellow">');
        msg = msg.replace(/&L/gm, '<span class="tg-lt-blue">');
        msg = msg.replace(/&M/gm, '<span class="tg-lt-magenta">');
        msg = msg.replace(/&C/gm, '<span class="tg-lt-cyan">');
        msg = msg.replace(/&W/gm, '<span class="tg-white">');
        msg = msg.replace(/&b/gm, '<span class="tg-black">');
        msg = msg.replace(/&r/gm, '<span class="tg-red">');
        msg = msg.replace(/&g/gm, '<span class="tg-green">');
        msg = msg.replace(/&y/gm, '<span class="tg-brown">');
        msg = msg.replace(/&l/gm, '<span class="tg-blue">');
        msg = msg.replace(/&m/gm, '<span class="tg-magenta">');
        msg = msg.replace(/&c/gm, '<span class="tg-cyan">');
        msg = msg.replace(/&w/gm, '<span class="tg-lt-white">');
        msg = msg.replace(/&-/gm, '</span>');

        return msg;
    }

    removeColors(msg) {
        return msg.replace(/&[BRGYLMCWbrgylmcw-]/gm, '');
    }

    /* *****************************************************************************
     * MISC RENDERING
     */

    renderUserImageRequest(imgreq) {
        console.log(imgreq[0])
        console.log(imgreq[1])
    }


    renderLink(href, text) {
        return '<a href="' + href + '" target="_blank">' + text + '</a>';
    }

    renderGenericPage(page) {
        let _ = this;

        if (page.title == 'Notizie') {
            // If isnt a widget-login connection
            if (!_.client_state.widget_login) {
                _.openNotiziePopup();
            }
            return '';
        } else {
            let page_html = '<div class="tg-title lt-red">' + page.title + '</div><div class="text">' + page.text.replace(/\n/gm, '<br>') + '</div>';
            //TODO: Page parse generic 
            console.log('!page todo');
        };
        return '';
    }

    renderMob(icon, condprc, count, mrn, desc, addclass) {
        return '<div class="mob">' + this.renderIcon(icon, mrn, 'room', null, null, addclass) + '<div class="desc">' + _.decoratedDescription(condprc, null, null, count, desc) + '</div></div>'
    }

    renderObject(icon, condprc, count, mrn, desc, addclass) {
        return '<div class="obj">' + _.renderIcon(icon, mrn, 'room', null, null, addclass) + '<div class="desc">' + _.decoratedDescription(condprc, null, null, count, desc) + '</div></div>'
    }

    decoratedDescription(condprc, moveprc, wgt, count, desc) {
        let _ = this;
        let countStr = '';

        if (count > 1) {
            countStr = '&#160;<span class="cnt">[x' + count + ']</span>';
        }
        return _.renderMinidetails(condprc, moveprc, wgt) + '<div class="dd-desc">' + desc.replace(/\n/gm, ' ') + countStr + '</div>';
    }

    renderMinidetails(condprc, moveprc, wgt) {
        let pos = -13 * Math.floor(12 * (100 - condprc) / 100);
        return '<div class="hstat" style="background-position:0 ' + pos + 'px" data-condprc="' + condprc + '"' + (moveprc ? ' data-moveprc="' + moveprc + '"' : '') + (wgt != null ? ' wgt="' + wgt + '"' : '') + '></div>';
    }

    setDataInterface(cmd, data) {
        let _ = this;

        if (cmd == 'info') {
            // Name
            _.client_update.data.player_name = data.name;
            $('#charName').html(data.name);
            // Character Image
            if (data.image) {
                _.client_update.data.player_image = _.media_server_addr + data.image;
                $('.tg-characteravatar img').attr('src', _.client_update.data.player_image);
                $('.tg-characteravatar').show();
            }
            /* Info Tooltips */
            $('.tg-characteravatar').attr('title', data.name + ' ' + data.title);
            _.client_update.data.info = true;
        } 
        else if (cmd == 'stato') {
            if (data.conv) {
                $('.tg-infocharname .icon-conva').removeClass('d-none');
            } else {
                $('.tg-infocharname .icon-conva').addClass('d-none');
            }

            /* Healt, Move, Food and Drink bars */
            $('#foodBarText .barC').width(data.food + '%');
            $('#foodBarText i').text(data.food);
            $('#drinkBarText .barC').width(data.drink + '%')
            $('#drinkBarText i').text(data.drink);

            /* Set Character Status */
            if (data.conv == true) {
                $('.pg-status').text('( sei convalescente! )');
            }
            _.client_update.data.stato = true;
        }
    }

    renderPlayerStatus(status) {
        let _ = this;

        let colors = [{
                val: 15,
                txt: 'tg-red'
            },
            {
                val: 40,
                txt: 'tg-brown'
            },
            {
                val: 100,
                txt: 'tg-green'
            }
        ];

        let sttxt;
        sttxt = '<div class="out-table out-plstatus">';
        sttxt += '<div class="row">';
        sttxt += '<div class="tg-caption col-12">Condizioni</div>';
        sttxt += '<div class="col-3 rps-col">Salute</div><div class="col-4 rps-col"><span class="' + _.prcLowTxt(status.hit, colors) + '">' + status.hit + '</span>%</div><div class="col-5 rps-col">' + _.prcBar(status.hit, 'red') + '</div>';
        sttxt += '<div class="col-3 rps-col">Movimento</div><div class="col-4 rps-col"><span class="' + _.prcLowTxt(status.move, colors) + '">' + status.move + '</span>%</div><div class="col-5 rps-col">' + _.prcBar(status.move, 'green') + '</div>';
        sttxt += '<div class="col-3 rps-col">Fame</div><div class="col-4 rps-col"><span class="' + _.prcLowTxt(status.food, colors) + '">' + status.food + '</span>%</div><div class="col-5 rps-col">' + _.prcBar(status.food, 'cookie') + '</div>';
        sttxt += '<div class="col-3 rps-col">Sete</div><div class="col-4 rps-col"><span class="' + _.prcLowTxt(status.drink, colors) + '">' + status.drink + '</span>%</div><div class="col-5 rps-col">' + _.prcBar(status.drink, 'blue') + '</div>';
        if (status.msg) {
            sttxt += '<div class="col-12 tg-yellow pg-atg">' + status.msg + '</div>';
        }
        sttxt += '</div>';
        sttxt += '</div>';

        return sttxt;
    }

    renderCommandsList(cmd) {
        let cols = 6;
        let txt = '<table class="cmd"><caption>' + cmd.title + '</caption>';

        delete cmd.title;

        $.each(cmd, function (group, data) {
            txt += '<tr><th colspan="' + cols + '">Comandi ' + group + ':</th></tr>';

            $.each(data.sort(), function (idx, command) {
                if (idx % cols == 0)
                    txt += '<tr>';

                txt += '<td>' + command + '</td>';

                if (idx % cols == (cols - 1) || idx == (data.length - 1))
                    txt += '</tr>';
            });
        });

        txt += '</table>';
        return txt;
    }

    /* *****************************************************************************
     *   OTHERS COMMANDS
     */

    renderTable(t) {
        let _ = this;

        let colclass = [];

        let txt = '<table class="table table-sm">';
        if (t.title && t.dialog == false) {
            txt += '<caption>' + (t.plain ? t.title : t.title) + '</caption>';
        }

        if (t.head) {
            txt += '<thead><tr>';

            $.each(t.head, function (i, v) {
                switch ($.type(v)) {
                    case "object":
                        txt += '<th scope="col">' + v.title + '</th>';
                        break;

                    default:
                        txt += '<th scope="col">' + v + '</th>';
                        break;
                }
            });

            txt += '</tr></thead>';
        }

        if (t.data) {
            $.each(t.data, function (ri, row) {
                txt += '<tr>';
                $.each(row, function (di, elem) {
                    let h = t.head ? t.head[di] : null;
                    switch ($.type(h)) {
                        case "object":
                            switch (h.type) {
                                case "account":
                                    txt += '<td><a target="_blank" href="/admin/accounts/' + elem + '">' + elem + '</a></td>';
                                    break;

                                case "ipaddr":
                                    txt += '<td><a target="_blank" href="http://www.infosniper.net/index.php?ip_address=' + elem + '">' + elem + '</a></td>';
                                    break;

                                case "icon":
                                    txt += '<td>' + _.renderIcon(elem) + '</td>';
                                    break;

                                default:
                                    txt += '<td>' + elem + '</td>';
                                    break;
                            }
                            break;

                        default:
                            txt += '<td>' + elem + '</td>';
                            break;
                    }
                });
                txt += '</tr>';
            });
        }
        txt += '</table>';

        if (t.dialog == false)
            return t.plain ? txt : _.addFrameStyle(txt);

        _.renderInTableDialog(t.title ? t.title : "Informazioni", txt);

        //if(t.head)
        // $('#tablecont table').tablesorter();

        return '';
    }


    renderInTableDialog(title, txt) {
        let _ = this;
        let options = {};

        $('#tablecont').empty().append(_.removeColors(txt));

        if (!_.openDialog('tabledialog')) {
            console.log('not open');
            let pos = _.getWindowPosition('tabledialog');
            let size = _.getWindowSize('tabledialog');
            let w, h;

            if(size) {
                w = size[0];
                h = size[1];
            }
            else {
                w = 650;
                h = 600;
            }
            
            if(pos == null ) {
                pos = {my: "center", at: "center", of:window};
            }

            $('#tabledialog').dialog({
                modal: false,
                width: 'auto',
                position: pos,
                dialogClass:'tg-dialog parch',
                dragStop: _.saveWindowData.bind(_),
                resizeStop: _.saveWindowData.bind(_),
                closeText: 'Chiudi',
                title: title
            });
        }
    }


    /* *****************************************************************************
     * CHARACTER PAGE
     */

    loadCharacterWindow() {
        let _ = this;
        return new Promise(function (resolve, reject) {
            if(!$('#tgCharacterPage').length) {
                $.ajax({
                   url: './ajax/scheda_personaggio.html',
                }).done(function(html){
                    $('body').append(html);
                    _.addCharacterWindowEvent();
                    resolve();
                });
            }
            else {
                resolve();
            }
        });
    }

    renderPlayerInfo(info) {
        let _ = this;
        _.loadCharacterWindow().then(function (resolve, reject) {
            let d = $('#tgCharacterPage');

            d.attr('data-class', _.race_to_class[info.race.code]);

            if (info.image) {
                $('#infoimage', d).attr('src', _.media_server_addr + info.image);
            }

            $('#infoname', d).text(info.name);
            $('#infotitle', d).text(info.title);
    
            if (info.adjective) {
                $('#infoadj', d).text(info.adjective);
                $('#changeadj').hide();
            } else {
                $('#infoadj', d).text('Nessuno');
                $('#changeAdj').show();
            }
    
            $('#inforace', d).text(info.race.name);
            $('#infocult', d).text(info.cult);
            $('#infoethn', d).text(info.ethn);
            $('#inforelig', d).text(info.relig ? info.relig : 'Nessuna');
            $('#infoheight', d).text(info.height + ' Cm.');
            $('#infosex', d).text(info.sex.name);
            $('#infocity', d).text(info.city ? info.city : "Nessuna");
            $('#infowgt', d).text(info.weight + ' Pietre');
            $('#infoage', d).text(info.age + ' Anni');
            $('#infolang', d).text(info.lang);
            $('#infoborn', d).text(info.born);
    
            $('#infodesc', d).text(info.desc.replace(/([.:?!,])\s*\n/gm, '$1<p></p>').replace(/\n/gm, ' '));
    
    
            $('#infowil', d).width(_.limitPrc(info.abil.wil.prc) + "%");
            $('#infowillvl', d).text(_.prcLowTxt(info.abil.wil.prc, _.abiltxt));
    
            $('#infoint', d).width(_.limitPrc(info.abil.int.prc) + "%");
            $('#infointlvl', d).text(_.prcLowTxt(info.abil.int.prc, _.abiltxt));
    
            $('#infoemp', d).width(_.limitPrc(info.abil.emp.prc) + "%");
            $('#infoemplvl', d).text(_.prcLowTxt(info.abil.emp.prc, _.abiltxt));
    
            $('#infosiz', d).width(_.limitPrc(info.abil.siz.prc) + "%");
            $('#infosizlvl', d).text(_.prcLowTxt(info.abil.siz.prc, _.abiltxt));
    
            $('#infocon', d).width(_.limitPrc(info.abil.con.prc) + "%");
            $('#infoconlvl', d).text(_.prcLowTxt(info.abil.con.prc, _.abiltxt));
    
            $('#infostr', d).width(_.limitPrc(info.abil.str.prc) + "%");
            $('#infostrlvl', d).text(_.prcLowTxt(info.abil.str.prc, _.abiltxt));
    
            $('#infodex', d).width(_.limitPrc(info.abil.dex.prc) + "%");
            $('#infodexlvl', d).text(_.prcLowTxt(info.abil.dex.prc, _.abiltxt));
    
            $('#infospd', d).width(_.limitPrc(info.abil.spd.prc) + "%");
            $('#infospdlvl', d).text(_.prcLowTxt(info.abil.spd.prc, _.abiltxt));
       
            if (!_.openDialog('#infodialog')) {
                $('#tgCharacterPage').dialog({
                    width: '700',
                    height: '600',
                    maxWidth:'700',
                    minHeight: '500',
                    resizable: false,
                    position: {my: 'center', at:'center', of: $('.tg-area')},
                });
            }

        });

        return '';
    }

    addCharacterWindowEvent() {
        let _ = this;

        $('.info-avatar').on('click', function(){
            if(!_.AVUPLOAD){
                _.AVUPLOAD = new uploadAvatar();
                _.AVUPLOAD.init();
            };
            $('#characterInfo').addClass('upimg');            
        });

        $('#playerImgFile').on('change', function (e) {
            _.AVUPLOAD.readFile(this);
        });

        /* Upload Image */
        $('#formUplAvatar').on('submit', function(e){
            e.preventDefault();
            _.AVUPLOAD.send(_.ws_server_addr);
        });
    }


    /* *****************************************************************************
    *  Editor 
    */

    openEditor(maxchars, title, text) {
        let _ = this;

        let textarea = $('#editorTextArea').val(text);
        $('#editorTitle').text(title);

        _.openEditorPopup();

        $('#abortEditor, #mfp-close').one('click', function () {
            _.abortEdit();
            _.closeEditor();
        });
        $('#saveEditor').one('click', function () {
            _.saveEdit(80);
            _.closeEditor();
        });

        // Max Chars counter
        let text_max = maxchars;
        $('#editorMaxCharsCount').html(text_max + ' caratteri rimasti');
        textarea.attr('maxlength', maxchars);
        textarea.keyup(function () {
            let text_length = $(this).val().length;
            let text_remaining = text_max - text_length;

            $('#editorMaxCharsCount').html(text_remaining + ' caratteri rimasti');
        });

        _.in_editor = true;
    }

    closeEditor() {
        let _ = this;
        _.in_editor = false;

        _.closePopup();
        _.focusInput();
    }

    abortEdit() {
        if (this.in_editor) {
            this.sendToServer('##ce_abort');
        }
    }

    saveEdit(maxLinelen) {

        let _ = this;

        let text = $('#editorTextArea').val().split('\n');

        for (let l = 0; l < text.length; l++) {
            let remText = text[l]
            while (remText.length > 0) {

                let currline,
                    slicepos = remText.lastIndexOf(' ', maxLinelen);

                if (slicepos > 0) {
                    currline = remText.slice(0, slicepos) + '\\';
                    remText = remText.slice(slicepos);
                } else {
                    currline = remText;
                    remText = '';
                }

                _.sendToServer('##ce' + currline);
            }
        }
        _.sendToServer('##ce_save');
    }


    /* *****************************************************************************
     * ICONS
     */

    tileBgPos(tilenum) {
        let _ = this;
        let tc = _.tileCoords(tilenum);
        return '-' + tc[0] + 'px -' + tc[1] + 'px';
    }

    tileCoords(tilenum) {
        let posx = 32 * (tilenum & 0x7f);
        let posy = 32 * (tilenum >> 7);
        return [posx, posy];
    }

    renderIcon(icon, mrn, cnttype, cntmrn, cmd, addclass) {
        let _ = this;
        if (!icon)
            icon = 416;

        return '<div class="iconimg ico_' + icon + ' ' + (addclass ? ' ' + addclass : '') + '" style="background-position:' + _.tileBgPos(icon) + '"' + (mrn ? ' data-mrn="' + mrn + '"' : '') + (cmd ? ' data-cmd="' + cmd + '"' : '') + (cnttype ? ' data-cnttype="' + cnttype + '"' : '') + (cntmrn ? ' data-cntmrn="' + cntmrn + '"' : '') + '></div>';
    }

    renderIconWithBackBorder(icon, mrn, cnttype, cntmrn, cmd, addclass) {
        let _ = this;
        return '<div class="backslot">' + _.renderIcon(icon, mrn, cnttype, cntmrn, cmd, addclass) + '</div>';
    }

    /* *****************************************************************************
     * SKY
     */

    setSky(sky) {
        /* 
        0: notte (luna 0)
        1: notte (luna 1)
        2: notte (luna 2)
        3: notte (luna 3)
        4: notte (luna 4)
        5: alba 
        6: mattina
        7: mezzogiorno
        8: pomeriggio
        9: sera
        N: notte
        d:  giorno + pioggia + fulmini
        e:  giorno + pioggia
        f:  giorno + fulmini
        g:  aurora boreale (??)
        i:  tramonto
        o:  aurora
        p:  notte + pioggia + fulmini
        q:  giorno nuvoloso
        r:  notte + pioggia
        s:  notte + pioggia + fulmini
        t:  giorno + neve
        u:  Giorno con Arcobaleno (??)
        w:  notte nuvolosa (no particelle)
        y:  notte con neve

        /* Sets the attribute on sky element to interlace with the Css rules */
        $('#sky').attr('data-sky', sky);
    }

    /* *****************************************************************************
     * DOORS & DIRECTION
     */

    closeLockDoor(dir) {
        let cmd;
        if (_.dir_status[dir] == '2') {
            cmd = 'chiudi' + _.dir_names[dir];
        } else if (_.dir_status[dir] == '3') {
            cmd = 'blocca ' + _.dir_names[dir];
        }
        if (cmd) {
            _.sendToServer(cmd);
        }
    }

    doorsInit() {
        let _ = this;
        for (let d = 0; d < _.dir_names.length; ++d)
            $('#' + _.dir_names[d]).on('click', {
                dir: d
            }, function (event) {
                if (_.inGame) {
                    if (event.which == 1) {
                        _.goDir(event.data.dir);
                    } else if (event.which == 3) {
                        event.preventDefault();
                        _.closeLockDoor(event.data.dir);
                    }
                }
            });
    }

    goDir(dir) {

        let _ = this;

        let cmd;

        if (_.godInvLev == 0 && _.dir_status[dir] == '3') {
            cmd = 'apri ' + _.dir_names[dir];
        } else if (_.godInvLev == 0 && _.dir_status[dir] == '4') {
            cmd = 'sblocca ' + _.dir_names[dir];
        } else {
            cmd = _.dir_names[dir];
        }

        // Do not push into history
        if (cmd) {
            _.sendToServer(cmd);
        }
    }

    setDoors(doors) {
        let _ = this;
        for (let d = 0; d < _.dir_names.length; ++d) {
            $('#' + _.dir_names[d] + ' .dir-ico').css('background-position', -26 * doors[d]);
        }
        _.dir_status = doors;
    }
    
    /* -------------------------------------------------
     *  MAP 
     * -------------------------------------------------*/

    mapInit() {
        let _ = this;
        _.MAP_OBJECT = new Map();
        _.MAP_OBJECT.init();
        _.MAP_OBJECT.prepareCanvas(_.images_path);
    }

    /* *****************************************************************************
     * AUDIO & MUSIC
     */

    audioInit() {
        let _ = this;
        if (typeof _.client_options.musicVolume != 'number' || _.client_options.musicVolume < 0 || _.client_options.musicVolume > 100) {
            client_options.musicVolume = 70;
        }

        if (typeof _.client_options.soundVolume != 'number' || _.client_options.soundVolume < 0 || _.client_options.soundVolume > 100) {
            _.client_options.soundVolume = 100;
        }

        $('#music').get(0).volume = _.client_options.musicVolume / 100;
        $('#sound').get(0).volume = _.client_options.soundVolume / 100;
    }

    playAudio(audio) {
        let _ = this;
        let mp3 = '.mp3';
        let mid = '.mid';

        if (audio.indexOf(mp3, audio.length - mp3.length) !== -1) {
            _.playMusic(audio);
        } else if (audio.indexOf(mid, audio.length - mid.length) !== -1) {
            _.playSound(audio.replace('.mid', '.mp3'));
        } else if (_.client_options.soundVolume > 0) {
            _.playSound(audio.replace('.wav', '.mp3'));
        }
    }

    playMusic(music) {
        let _ = this;
        if (_.client_options.musicVolume > 0) {
            let current_src = $('#music').attr('src');
            let new_src = _.sounds_path + music;

            if (current_src != new_src || $('#music').prop('paused') == true) {
                $('#music').attr('src', new_src);
            }
        }
    }

    playSound(sound) {
        let _ = this;
        if (_.client_options.soundVolume > 0) {
            let current_src = $('#sound').attr('src');
            let new_src = _.sounds_path + sound;

            if (current_src != new_src || $('#sound').prop('ended')) {
                $('#sound').attr('src', new_src);
            }
        }
    }

    stopMusic() {
        let _ = this;
        $('#music').animate({
            volume: 0
        }, 3500, function () {
            $(this)[0].pause();
            $(this).get(0).volume = _.client_options.musicVolume / 100;
        })

    }

    /* *****************************************************************************
     * EQUIPMENT
     */

    getEquipPositionByName() {
        return {
            "r_finger": "Al dito destro",
            "l_finger": "Al dito sinistro",
            "neck": "Al collo",
            "body": "Sul corpo",
            "head": "In testa",
            "legs": "Sulle gambe",
            "feet": "Ai piedi",
            "hands": "Sulle mani",
            "arms": "Sulle braccia",
            "around": "Attorno al corpo",
            "waist": "In vita",
            "r_wrist": "Al polso destro",
            "l_wrist": "Al polso sinistro",
            "r_hand": "Nella mano destra",
            "l_hand": "Nella mano sinistra",
            "back": "Sulla schiena",
            "r_ear": "All'orecchio destro",
            "l_ear": "All'orecchio sinistro",
            "eyes": "Sugli occhi",
            "sheath": "Nel fodero",
            "belt": "Alla cintura",
            "over": "A tracolla",
            "r_shoulder": "Sulla spalla destra",
            "l_shoulder": "Sulla spalla sinistra",
            "tied": "Imprigionato"
        }
    }

    getEquipPosByNum() {
        let equip_position_by_num = [''].concat($.map(getEquipPositionByName, function (v) {
            return v;
        }));
        return equip_position_by_num;
    }

    getRaceToClass() {
        return {
            "uma": "human",
            "ume": "human",
            "eal": "elf",
            "esi": "elf",
            "dra": "elf",
            "drw": "elf",
            "meu": "human",
            "mel": "human",
            "hal": "halfling",
            "nan": "dwarf",
            "orc": "orc",
            "gob": "goblin",
            "els": "elf"
        }
    }

    renderEquipment(eq) {
        let _ = this;
        _.loadCharacterWindow().then(function (resolve, reject) {
            if (!eq.up) {
                return '';
            }
        });
    }


    /* *****************************************************************************
     * PLAYER STATUS
     */

    setStatus(st) {
        let _ = this;
        _.setCombatStatus(st);
        _.updatePlayerStatus(st[0], st[1]);
        return '';
    }

    updatePlayerStatus(hprc, mprc) {
        let _ = this;
        let hcolor = _.prcLowTxt(hprc, _.hlttxtcol);
        let mcolor = _.prcLowTxt(hprc, _.hlttxtcol);

        $('.movebar').width(_.limitPrc(mprc) + '%');
        $('#moveBarText i').css('color', mcolor).text(mprc);

        $('.healthbar').width(_.limitPrc(hprc) + '%');
        $('#healtBarText i').css('color', hcolor).text(hprc);
    }


   /* *****************************************************************************
     * COMBAT BOX
     */

    setCombatStatus(st) {

        let _ = this;

        if (st.length == 6) {
            $('.enemyname').text(st[5]);
            if (!_.in_combat) {
                $('body').addClass('in-combat');

                /* Opening inline (default) or  dialog if dashboard is collapsed */
                if ($('.tg-characterpanel').is(':visible')) {
                    $('#tg-pills-tab-monitor').tab('show');
                }
                else {
                    let dialogID = '#combatPanelWidget';
                    let pos = _.getWindowPosition('combatPanelWidget');
                    
                    if(pos == null) {
                        pos = {my: "center", at: "center"};
                    }
                    else {
                        pos = {my: 'left' + pos[0] + ' center' + pos[1]};
                    }
                    _.dialog = $(dialogID).dialog({
                        closeOnEscape: false,
                        closeOnText: false,
                        minHeight: 0,
                        draggable: true,
                        resizable: false,
                        width: 280,
                        title: 'Target',
                        dragStop: _.saveWindowData.bind(_),
                        position: pos,
                        collision: 'flip',
                    });

                    $('#tgInputUser').focus();
                }
                _.updateEnemyStatus(st[2], st[3]);
                _.updateEnemyIcon(st[4]);

                _.in_combat = true;
            }

        } else if (_.in_combat) {
            $('body').removeClass('in-combat');
            $('#actionCombaAction_b button').prop('disabled', true);
            if (_.dialog) {
                $(_.dialog).dialog('destroy');
                _.dialog = null;
            }
            _.in_combat = false;
        }
    }

    updateEnemyStatus(hprc, mprc) {
        let h = this.limitPrc(hprc) + '%';
        let m = this.limitPrc(mprc) + '%';
        $('.enemyH').width(h);
        $('.enemy-h-prc').text(h)
        $('.enemyM').width(m);
        $('.enemy-m-prc').text(m)
    }

    updateEnemyIcon(icon) {
        let _ = this;
        if (_.enemy_icon != icon) {
            $('.enemyicon').css('background-position', _.tileBgPos(icon)).attr('mrn', 0);
        }
    }

    /* *****************************************************************************
     * RENDERING
     */

    renderDetails(info, type) {
        let _ = this;
        if (_.client_options.extradetail_open) {
            return _.renderExtraOutput(info, type);
        } else {
            return _.renderDetailsInText(info, type);
        }
    }

    renderDetailsInText(info, type) {
        let _ = this;
        let res = '';

        if (info.title) {
            res += '<div class="room"><div class="out-title"></div>' + _.capFirstLetter(info.title) + '<div class="rts"></div></div>';
        }

        res += _.renderDetailsInner(info, type, false);

        if (info.image) {
            _.showImage($('#image-cont'), info.image);
        }

        return res;
    }

    renderExtraOutput(info, type) {

        let _ = this,
            res = '',
            tpos,
            container = $('#extraoutput'),
            tabicon = $('#detailsicon-' + type, '#outputOptions'),
            wtab = ['room', 'pers', 'obj', 'dir'].indexOf(type);


        let cont_header = container.children('.extraoutput-header');
        let cont_detail = container.children('.extraoutput-detail');

        /* Set tab icon */
        if (type == 'dir') {
            tpos = _.dirBgPos[info.dir];
        } else if (type == 'room' && !info.icon) {
            tpos = $('#mp044').css('background-position')
        } else {
            tpos = _.tileBgPos(info.icon ? info.icon : 0);
        }
        tabicon.css('background-position', tpos);

        /* Set Title and Tooltip */
        if (info.title) {
            if (type == 'room' && !info.up) {
                _.toggleNotifyOutput();
                //res += '<div class="room"><div class="lts"></div>' + info.title + '<div class="rts"></div></div>';
            }
            let title = _.capFirstLetter(info.title);
            let icon = '';
            let detaildesc = '';
            if (info.desc) {
                if (info.desc.base) {

                    if (type == 'room') {
                        _.last_room_desc = _.formatText(info.desc.base, 'out-descbase');
                    } else {
                        icon = _.renderIcon(info.icon, null, null, null, null, null);
                    }

                    detaildesc += _.formatText(info.desc.base, 'out-descbase');
                } else if (info.desc.repeatlast && _.last_room_desc) {
                    detaildesc += _.formatText(_.last_room_desc);
                }
            }
            $(cont_header).show();
            $(cont_header).children('#detailtitle').html(icon + title);
            $(cont_header).children('#detaildesc').html(_.replaceColors(detaildesc));
            //TODO: da capire
            /*      if(wtab == ctab) {
                      $('#detailtitle').text(title);
                  }*/
        }

        /* Set Image */
        if (info.image) {
            _.showImage($('#detailimage'), info.image);
        } else {
            _.cleanImageContainer('.extra-detailimg');
        }

        let textarea = $(cont_detail).empty();
        let details = $(_.replaceColors(_.renderDetailsInner(info, type, true)));

        _.addDragAndDrop('.iconimg.interact', details);

        textarea.append(details);

        _.scrollPanelTo('#extraoutput', '.scrollable', false, 0);

        if (type == 'room') {
            if (_.client_update.room.version < info.let) {
                _.client_update.room.version = info.ver;
                _.client_update.room.needed = false;
            }
        }

        return res;
    }

    renderDetailsInner(info, type, inExtra) {
        let _ = this;
        let numberClassList = ' firstlist';
        let textarea = '';

        if (info.action) {
            textarea += '<div class="details-inner">' + info.action + '</div>';
        }

        /* Print description */
        if (info.desc && !_.client_options.extradetail_open) {
            textarea += '<div class="out-description">';
            if (info.desc.base) {
                if (type == 'room') {
                    _.last_room_desc = _.formatText(info.desc.base, 'out-descbase');
                }
                textarea += _.formatText(info.desc.base, 'out-descbase');
            } else if (info.desc.repeatlast && _.last_room_desc) {
                textarea += _.last_room_desc;
            }

            if (info.desc.details) {
                textarea += _.formatText(info.desc.details, 'out-charsubdetail tg-yellow d-block');
            }

            if (info.desc.equip) {
                textarea += _.formatText(info.desc.equip, 'out-charsubdetail tg-green d-block');
            }

            textarea += '</div>';

        }
        if (inExtra) {

            /* Print Persons List */
            if (info.perscont) {
                textarea += _.renderDetailsList(type, info.num, info.perscont, 'pers', 'tg-cyan tg-list-person' + numberClassList);
            }
            /* Print Objects List */
            if (info.objcont) {
                textarea += _.renderDetailsList(type, info.num, info.objcont, 'obj', 'tg-yellow tg-list-object' + numberClassList);
            }
        } else {
            /* Print objects list */
            if (info.objcont) {
                numberClassList = info.perscont ? numberClassList : '';
                textarea += _.renderDetailsList(type, info.num, info.objcont, 'obj', 'tg-yellow');
            }
            /* Print Persons List */
            if (info.perscont) {
                numberClassList = !info.objcont ? numberClassList : '';
                textarea += _.renderDetailsList(type, info.num, info.perscont, 'pers', 'tg-lt-green');
            }
        }

        /* Print equipment list */
        if (info.eqcont) {
            textarea += _.renderDetailsList(type, info.num, info.eqcont, 'obj');
        }
        /* Print where info */
        if (info.where) {
            textarea += '<div class="tg-backdetail">' + _.renderIconWithBackBorder(info.where.icon, info.where.num, null, null, null, 'interact where') + '<div class="desc">Si trova ' + info.where.title + '.</div></div>';
        }


        return textarea;
    }

    renderDetailsList(cont_type, cont_num, cont, type, style) {

        let _ = this;
        let res = '',
            txt = '',
            interactClass = '';

        if (cont.list) {
            if (cont_type == 'pers' || cont_type == 'equip') {
                cont.list.sort(function (a, b) {
                    let eq_pos_a = $.isArray(a.eq) ? _.pos_to_order[a.eq[0]] : 0;
                    let eq_pos_b = $.isArray(b.eq) ? _.pos_to_order[b.eq[0]] : 0;
                    return eq_pos_a - eq_pos_b;
                });
            }

            for (let n = 0; n < cont.list.length; n++) {

                let l = cont.list[n];
                let is_group = (l.mrn && l.mrn.length) > 1;
                let opened = (l.mrn && _.exp_grp_list[l.mrn[l.mrn.length - 1]]),
                    grp_attribute = '',
                    exp_attribute = '',
                    data_mrn = 'data-mrn="' + l.mrn[l.mrn.length - 1] + '"',
                    tooltip = '',
                    expicon = '';


                /* if object/person type is more then 1 */
                if (is_group) {
                    interactClass = '';
                    grp_attribute = ' grpcoll';

                    if (opened) {
                        grp_attribute += ' d-none';
                    }
                    expicon = '<div class="expicon"></div>';
                } else {
                    interactClass = ' interact'
                }


                /* print header triggerable element */
                txt += '<div class="element' + grp_attribute + '" ' + data_mrn + '>';
                // mob/obj icon
                txt += _.renderIcon(l.icon, l.mrn ? l.mrn[0] : null, cont_type, l.cntnum, null, interactClass + ' ' + type);
                txt += '<div class="desc">' + _.decoratedDescription(l.condprc, l.mvprc, l.wgt, l.sz ? l.sz : 1, (l.eq ? '<b class="poseq">' + _.equip_positions_by_num[l.eq[0]] + '</b>: ' : '') + l.desc) + '</div>';
                txt += '</div>';

                /* Start Collapsable Obj/Mob Container */
                if (is_group) {

                    if (!opened) {
                        exp_attribute = ' style="display:none"';
                    }

                    txt += '<div class="grpexp"' + exp_attribute + '>';

                    for (let m = 0; m < l.mrn.length; m++) {
                        txt += '<div class="element">'
                        txt += (m == 0 ? '<div class="collicon"></div>' : '') + _.renderIcon(l.icon, l.mrn[m], cont_type, l.cntnum, null, 'interact ' + type);
                        txt += '<div class="desc">' + _.decoratedDescription(l.condprc, l.mvprc, l.wgt, 1, l.desc) + '</div>';
                        txt += '</div>';
                    }

                    if (l.sz && l.sz > l.mrn.length) {
                        txt += '<div class="element">';
                        txt += _.renderIcon(l.icon, null, cont_type, l.cntnum, null, null);
                        txt += '<div class="desc">';
                        txt += _.decoratedDescription(l.condprc, l.mvprc, l.wgt, l.sz - l.mrn.length, l.desc);
                        txt += '</div>';
                        txt += '</div>';
                    }

                    txt += '</div>';
                }
            }

            if (cont.title && (txt.length > 0 || cont.show === true)) {
                res += '<p>' + cont.title;
                if (txt.length == 0)
                    res += '<br>Niente.';
                res += '</p>';
            }

            if (txt.length > 0) {

                //Double Column print option
                //TODO: set list number in constructor
                let columnableClass = '';
                if (cont.list.length > 6) {
                    columnableClass = ' col-dispose';
                }

                res += '<div class="out-list' + columnableClass + ' ' + (style ? ' ' + style : '') + (_.client_options.extradetail_open ? 'compact"' : '"') + ' data-type="' + cont_type + '"' + (cont_num ? '" data-mrn="' + cont_num + '"' : '') + '>';
                res += txt;
                res += '</div>';
            }
        }
        return res;
    }

    capFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    formatText(text, style) {
        let page = '';
        let parags = text.replace(/\r/gm, '').replace(/([^.:?!,])\s*\n/gm, '$1 ').split(/\n/);

        $.each(parags, function (i, p) {
            if (p != '') {
                page += '<div' + (style ? ' class="' + style + '"' : '') + '>' + p + '</div>';
            }
        });

        return page;
    }

    /* *****************************************************************************
     * INTERACTION
     */

    interactionInit() {
        let _ = this;

        $(document).on('mouseup', '.interact', function (event) {
            _.interactEvent(event, this)
        });

        /* Drag & Drop on InputBar (new) */
        $('#tgInputUser').droppable({
            accept: '.interact',
            greedy: true,
            hoverClass: 'valid',
            activate: function () {
                $('#dropcmd').text($('#tgInputUser').val());
            },
            drop: function (event, ui) {

                let zidx = 10000;
                if (_.client_state.max_drop_stack < zidx) {
                    _.at_drag_stop_func = function () {
                        _.toInputBar(ui.draggable);
                    }
                    _.client_state.max_drop_stack = zidx;
                }
            }
        });

        let cont = $('#interactBox');

        $('.input-concat', cont).droppable({
            greedy: true,
            hoverClass: 'valid',
            activate: function () {
                $('#dropcmd').text($('#tgInputUser').val());
            },
            drop: function (event, ui) {
                let zidx = 10000;
                if (_.client_state.max_drop_stack < zidx) {
                    _.at_drag_stop_func = function () {
                        _.toCustomInput(ui.draggable);
                    }
                    _.client_state.max_drop_stack = zidx;
                }
            }
        });

        $('.inv-in', cont).droppable({
            accept: '.obj',
            hoverClass: 'valid',
            greedy: true,
            drop: function (event, ui) {
                let zidx = 10000;
                if (_.client_state.max_drop_stack < zidx) {
                    _.at_drag_stop_func = function () {
                        _.toInventory(ui.draggable);
                    };
                    _.client_state.max_drop_stack = zidx;
                }
                return false;
            }
        });

        $('.inv-out', cont).droppable({
            accept: '.obj',
            hoverClass: 'valid',
            greedy: true,
            drop: function (event, ui) {
                let zidx = 10000;
                if (_.client_state.max_drop_stack < zidx) {
                    _.at_drag_stop_func = function () {
                        _.fromInventory(ui.draggable);
                    };
                    _.client_state.max_drop_stack = zidx;
                }
                return false;
            }
        });

        $('.eqp-in', cont).droppable({
            accept: '.obj',
            hoverClass: 'valid',
            greedy: true,
            drop: function (event, ui) {
                let zidx = 10000;
                if (_.client_state.max_drop_stack < zidx) {
                    _.at_drag_stop_func = function () {
                        _.toEquip(ui.draggable);
                    };
                    _.client_state.max_drop_stack = zidx;
                }
                return false;
            }
        });

        $('.eqp-out', cont).droppable({
            accept: '.obj',
            hoverClass: 'valid',
            greedy: true,
            drop: function (event, ui) {
                let zidx = 10000;
                if (_.client_state.max_drop_stack < zidx) {
                    _.at_drag_stop_func = function () {
                        _.fromEquip(ui.draggable);
                    };
                    _.client_state.max_drop_stack = zidx;
                }
                return false;
            }
        });

        $('.wpn-in', cont).droppable({
            accept: '.obj',
            hoverClass: 'valid',
            greedy: true,
            drop: function (event, ui) {
                let zidx = 10000;
                if (_.client_state.max_drop_stack < zidx) {
                    _.at_drag_stop_func = function () {
                        _.toHand(ui.draggable);
                    };
                    _.client_state.max_drop_stack = zidx;
                }
                return false;
            }
        });

        $('.wpn-out', cont).droppable({
            accept: '.obj',
            hoverClass: 'valid',
            greedy: true,
            drop: function (event, ui) {
                let zidx = 10000;
                if (_.client_state.max_drop_stack < zidx) {
                    _.at_drag_stop_func = function () {
                        _.fromHand(ui.draggable);
                    };
                    _.client_state.max_drop_stack = zidx;
                }
                return false;
            }
        });


        $('.meq-in', cont).droppable({
            accept: '.obj',
            hoverClass: 'valid',
            greedy: true,
            drop: function (event, ui) {
                let zidx = 10000;
                if (_.client_state.max_drop_stack < zidx) {
                    _.at_drag_stop_func = function () {
                        _.toMobEquip(ui.draggable);
                    };
                    _.client_state.max_drop_stack = zidx;
                }
                return false;
            }
        });

        $('.meq-out', cont).droppable({
            accept: '.obj',
            hoverClass: 'valid',
            greedy: true,
            drop: function (event, ui) {
                let zidx = 10000;
                if (_.client_state.max_drop_stack < zidx) {
                    _.at_drag_stop_func = function () {
                        _.fromEquip(ui.draggable);
                    };
                    _.client_state.max_drop_stack = zidx;
                }
                return false;
            }
        });

    }

    interactEvent(event, trigger) {

        let _ = this;

        if (_.inGame && !_.dragging) {

            switch (event.which) {
                case 1:
                    let mrn = $(trigger).attr('data-mrn');
                    let cmd = $(trigger).attr('data-cmd');

                    if (cmd == null) {
                        cmd = $(trigger).is('.where') ? '@agg' : "guarda";
                    }
                    if (!mrn || mrn == 0) {
                        _.sendToServer(cmd);
                    } else {
                        let cnttype = $(trigger).attr('data-cnttype');
                        let cntmrn = $(trigger).attr('data-cntmrn');

                        if (cnttype == 'inv') {
                            _.sendToServer(cmd + ' &' + mrn);
                        } else if (cntmrn && !isNaN(parseInt(cntmrn))) {
                            _.sendToServer(cmd + ' &' + mrn + ' &' + cntmrn);
                        } else {
                            _.sendToServer(cmd + ' &' + mrn);
                        }
                    }
                    break;
            }
        }

        return true;
    }

    toMobEquip(obj) {
        let _ = this;
        let mrn = $(obj).attr('mrn');
        let cnttype = $(obj).attr('data-cnttype');
        let cmd;

        switch (cnttype) {
            case 'pers':
                let cntmrn = $(obj).attr('data-cntmrn');
                cmd = 'barda &' + cntmrn + '&' + mrn;
                break;

            default:
                return;
        }

        _.processCommands(cmd);
    }

    toEquip(obj) {
        let _ = this;
        let mrn = $(obj).attr('data-mrn');
        let cnttype = $(obj).attr('data-cnttype');
        let cmd;

        switch (cnttype) {
            case 'room':
                cmd = 'prendi &' + mrn + '; indossa &' + mrn;
                break;

            case 'inv':
                cmd = 'indossa &' + mrn;
                break;

            case 'obj':
                let cntmrn = $(obj).attr('data-cntmrn');
                cmd = 'prendi &' + mrn + ' &' + cntmrn + '; indossa &' + mrn;
                break;

            case 'pers':
                cntmrn = $(obj).attr('data-cntmrn');
                cmd = 'barda &' + cntmrn + ' &' + mrn;
                break;

            default:
                return;
        }
        _.processCommands(cmd);
    }

    fromEquip(obj) {
        let _ = this;
        let mrn = $(obj).attr('data-mrn');
        let cnttype = $(obj).attr('data-cnttype');
        let cmd;

        switch (cnttype) {
            case 'equip':
                cmd = 'rimuovi &' + mrn;
                break;

            case 'pers':
                let cntmrn = $(obj).attr('data-cntmrn');
                cmd = 'rimuovi &' + mrn + ' &' + cntmrn;
                break;

            default:
                return;
        }
        _.processCommands(cmd);

        switch (cnttype) {
            case 'equip':
                cmd = 'rimuovi &' + mrn;
                break;

            case 'pers':
                let cntmrn = $(obj).attr('cntmrn');
                cmd = 'rimuovi &' + mrn + ' &' + cntmrn;
                break;

            default:
                return;
        }

        _.processCommands(cmd);

    }

    toCustomInput(obj) {
        /* New: Concatenate cmd + droppped element */
        let _ = this;
        let mrn = $(obj).attr('data-mrn');
        let cmd;

        $.magnificPopup.open({
            showCloseBtn: true,
            preloader: false,
            closeOnBgClick: true,
            items: {
                src: '#interactBoxEvent',
                type: 'inline'
            },
            mainClass: 'tg-mp modal-custom',
            callbacks: {
                beforeOpen: function () {
                    let icon = $(obj).clone();
                    $('.interact-placeicon').html(icon);
                    $('.interact-inputbar.pre').text('');
                    $('.interact-inputbar.post').text('');

                },
                open: function () {;
                    var node = document.getElementsByClassName('pre');
                    $(node).mousedown();

                    $('#interactSendButton').one('click', function () {

                        let pre = $('.interact-inputbar.pre').text();
                        let post = $('.interact-inputbar.post').text();
                        cmd = pre + ' &' + mrn + ' ' + post;
                        _.processCommands(cmd);
                        $.magnificPopup.close();
                    });
                }
            }
        });
    }

    toInputBar(obj) {
        /* New: Concatenate cmd + droppped element */
        let _ = this;
        let mrn = $(obj).attr('data-mrn');
        let input = $('#tgInputUser');
        let preCmd = $(input).val();
        let cmd;

        _.processCommands(preCmd + ' &' + mrn);
        $(input).focus();
    }

    toInventory(obj) {
        let _ = this;
        let mrn = $(obj).attr('data-mrn');
        let cnttype = $(obj).attr('data-cnttype');
        let cmd;
        switch (cnttype) {
            case 'room':
                cmd = 'prend &' + mrn;
                break;

            case 'equip':

                cmd = 'rimuovi &' + mrn;
                break;

            case 'obj':

                cntmrn = $(obj).attr('data-cntmrn');
                cmd = 'prendi &' + mrn + '&' + cntmrn;
                break;

            case 'pers':

                cntmrn = $(obj).attr('data-cntmrn');
                cmd = 'prendi &' + mrn + '&' + cntmrn;
                break;

            default:
                return;
        }
        _.processCommands(cmd);
    }

    fromInventory(obj) {
        let _ = this,
            mrn = $(obj).attr('data-mrn'),
            cnttype = $(obj).attr('data-cnttype'),
            cmd;

        switch (cnttype) {
            case 'inv':
                cmd = 'posa &' + mrn;
                break;

            case 'equip':
                cmd = 'rimuovi &' + mrn + '; posa &' + mrn;
                break;

            case 'obj':
                let cntmrn = $(obj).attr('data-cntmrn');
                cmd = 'scarica &' + mrn + ' &' + cntmrn;
                break;

            case 'pers':
                cntmrn = $(obj).attr('cntmrn');
                cmd = 'scarica &' + mrn + ' &' + cntmrn;

            default:
                return;
        }

        _.processCommands(cmd);
    }

    toHand(obj) {
        let _ = this,
            mrn = $(obj).attr('data-mrn'),
            cnttype = $(obj).attr('data-cnttype'),
            cmd;

        switch (cnttype) {
            case 'room':
                cmd = 'prendi &' + mrn + '; impugna &' + mrn;
                break;

            case 'inv':
                cmd = 'impugna &' + mrn;
                break;

            case 'equip':
                cmd = 'sfodera &' + mrn;
                break;

            case 'obj':
                let cntmrn = $(obj).attr('data-cntmrn');
                cmd = 'prendi &' + mrn + ' &' + cntmrn + '; impugna &' + mrn;
                break;

            default:
                return;
        }
        _.processCommands(cmd);
    }

    fromHand(obj) {
        let mrn = $(obj).attr('data-mrn');
        let cnttype = $(obj).attr('data-cnttype');
        let cmd;

        switch (cnttype) {
            case 'equip':
                cmd = 'riponi &' + mrn;
                break;

            default:
                return;
        }
        _.processCommands(cmd);
    }


    /* *****************************************************************************
     * STATUS BAR
     */

    limitPrc(prc) {
        if (prc < 0)
            prc = 0;
        else if (prc > 100)
            prc = 100;

        return prc;
    }

    prcLowTxt(val, values) {
        for (let i = 0; i < values.length; ++i) {
            if (val <= values[i].val) {
                return values[i].txt;
            }
        }
        return null;
    }

    prcBar(prc, color, txt) {
        let _ = this;
        return '<div class="meter2' + (txt ? ' withtxtbox' : '') + '"><div class="barcont"><span class="' + color + '" style="width:' + _.limitPrc(prc) + '%"></span></div>' + (txt ? '<div class="metertxt">' + txt + '</div>' : '') + '</div>';
    }

    prcHighTxt(val, values) {
        for (let i = 0; i < values.length; ++i) {
            if (val >= values[i].val)
                return values[i].txt;
        }
        return null;
    }


    /* *****************************************************************************
     * COMMAND HISTORY
     */

    updateInput() {
        let _ = this;
        let text = _.cmd_history[_.cmd_history_pos] ? _.cmd_history[_.cmd_history_pos] : '';
        $('#tgInputUser').val(text).focus();
    }

    historyUp() {
        let _ = this;
        if (_.cmd_history_pos > 0) {
            _.cmd_history_pos--;
            _.updateInput();
        }
    }

    historyDown() {
        let _ = this;
        if (_.cmd_history_pos < _.cmd_history.length) {
            _.cmd_history_pos++;
            _.updateInput();
        }
    }

    historyPush(text) {
        let _ = this;
        if (text.length > 0) {
            if (_.cmd_history.length >= _.max_history_length) {
                _.cmd_history.shift();
            }

            if (_.cmd_history.length == 0 || _.cmd_history[_.cmd_history.length - 1] != text) {
                _.cmd_history.push(text);
            }

            _.cmd_history_pos = _.cmd_history.length;
        }

        $('#tgInputUser').val('');
        return text;
    }

    /* ***************************************************************************** */

    sendToServer(text) {
        let _ = this;
        if (!_.isConnected) {
            return;
        }

        _.socket.emit('data', text);
    }

    getLoginReplyMessage(what) {
        let login_reply_message = {
            'serverdown': 'Il server di gioco è momentaneamente spento. Riprova più tardi.',
            'errorproto': 'Errore di comunicazione con il server.',
            'errornonew': 'In questo momento non è permessa la creazione di nuovi personaggi.',
            'invalidname': 'Nome non valido.',
            'invalidpass': 'Password non valida.',
            'loginerror': 'Personaggio inesistente o password errata.',
            'staffonly': 'In questo momento solo lo staff può collegarsi, riprova più tardi.',
            'plrreaderror': 'Errore di lettura del personaggio.',
            'plrdisabled': 'Il personaggio è stato disattivato.',
            'bannedip': 'Connessione da un indirizzo bloccato.',
            'maxclients': 'Il server ha raggiunto il massimo numero di connessioni, riprova più tardi.',
            'errorcoderequired': 'Per creare un altro personaggio ti serve un codice di attivazione.',
            'errorinvalidcode': 'Il codice di invito inserito non è valido. Verifica di averlo digitato correttamente.',
            'dupname': 'Esiste già un personaggio con questo nome. Per favore scegli un nome diverso.',
            'invalidemail': 'L\'indirizzo di email inserito non è valido.'
        };

        return login_reply_message[what];
    }

    //check status of interface Data after first login.
    interfaceUpdateStatus() {
        let _ = this;
        if (_.client_update.data.info && _.client_update.data.stato) {
            return true;
        }
    }

    loadInterface() {

        let _ = this;

        $('.tg-main')
            .addClass('d-flex')
            .attr('data-viewport', _.viewport);

        _.configInit();
        /* Interface Modules List */
        //_.inputInit();
        _.genericEvents();
        _.keyboardMapInit();
        _.mainNavBarInit();
        _.tooltipInit();
        _.outputInit();
        _.focusInput();
        _.mapInit();
        _.doorsInit();
        _.interactionInit();
        _.extraBoardInit();
        _.buttonsEventInit();
        _.combatPanelWidgetInit();
        _.audioInit();

        //Interface is up
        _.client_open = true;
    }

    /* -------------------------------------------------
     * SETUP INTERFACE BASED COOKIES AND OTHERS STUFF
     * -------------------------------------------------*/

    configInit() {
        let _ = this;
        /* Extra Detail Display */
        if (_.client_options.extradetail_open) {
            $('.tg-output-extra').addClass('d-flex');
        } else {
            $('.tg-output-extra').removeClass('d-flex');
        }

        /* Dashboard Expand/collapse status */
        let d_status = _.client_options.dashboard; //just alias

        if (d_status == 1) {
            $('.tg-dashboard').addClass('midopen');
        } else if (d_status == 2) {
            $('.tg-characterpanel').hide();
        }

        /* audio */
        $('#tgNavBartriggerAudio').on('click')
    }

    /* -------------------------------------------------
     * MAIN NAVBAR
     * -------------------------------------------------*/

    mainNavBarInit() {
        let _ = this;
        /* Search Widget form */
        _.initSearchWidget();
    }

    initSearchWidget() {

        let _ = this;
        let options = {
            url: "ajax/cmd_list_guide.json",
            getValue: "name",
            list: {
                match: {
                    enabled: true,
                    onClickEvent: function (element) {
                        alert("Non è stata inserita alcuna guida per " + element.name);
                    }
                }
            },
            theme: "square"
        };

        $('#tgSearchHelp').on('submit', function (e) {
            e.preventDefault();
            _.openNoFeaturePopup();
        });
    }

    /* -------------------------------------------------
     * TOOLTIP
     * -------------------------------------------------*/

    tooltipInit() {
        $('body').tooltip({
            selector: '[rel="tooltip"]',
            html: true,
            trigger: 'hover',
            container: 'body',
            delay: {
                'show': 500,
                'hide': 0
            }
        });
    }

    /* -------------------------------------------------
     * INPUT
     * -------------------------------------------------*/

    inputPassword() {
        $('#tgInputUser').attr('type', 'password').focus();
    }

    inputText() {
        $('#tgInputUser').attr('type', 'text').focus();
    }

    inputInit() {
        let _ = this;
    }
    
    sendInput() {
        let inputVal = $('#tgInputUser').val();
        this.processCommands(inputVal, true);
    }

    focusInput() {
        $('#tgInputUser').focus();
    }


    /* -------------------------------------------------
     * OUTPUT
     * -------------------------------------------------*/

    outputInit() {

        let _ = this;
        let outputID = '.tg-output-main';

        _.addScrollBar(outputID + ' .scrollable', 'output');

        if (!_.client_options.extradetail_open) {
            $(outputID).css('width', '100%');
        } else {
            $(outputID).css('width', _.client_options.output_width);
        }

        if (_.client_options.extradetail_open) {
            _.addResizableOutput();
        }
        // init Extraoutput window
        _.extraOutputInit();
        // Highlightining mob/obj based on user click
        //TODO: this.highlightsOutputMRN();
        //add Event Handler for Expndable list
        _.makeExpandable();
    }

    addResizableOutput() {

        let _ = this;

        $('.tg-output-main.resizable').resizable({
            handles: "e",
            containment: '.tg-output',
            create: function (event, ui) {
                let w;
                if (!_.client_options.output_width) {
                    w = $(this).parent().width() / 2;
                }
                $('.tg-output-extra').css({
                    left: w + 1,
                    //width: ($(this).parent().width() - w),
                });
            },
            resize: function (event, ui) {
                event.stopImmediatePropagation();
                $('.tg-output-extra').css({
                    left: parseInt(ui.size.width + 1) + 'px',
                });
            },
            stop: function (event, ui) {
                let width = ui.size.width;
                /*      let maxWidth = Number($(el).css('maxWidth').replace(/[^-\d\.]/g, ''));
                    let contWidth = Math.round(($(el).width() / $(el).parent().width()) * 100)
                    if (contWidth >= maxWidth) {
                        width = maxWidth;
                        $(el).width(maxWidth + '%');
                    }*/

                //update scrollbar
                _.scrollbar.extraoutput.update();
                _.client_options.output_width = width + 'px';
                _.SaveStorage('options', _.client_options);
            }

            /*     onDragEnd: function (e, el) {

                }*/
        });
    }

    showOutput(text) {
        let _ = this,

            app = $(text);

        _.addDragAndDrop('.iconimg.interact', app);

        $('#output').append(app);

        if (_.client_options.output_trimlines < 10000) {
            $('#output').contents().slice(0, -_.client_options.output_trimlines).remove();
        }

        _.scrollPanelTo('#output', '.scrollable', false, null);

    }

    clearOutput() {
        $('#output').empty();
    }

    makeExpandable() {
        let _ = this;
        $('.tg-output').on('click', '.grpcoll', function () {
            let colgrp = $(this);
            let expgrp = colgrp.next('.grpexp');

            expgrp.slideToggle();

            _.addExpandedGrp(colgrp.attr('mrn'));
        });
        /*    $('.tg-output').on('click', '.grpcoll', function() {
                 let expgrp = $(this);
                 let colgrp = expgrp.prev('.grpcoll');
                 $(this).toggleClass('expanded');
                 expgrp.slideToggle();
                 delete _.exp_grp_list[colgrp.attr('mrn')];
            });*/
    }

    addExpandedGrp(mrn) {
        let _ = this;
        let minval = _.exp_grp_list[mrn] = $.now();
        let minkey;

        let keys = Object.keys(_.exp_grp_list);
        if (keys.length > _.max_exp_grp) {
            for (let k in keys) {
                let val = _.exp_grp_list[k];
                if (val < minval) {
                    minkey = k;
                    minval = val;
                }
            }

            delete _.exp_grp_list[minkey];
        }
    }

    highlightsOutputMRN() {
        let _ = this;
        $('#output, #extraoutput').on('click', '.element', function () {
            let mrn = $(this).attr('data-mrn');
            if (!_.client_options.mrn_highlights.length) {
                $('.element[data-mrn="' + mrn + '"]').addClass('mrn-hlight');
                _.client_options.mrn_highlights.push(mrn)
            } else {
                if ($.inArray(mrn, _.client_options.mrn_highlights) != -1) {
                    _.client_options.mrn_highlights.splice($.inArray(mrn, _.client_options.mrn_highlights), 1);
                    $('.element[data-mrn="' + mrn + '"]').removeClass('mrn-hlight');

                } else {
                    $('.element[data-mrn="' + mrn + '"]').addClass('mrn-hlight');
                    _.client_options.mrn_highlights.push(mrn)
                }
            }
        });
    }

    extraOutputInit() {
        let _ = this;
        $('.tg-output-extra').css({
            left: _.client_options.output_width.toString()
        });

        this.addScrollBar('.tg-output-extra', 'extraoutput');

        /* Image Event */
        $('#detailimage')
            .on('error', function () {
                $(this).closest('.extra-detailimg').slideUp(0);
            })
            .on('load', function () {
                $(this).closest('.extra-detailimg').slideDown(0);
            });
    }
    
    toggleNotifyOutput() {
        clearTimeout(window.notifyToggle);
        $('#updateRoomNotify').addClass('up');
        window.notifyToggle = setTimeout(function () {
            $('#updateRoomNotify').removeClass('up')
        }, 1500);
    }

    
    /* *****************************************************************************
     *  IMAGES IN OUTPUT 
     */

    showImage(cont, image) {
        let _ = this;
        let imgsrc = _.media_server_addr + image;
        let currimgsrc = cont.attr('src');

        if (currimgsrc != imgsrc) {
            cont.attr('src', imgsrc);
        }
    }

    cleanImageContainer(cont) {
        $(cont).slideUp('fast').find('img').attr('src', '');
    }

    /* *****************************************************************************
     * OUTPUT BUTTONS
     */

    pauseOn() {
        console.log('pauseON');
        // if(autoscroll_enabled) {
        //     autoscroll_enabled = false;
        //     $('#pausebutton').button("option", "icons", { primary: 'ui-icon-custom-play' });
    }

    pauseOff() {
        console.log('pauseOFF');
        // if(!autoscroll_enabled) {
        //     autoscroll_enabled = true;
        //     $('#pausebutton').button("option", "icons", { primary: 'ui-icon-custom-pause' });
        // }
    }

    /* -------------------------------------------------
     * KEYBOARD MAP
     * -------------------------------------------------*/

    keyboardMapInit() {

        let _ = this;

        if (!_.isConnected) {
            return true;
        }

        $('#tgMap').mouseenter(function () {
            _.cursor_on_map = true;
        });

        $('#tgMap').mouseleave(function () {
            _.cursor_on_map = false;
        });


        $(document).on('keydown', function (event) {

            // if is not connected?
            if (!_.isConnected, _.in_editor) {
                return true;
            };

            if (event.metaKey || event.ctrlKey) {
                return true;
            }

            /* Stop event Listener if we are inside Modal  */
            if (_.in_editor) {
                return true;
            }
            if (event.altKey || _.cursor_on_map) {

                switch (event.which) {
                    case 33:
                        _.goDir(_.dir_up);
                        return false;
                    case 34:
                        _.goDir(_.dir_down);
                        return false;

                    case 37:
                        _.goDir(_.dir_west);
                        return false;

                    case 38:
                        _.goDir(_.dir_north);
                        return false;

                    case 39:
                        _.goDir(_.dir_east);
                        return false;

                    case 40:
                        _.goDir(_.dir_south);
                        return false;
                }
            }
            if ($(event.target).is('#tgInputUser') === true) {
                /* ENTER key, handle here */
                if (event.which == 13) {
                    _.sendInput();
                    return false;
                }

                /* "!" alias  to send last command */
                if (event.which == 49 && event.shiftKey === true && $(event.target).val().length == 0) {
                    let l = _.cmd_history.length;

                    if (l > 0)
                        _.processCommands(_.cmd_history[l - 1]);
                    return false;
                }

                /* Enter Key */
                switch (event.which) {
                    case 13:
                        _.sendInput();
                        return true;
                        //Arrow UP
                    case 38:
                        _.historyUp();
                        event.preventDefault();
                        return true;
                        //Arrow DOWN
                    case 40:
                        _.historyDown();
                        event.preventDefault();
                        return true;
                }
            }
            return true;
        });
    }

    /* -------------------------------------------------
     *  Buttons Events
     * -------------------------------------------------*/

    buttonsEventInit() {
        let _ = this;

        /* Buttons with CMD event */
        let cmdButtons = [{
                id: '#userDisconnect',
                cmd: function () {
                    _.disconnectFromServer()
                }
            },
            {
                id: '#combatPieta',
                cmd: 'pieta'
            },
            {
                id: '#combatTregua',
                cmd: 'tregua'
            }
        ]

        $.each(cmdButtons, function (idx, bdata) {
            let button = $(bdata.id);

            if (bdata.cmd) {
                button.on('click',
                    typeof bdata.cmd == 'function' ? bdata.cmd : function () {
                        if (_.inGame) {
                            _.processCommands(bdata.cmd)
                        }
                        if (bdata.text) {
                            //TODO: open modal by reference
                        }
                    });
            }
        });

        /* Toggle Extra Output Window */
        $('#triggerToggleExtraOutput').on('click', function () {
            $('.tg-output-extra').toggleClass('d-flex')
            /* Refresh Extra when is open */
            if ($('.tg-output-extra').is(':visible')) {
                _.processCommands('@agg');
            }
            _.scrollPanelTo('#output', '.scrollable', true, null);
            _.client_options.extradetail_open = _.client_options.extradetail_open ? false : true;
            _.SaveStorage('options', _.client_options);
        });

        /* Toggle character panel  Display */
        $('#triggerToggleCharacterPanel').on('click', function () {
            if (_.client_options.dashboard == 0) {
                $('.tg-dashboard').addClass('midopen');
                _.client_options.dashboard = 1;
                _.SaveStorage('options', _.client_options);
                return;
            };
            if (_.client_options.dashboard == 1 || _.client_options.dashboard == 2) {
                _.client_options.dashboard = _.client_options.dashboard == 1 ? 2 : 0;


                $('.tg-characterpanel').slideToggle(300, function () {
                    _.scrollPanelTo('#output', '.scrollable', true, null);
                    $('.tg-dashboard').removeClass('midopen');
                });
                _.SaveStorage('options', _.client_options);
            };
        });

        //Expand tg-area
        $('#triggerExpandTgArea').on('click', function () {
            $('.tg-area').toggleClass('expanded', function () {});
            setTimeout(() => {
                _.scrollPanelTo('#output', '.scrollable', true, null);
            }, 200);
        })

        // Zen Mode
        $('#triggerZenModality').on('click', function () {
            //TODO: change to a body class + css
            $('.tg-rightside, .tg-navbar, .tg-characterpanel').toggleClass('d-none');
            $('body').toggleClass('zen');
        });
    }

    /* -------------------------------------------------
     *  Generic Events
     * -------------------------------------------------*/


    genericEvents() {
        let _ = this;

        $(window).on("contextmenu", function (e) {
            e.preventDefault();
        });

        // on window resize run function
        $(window).resize(function () {
            _.fluidDialog();
        });

        // catch dialog if opened within a viewport smaller than the dialog width
        $(document).on("dialogopen", ".ui-dialog", function (event, ui) {
            _.fluidDialog();
        })

        $('.no-feature').on('click', function (e) {
            e.preventDefault();
            _.openNoFeaturePopup();
        });

    }

    /* -------------------------------------------------
     *  EXTRA BOARD
     * -------------------------------------------------*/
    extraBoardInit() {
        let _ = this;

        _.addScrollBar('#tg-pills-shortcut', 'extraboard');

        //Shortcut TODO:
        for (let x = 0; x < 26; x++) {
            let shortcut = $('<div class="shortcut-btn" title="nome shortcut ' + x + '" data-cmd="grida oryon ti amo"><span>' + x + '</span></div>');
            shortcut.appendTo('#tg-pills-shortcut');

            $('.shortcut-btn').eq(x).popover({
                content: '<a href="#">modifica</a>',
                html: true,
                trigger: 'manual'
            });
        }


        $('.tg-extraboard [title]')
            .on('mouseover', function () {
                let val = $(this).attr('title');
                let cmdVal = $(this).data('cmd');
                cmdVal = cmdVal ? ': ' + cmdVal : '';

                $('#extraboardCaption').text(val + cmdVal);
            })
            .on('mouseout', function () {
                $('#extraboardCaption').text('');
            });

        /* shortcut contextmenu */
        let popoverHandler;
        $('.shortcut-btn').on('shown.bs.popover', function (e) {
            let pop = this;
            popoverHandler = setTimeout(function () {
                $(pop).popover('hide');
            }, 2500);
        });

        $(".shortcut-btn")
            .on("contextmenu", function (e) {
                $('.shortcut-btn').popover('hide');
                $(this).popover('show');

                return false;
            })
            .on('click', function () {
                _.processCommands($(this).data('cmd'));
            });


        $('body').on('click', function (e) {
            $('.shortcut-btn').each(function () {
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
        });
    }


    /* -------------------------------------------------
    * COMBAT PANEL
    * -------------------------------------------------*/
    
    combatPanelWidgetInit() {
        let combatbox = $('.tg-combatpanel').clone();
        $('.incnt', '#combatPanelWidget').append(combatbox);
    }
    

    /* -------------------------------------------------
     *  POPUP
     * -------------------------------------------------*/

    openNoFeaturePopup() {
        /* Popup - Funzione non ancora implementata */
        let src = '<div class="tg-modal">Funzionalità non ancora implementata</div>';
        $.magnificPopup.open({
            showCloseBtn: true,
            closeOnBgClick: true,
            type: 'inline',
            items: {
                src: src,
                type: 'inline'
            },
            mainClass: 'tg-mp modal-nofeature',
        });
    }

    openCookieLawPopup() {
        let src = './ajax/cookielawAlert.html';
        $.magnificPopup.open({
            showCloseBtn: false,
            closeOnBgClick: false,
            type: 'ajax',
            preloader: false,
            items: {
                src: src,
                type: 'ajax'
            },
            mainClass: 'modal-cookielaw',
        });
    }

    openNotiziePopup() {
        /**
         * I use Jquery.ajax to preload the file and read via xhr the last-modified date value
         *  to klnow if there is a new news or not since the last display of the client.
         * */
        let _ = this;

        let src = 'ajax/news/last.html';

        $.ajax({
            url: src,
            success: function (result, status, xhr) {

                let fileTimeStamp = Date.parse(xhr.getResponseHeader("Last-Modified"));
                if ((fileTimeStamp != _.client_options.news_date_last || _.client_options.news_wantsee) && !_.client_state.news_showed) {

                    _.client_options.news_wantsee = true;

                    $.magnificPopup.open({
                        showCloseBtn: false,
                        closeOnBgClick: false,
                        type: 'inline',
                        preloader: false,
                        items: {
                            src: result,
                            type: 'inline'
                        },
                        mainClass: 'modal-notizie',
                        callbacks: {
                            open: function () {
                                _.addScrollBar('.modal-notizie .scrollable', 'notizie');
                                _.client_state.news_showed = true;
                                _.client_options.news_date_last = fileTimeStamp;

                                $('#initNewsButton').one('click', function () {
                                    if ($('input[type=checkbox]').prop('checked')) {
                                        _.client_options.news_wantsee = false;
                                    }
                                    _.sendInput();
                                    _.closePopup();
                                });

                            },
                            close: function () {
                                _.sendInput();
                                _.SaveStorage('options', _.client_options);
                            }
                        }
                    });
                } else {
                    _.sendInput()
                }
            },

            fail: function () {
                _.sendInput();
                return;
            }
        })
    }

    openEditorPopup() {
        let _ = this;
        $.magnificPopup.open({
            items: {
                src: '#editorDialog',
                type: 'inline'
            },
            showCloseBtn: true,
            closeOnBgClick: false,
            type: 'inline',
            preloader: false,
            mainClass: 'tg-mp modal-editor',
            callbacks: {
                open: function () {
                    $('.mfp-close').one('click', function (e) {
                        e.preventDefault();
                        _.abortEdit();
                        _.closePopup();
                    });
                    _.addDraggable('#editorDialog', '.modal-editor');
                },
                close: function (e) {
                    _.closeEditor();
                }
            }
        });
    }

    loadWidgetLogin() {
        let _ = this;
        $.ajax('ajax/login_widget.html').done(function (responseJSON) {
            $(responseJSON).appendTo('body');
            _.initWidgetLoginPanel();
            _.showWidgetLogin();
            _.ajax_loaded.push('loginwidget');
        });
    }

    showWidgetLogin() {
        let _ = this;
        if (!_.connectionInfo.error) {
            _.widgetLoginNetworkActivityMessage('Torna presto!')
        } else {
            _.widgetLoginNetworkActivityMessage('Errore di comunicazione con il Server');
        }
        //close any opened popup
        $.magnificPopup.close();
        $.magnificPopup.open({
            items: {
                src: '#loginWidget',
                inline: 'inline'
            },
            showCloseBtn: false,
            closeOnBgClick: false,
            mainClass: 'tg-mp modal-login',
        });

    }

    addScrollBar(container, key, sx) {
        let scrollX = true;
        if ($(container).length) {
            this.scrollbar[key] = new PerfectScrollbar(container, {
                wheelPropagation: false,
                suppressScrollX: scrollX
            });
        }
    }

    addDraggable(selector, context, handle) {

        let _ = this;
        $(selector, context).draggable({
            appendTo: 'body',
            zIndex: 1000,
            handle: handle != null ? handle : '.drag-handle',
            containment: 'body'
        });
    }


    addDragAndDrop(subselector, objs) {
        let _ = this;
        $('.iconimg.interact', objs).draggable({
            classes: {
                "ui-draggable-dragging": "tg-dragging"
            },
            appendTo: "body",
            helper: 'clone',
            revert: "invalid",
            delay: 200,
            revertDuration: 200,
            scroll: false,
            zIndex: 1000,
            start: function (event, ui) {
                _.dragging = true;
                let what = $(this);
                if (what.is('.obj')) {
                    if (_.updateInteractBox(_.obj_interaction_config[what.attr('data-cnttype')])) {
                        $('#interactBox').show().position({
                            my: 'right center',
                            at: 'left center',
                            of: what
                        });
                    }
                }
            },
            stop: function (event, ui) {
                _.dragging = false;

                $('#interactBox').hide();

                if (_.at_drag_stop_func) {
                    _.at_drag_stop_func();
                    _.client_state.max_drop_stack = 0;
                    _.at_drag_stop_func = null;
                }
            }
        }).droppable({
            accept: '.obj',
            greedy: true,
            drop: function (event, ui) {
                _.iconToIcon(ui.draggable, $(this));
            }
        });
    }

    updateInteractBox(config) {
        let _ = this;
        if (config && config.length) {
            let box = $('#interactBox');

            $('.interact-elem', box).hide();

            $.each(config, function (idx, elemClass) {
                $(elemClass, box).show();
            });

            return true;
        }
        return false;
    }

    iconToDest(obj1, type2, mrn2, cnttype2, cntmrn2) {
        let mrn1 = $(obj1).attr('data-mrn');
        let cnttype1 = $(obj1).attr('data-cnttype');

        switch (cnttype1) {
            case 'inv':
                if (type2 == 'obj') {
                    cmd = 'metti &' + mrn1 + '&' + mrn2;
                    //TODO: if(whichTabIsOpen('#detailsdialog') == 2)
                    //cmd += '; @agg &'+mrn2;
                } else if (type2 == 'pers') {
                    cmd = 'dai &' + mrn1 + '&' + mrn2;
                    //TODO: if(whichTabIsOpen('#detailsdialog') == 1)
                    //cmd += '; @agg &'+mrn2;
                } else
                    return;
                break;

            case 'room':
                switch (cnttype2) {
                    case 'room':
                        cmd = 'carica &' + mrn1 + ' &' + mrn2;
                        //TODO: if(whichTabIsOpen('#detailsdialog') == 2)
                        // cmd += '; @agg &'+mrn2;
                        // if(whichTabIsOpen('#detailsdialog') == 0)
                        //     cmd += '; @agg';
                        // }
                        break;

                    default:
                        return;
                }
                break;
            default:
                return;
        }
        _.processCommands(cmd);
    }

    iconToIcon(obj1, obj2) {
        let _ = this;
        let mrn2 = $(obj2).attr('data-mrn');
        let cnttype2 = $(obj2).attr('data-cnntype');
        let cntmrn2 = $(obj2).attr('data-cntmrn');
        let type2;

        if ($(obj2).is('.obj')) {
            type2 = 'obj';
        } else if ($(obj2).is('.pers')) {
            type2 = 'pers';
        }

        _.iconToDest(obj1, type2, mrn2, cnttype2, cntmrn2);
    }



    /* *****************************************************************************
     * UTILITY
     */

    openDialog(dialogid) {
        let d = $(dialogid);

        if (d.is(':data(uiDialog)'))
            return d.dialog(d.dialog('isOpen') ? 'moveToTop' : 'open');
        return null;
    }

    isDialogOpen(dialogid) {
        let d = $(dialogid);
        return d.is(':data(uiDialog)') && d.dialog('isOpen');
    }

    isDialog(dialogid) {
        let d = $(dialogid);

        return d.is(':data(uiDialog)');
    }

    fluidDialog() {
        var $visible = $(".ui-dialog:visible");
        // each open dialog
        $visible.each(function () {
            var $this = $(this);
            var dialog = $this.find(".ui-dialog-content").data("ui-dialog");
            // if fluid option == true
            if (dialog.options.fluid) {
                var wWidth = $(window).width();
                // check window width against dialog width
                if (wWidth < (parseInt(dialog.options.maxWidth) + 50))  {
                    // keep dialog from filling entire screen
                    $this.css("max-width", "90%");
                } else {
                    // fix maxWidth bug
                    $this.css("max-width", dialog.options.maxWidth + "px");
                }
                //reposition dialog
                dialog.option("position", dialog.options.position);
            }
        });

    }

    whichTabIsOpen(dialogid) {
        if (isDialogOpen(dialogid))
            return $(dialogid).tabs('option', 'active');

        return null;
    }

    disableResizable(widget) {
        $(widget).resizable('disable');
    }

    setViewportSetup(val) {
        $('.tg-area').attr('data-viewport', val);
        this.viewport = val;
    }

    isModalOpen() {
        return $.magnificPopup.instance.isOpen;
    }

    closePopup() {
        $.magnificPopup.close();
    }

    scrollPanelTo(content, scrollbox, animate, where) {

        let outputHeight;
        scrollbox = $(content).parent(scrollbox);

        if (where !== null) {
            outputHeight = where;
        } else {
            outputHeight = $(content).height();
        }
        if (animate) {
            $(scrollbox).animate({
                scrollTop: outputHeight
            }, 500, 'linear');
        } else {
            $(scrollbox).scrollTop(outputHeight);
        }
    }
}