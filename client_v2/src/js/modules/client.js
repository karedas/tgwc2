// ========== NPM Modules
import io from 'socket.io-client';
import Modernizr from "modernizr";
import Cookies from 'js-cookie';
import PerfectScrollbar from 'perfect-scrollbar';
import 'bootstrap';
import 'magnific-popup';
import 'draggabilly/dist/draggabilly.pkgd.js';
import 'easy-autocomplete';
import 'jquery-resizable-dom';

//============ Assets file list.
import AssetsList from 'assets_list.json';
//============ Custom
//import FacebookSDK from 'facebookSdk';
import Preloader from 'preloader';
import Map from 'mapDrawer';

export default class TgGui {

    constructor(options) {

        this.ws_server_addr = '51.38.185.84:3335';
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
            live: false
        };
        this.viewport = null;

        /* UI Game Options */
        this.client_options = {
            show_news: true,
            musicVolume: 70,
            soundVolume: 100,
            skysize: 215,
            alpha_approved: false,
            shortcuts: [],
            login: {},
            dashboard: "0",
            extradetail: true,
            mrn_highlights: [],
            extradetail_width: '50%',
            output_trimlines: 500,
        };

        /* Status */
        this.in_editor = false;
        this.cursor_on_map = false;

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
            interfaceData: {
                info: false,
                stato: false,
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
        this.RENDER = null;

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


        /* Debug */
        this.debug = true;

        $.extend(this, options);
    }

    init() {
        let _ = this;

        // Get Cookie "Italy cookie law"
        let cookie_consent = _.LoadStorage('cookie_consent');
        // Check Cookie Law Approval Status, then go to start or wait user action.
        if (!cookie_consent) {
            _.showCookieLawDisclaimer();
        } else {
            _.removeCookieLawDisclaimer();
            _.startClient();
        }
    }

    setViewportSetup(val) {
        $('.tg-area').attr('data-viewport', val);
        this.viewport = val;
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
                'reconnection': true,
                'force new connection': true,
                'resource': _.socket_io_resource,
                'transports': ['polling']
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
                if (_.client_state.live) {
                    if (!_.connectionInfo.error) {
                        _.widgetLoginNetworkActivityMessage('Torna presto!')
                    } else {
                        _.widgetLoginNetworkActivityMessage('Errore di comunicazione con il Server');
                    }
                    _.initWidgetLoginPanel();
                    _.openPopup('login', 'Effettua l\'accesso', '.tg-loginform-widget');
                }

                if (!_.connectionInfo.error) {
                    _.networkActivityMessage("Disconnesso dal server");
                }
            });

            _.socket.on('reconnect_attempt', function () {
                console.log('is a reconnect');
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

                        clientPreloader.init().then(function () {
                            _.closePopup();
                            //reset login message
                            _.loginNetworkActivityMessage("");
                            _.hideLoginPanel();
                            _.loadInterface();
                            _.completeHandshake();
                            _.handleServerData(data.slice(end + 2));
                        }, () => {
                            console.log("Assets error") // Error!
                        });

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
                        if (!connectionError)
                            connectionError = _.getLoginReplyMessage('errorproto');
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
        _.isConnected = false;
        _.inGame = false;
        $('.tg-loginform').show();
    }

    /* COOKIE LAW */
    showCookieLawDisclaimer() {
        let _ = this;

        $(document).on('click', '#cookieconsentbutton', function () {
            _.SaveStorage('cookie_consent', true);
            _.closePopup();
            _.startClient();
        });

        _.openPopup('cookielaw', "Cookie Policy", '');

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
     * Login 
     */

    hideLoginPanel() {
        $('.tg-loginpanel').hide();
        $('#loginForm')[0].reset();
    }

    initLoginPanel() {
        let _ = this;
        _.addScrollBar('.tg-loginpanel', 'loginpanel');


        //toggle logo visibility
        $('.tg-logo-composit').css('visibility', 'visible');


        $('#login_username').focus();

        $('#loginForm').on('submit', function (e) {
            e.preventDefault();
            let name = $('#login_username').val();
            let pass = $('#login_password').val();
            if (!name || !pass) {
                //TODO: Notify user to provide credentials
                return;
            }
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
            _.openPopup('nofeature');
        });
    }

    /* Mini Panel showed after disconnect or InGame Error (with disconection)*/
    initWidgetLoginPanel() {
        let _ = this;

        /* Reconnect Button */
        $('#widgetLoginReconnect').on('click', function () {
            _.socket.off('data');
            //Attach oob Socket Handler
            _.socket.on('data', _.handleLoginData.bind(_));
            _.socket.emit('loginrequest');
            _.closePopup();
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
            var subs = _.substShort(inputs[i]).split(/\s*;\s*/);
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
        if (!isNaN(shortcut_num))
            shortcut_cmd = _.client_options.shortcuts[shortcut_num];
        else if (typeof (_.shortcuts_map[shortcut_key]) != 'undefined')
            shortcut_cmd = _.client_options.shortcuts[_.shortcuts_map[shortcut_key]];

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

                // Remove remaining variables
                input = input.replace(/\$\d+/g, '');
            } else
                input += " " + args.join(" ");
        }

        if (_.cmd_prefix.length > 0)
            input = _.cmd_prefix + " " + input;

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
            console.log('show image with gamma');
            //     // var image = image.slice(6, image.lastIndexOf('"')).split(',');
            //     // showImageWithGamma(image[0], image[1], image[2], image[3]);
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
            _.processCommands('info; stat; @rima', false);
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
            console.log('Generic table');
            return gtable_parse;
            //return _.renderTable(gtable_parse);
        });

        // Inventory
        msg = msg.replace(/&!inv\{[\s\S]*?\}!/gm, function (inv) {
            let inv_parse = $.parseJSON(inv.slice(5, -1));
            console.log('inventory');
            // renderInventory(inv_parse);
            return (inv_parse);
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
            console.log('renderEquipment');
            //_.renderEquipment(eq_parse);
            _.openPopup('nofeature');
            return '';
        });

        // Workable lists
        msg = msg.replace(/&!wklst\{[\s\S]*?\}!/gm, function (wk) {
            let wk_parse = $.parseJSON(wk.slice(7, -1));
            console.log('renderworkslist');
            _.openPopup('nofeature');
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
            if (!_.client_update.interfaceData.info) {
                _.setDataInterface('info', info_parse);
                _.client_update.interfaceData.info = true;
                return '';
            } else {
                //TODO: Carefully, after change desc this msg will be call
                return '';
                //return renderPlayerInfo(info);
            }
        });

        // Player status
        msg = msg.replace(/&!pgst\{[\s\S]*?\}!/gm, function (status) {
            let status_parse = $.parseJSON(status.slice(6, -1));
            if (!_.client_update.interfaceData.stato) {
                _.setDataInterface('stato', status_parse);
                _.client_update.interfaceData.stato = true;
                return '';
            } else {
                return _.renderPlayerStatus(status_parse);
            }

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

    /* *****************************************************************************
     * MISC RENDERING
     */

    renderLink(href, text) {
        return '<a href="' + href + '" target="_blank">' + text + '</a>';
    }

    renderGenericPage(page) {
        let _ = this;
        let page_html = '<div class="tg-title lt-red">' + page.title + '</div><div class="text">' + page.text.replace(/\n/gm, '<br>') + '</div>';

        if (page.title == 'Notizie') {
            if (_.client_options.show_news && !_.client_state.news_showed) {
                _.openPopup('notizie', "Notizie dal gioco", page);
            } else {
                _.sendInput();
                return '';
            }
        } else {
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
        return _.renderMinidetails(condprc, moveprc, wgt) + desc.replace(/\n/gm, ' ') + countStr;
    }

    renderMinidetails(condprc, moveprc, wgt) {
        let pos = -13 * Math.floor(12 * (100 - condprc) / 100);
        return '<div class="hstat" style="background-position:0 ' + pos + 'px" data-condprc="' + condprc + '"' + (moveprc ? ' data-moveprc="' + moveprc + '"' : '') + (wgt != null ? ' wgt="' + wgt + '"' : '') + '></div>';
    }

    setDataInterface(cmd, data) {
        let _ = this;

        if (cmd == 'info') {
            // Name
            $('#charName').html(data.name);
            // Character Image
            if (data.image) {
                $('.tg-characteravatar img').attr('src', _.media_server_addr + data.image);
            }
            /* Info Tooltips */
            $('.tg-characteravatar').attr('title', data.name + ' ' + data.title);

        } else if (cmd == 'stato') {
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
        }
    }

    renderPlayerStatus(status) {
        let _ = this;

        let colors = [{
                val: 15,
                txt: 'red'
            },
            {
                val: 40,
                txt: 'brown'
            },
            {
                val: 100,
                txt: 'green'
            }
        ];

        let sttxt;
        sttxt = '<div class="out-table out-plstatus table-responsive">';
        sttxt += '<table class="table table-sm"><caption>Condizioni</caption>';
        sttxt += '<tr><th scope="row">Salute</th><td><span class="' + _.prcLowTxt(status.hit, colors) + '">' + status.hit + '</span>%</td><td>' + _.prcBar(status.hit, 'red') + '</td></tr>';
        sttxt += '<tr><th scope="row">Movimento</th><td><span class="' + _.prcLowTxt(status.move, colors) + '">' + status.move + '</span>%</td><td>' + _.prcBar(status.move, 'green') + '</td></tr>';
        sttxt += '<tr><th scope="row">Fame</th><td><span class="' + _.prcLowTxt(status.food, colors) + '">' + status.food + '</span>%</td><td>' + _.prcBar(status.food, 'cookie') + '</td></tr>';
        sttxt += '<tr><th scope="row">Sete</th><td><span class="' + _.prcLowTxt(status.drink, colors) + '">' + status.drink + '</span>%</td><td>' + _.prcBar(status.drink, 'blue') + '</td></tr>';

        if (status.msg) {
            sttxt += '<tr><td colspan=1000>' + status.msg + '</td></tr>';
        }

        sttxt += '</table>';
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
     *  Editor 
     */

    openEditor(maxchars, title, text) {
        let _ = this;

        let textarea = $('#editorTextArea').val(text);
        $('#editorTitle').text(title);

        _.openPopup('editor');

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

                var currline,
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

    /* *****************************************************************************
     * ICONS
     */

    tileBgPos(tilenum) {
        let _ = this;
        var tc = _.tileCoords(tilenum);
        return '-' + tc[0] + 'px -' + tc[1] + 'px';
    }

    tileCoords(tilenum) {
        var posx = 32 * (tilenum & 0x7f);
        var posy = 32 * (tilenum >> 7);
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
        for (var d = 0; d < _.dir_names.length; ++d) {
            $('#' + _.dir_names[d] + ' .dir-ico').css('background-position', -26 * doors[d]);
        }

        _.dir_status = doors;
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
     * PLAYER STATUS
     */

    updatePlayerStatus(hprc, mprc) {
        let _ = this;
        let hcolor = _.prcLowTxt(hprc, _.hlttxtcol);
        let mcolor = _.prcLowTxt(hprc, _.hlttxtcol);

        $('.movebar').width(_.limitPrc(mprc) + '%');
        $('#moveBarText i').css('color', mcolor).text(mprc);

        $('.healthbar').width(_.limitPrc(hprc) + '%');
        $('#healtBarText i').css('color', hcolor).text(hprc);
    }

    setStatus(st) {
        //TODO: in combat or not 
        let _ = this;
        _.updatePlayerStatus(st[0], st[1]);
        return '';
    }

    /* *****************************************************************************
     * RENDERING
     */

    renderDetails(info, type) {
        let _ = this;
        if (_.client_options.extradetail) {
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
        if (info.image)
            _.showImage($('#image-cont'), info.image);

        return res;
    }

    renderExtraOutput(info, type) {

        let _ = this,
            res = '',
            tpos,
            container = $('#extraoutput'),
            tabicon = $('#detailsicon-' + type, '#outputOptions'),
            wtab = ['room', 'pers', 'obj', 'dir'].indexOf(type);

        console.log(tabicon);

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
                res += '<div class="room"><div class="lts"></div>' + info.title + '<div class="rts"></div></div>';
            }
            let title = _.capFirstLetter(info.title);
            let icon = '';
            let detaildesc = '';
            if (info.desc.base) {

                if (type == 'room') {
                    _.last_room_desc = _.formatText(info.desc.base, 'out-descbase');
                } else {
                    icon = _.renderIcon(info.icon, null, null, null, null, null);
                }

                detaildesc += _.formatText(info.desc.base, 'out-descbase');
            } else if (info.desc.repeatlast && _.last_room_desc) {
                detaildesc += _.last_room_desc;
            }
            $(cont_header).show();
            $(cont_header).children('#detailtitle').html(icon + title);
            $(cont_header).children('#detaildesc').html(detaildesc);
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
        let details = _.replaceColors(_.renderDetailsInner(info, type, true));

        textarea.append(details);

        if (type == 'room') {
            if (_.client_update.room.version < info.var) {
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
        if (info.desc && !_.client_options.extradetail) {
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
            txt = '';

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
                    grp_attribute = ' grpcoll';

                    if (opened) {
                        grp_attribute += ' d-none';
                    }
                    expicon = '<div class="expicon"></div>';
                }


                /* print header triggerable element */
                txt += '<div class="element' + grp_attribute + '" ' + data_mrn + '>';
                // mob/obj icon
                txt += _.renderIcon(l.icon, l.mrn ? l.mrn[0] : null, cont_type, l.cntnum, null, 'interact ' + type);
                txt += '<div class="desc">' + _.decoratedDescription(l.condprc, l.mvprc, l.wgt, l.sz ? l.sz : 1, (l.eq ? '<b>' + _.equip_positions_by_num[l.eq[0]] + '</b>: ' : '') + l.desc) + '</div>';
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

                res += '<div class="out-list' + columnableClass + ' ' + (style ? ' ' + style : '') + (_.client_options.extradetail ? 'compact"' : '"') + ' data-type="' + cont_type + '"' + (cont_num ? '" data-mrn="' + cont_num + '"' : '') + '>';
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
    }

    interactEvent(event, trigger) {

        let _ = this;

        if (_.inGame) {

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
        for (var i = 0; i < values.length; ++i) {
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
        for (var i = 0; i < values.length; ++i) {
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
        if (_.client_update.interfaceData.info && _.client_update.interfaceData.stato) {
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
        _.mainNavBarInit();
        _.tooltipInit();
        _.outputInit();
        _.keyboardMapInit();
        _.focusInput();
        _.mapInit();
        _.doorsInit();
        _.interactionInit();
        _.buttonsEventInit();
        _.audioInit();

        //Interface is up
        _.client_state.live = true;
    }

    /* -------------------------------------------------
     * SETUP INTERFACE BASED COOKIES AND OTHERS STUFF
     * -------------------------------------------------*/

    configInit() {
        let _ = this;
        /* Extra Detail Display */
        if (_.client_options.extradetail) {
            $('.tg-outputextra-wrap').addClass('d-flex');
        } else {
            $('.tg-outputextra-wrap').removeClass('d-flex');
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

        //$('#tgSearchInput').easyAutocomplete(options);

        $('#tgSearchHelp').on('submit', function (e) {
            e.preventDefault();
            _.openPopup('nofeature');
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

    /* -------------------------------------------------
     * OUTPUT
     * -------------------------------------------------*/

    outputInit() {
        let outputID = '#scrollableOutput';
        this.addScrollBar(outputID, 'output');
        // init Extraoutput window
        this.extraOutputInit();
        // Highlightining mob/obj based on user click
        //TODO: this.highlightsOutputMRN();
        //add Event Handler for Expndable list
        this.makeExpandable();
    }

    showOutput(text) {
        let _ = this,
            app = $(text);
        $('#output').append(app);
        _.scrollPanelTo('#output', '#scrollableOutput', false);

        if (_.client_options.output_trimlines < 10000) {
            $('#output').contents().slice(0, -_.client_options.output_trimlines).remove();
        }

        $('#scrollableOutput').get(0).scrollTop = 100000
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

        var keys = Object.keys(_.exp_grp_list);
        if (keys.length > _.max_exp_grp) {
            for (var k in keys) {
                var val = _.exp_grp_list[k];
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
        let extraOutputID = '.tg-outputextra-wrap';
        this.addScrollBar('#scrollableExtraOutput', 'extraoutput');
        $(extraOutputID).width(_.client_options.extradetail_width);

        $(extraOutputID).resizable({
            handleSelector: ".tg-resizablehand",
            resizeHeight: false,
            resizeWidthFrom: 'left',
            onDragEnd: function () {
                let width = $(extraOutputID).width();
                _.client_options.extradetail_width = width;
                _.SaveStorage('options', _.client_options);
            }
        });
        /* Image Event */
        $('#detailimage')
            .on('error', function () {
                $(this).closest('.extra-detailimg').slideUp(0);
            })
            .on('load', function () {
                $(this).closest('.extra-detailimg').slideDown(0);
            });
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
     *  MAP 
     * -------------------------------------------------*/

    mapInit() {
        let _ = this;
        _.MAP_OBJECT = new Map();
        _.MAP_OBJECT.init();
        _.MAP_OBJECT.prepareCanvas(_.images_path);
    }

    /* -------------------------------------------------
     *  DOORS 
     * -------------------------------------------------*/

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

    /* -------------------------------------------------
     *  Buttons Events
     * -------------------------------------------------*/

    buttonsEventInit() {
        let _ = this;

        /* Buttons with CMD event */
        let cmdButtons = [{
            id: '#userDisconnect',
            cmd: function () {
                _.disconnectFromServer();
            }
        }]

        $.each(cmdButtons, function (idx, bdata) {
            let button = $(bdata.id);

            if (bdata.cmd) {
                button.on('click',
                    typeof bdata.cmd == 'function' ? bdata.cmd : function () {
                        if (_.inGame) {
                            _.processCommands(bdata.cmd)
                        }
                        if (bdata.text) {
                            //TODO open modal by reference
                        }
                    });
            }
        });

        /* Toggle Extra Output Window */
        $('#triggerToggleExtraOutput').on('click', function () {
            $('.tg-outputextra-wrap').toggleClass('d-flex')
            _.scrollPanelTo('#output', '#scrollableOutput', true);
            _.client_options.extradetail = _.client_options.extradetail ? false : true;
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
                    _.scrollPanelTo('#output', '#scrollableOutput', true);
                    $('.tg-dashboard').removeClass('midopen');
                });
                _.SaveStorage('options', _.client_options);
            };
        });

        //Expand tg-area
        $('#triggerExpandTgArea').on('click', function () {
            $('.tg-area').toggleClass('expanded', function () {});
            setTimeout(() => {
                _.scrollPanelTo('#output', '#scrollableOutput', true);
            }, 200);
        })
    }

    /* -------------------------------------------------
     *  Generic Events
     * -------------------------------------------------*/

    genericEvents() {
        let _ = this;
        $('.no-feature').on('click', function (e) {
            e.preventDefault();
            _.openPopup('nofeature');
        });
    }

    sendInput() {
        let inputVal = $('#tgInputUser').val();
        this.processCommands(inputVal, true);
    }

    focusInput() {
        $('#tgInputUser').focus();
    }

    /* -------------------------------------------------
     *  POPUP
     * -------------------------------------------------*/

    openPopup(ref, title, src) {

        let _ = this;

        let MP_type = 'inline',
            MP_close_button = false,
            MP_closeOnBgClick = false,
            MP_src = src,
            MP_callbacks = {};

        switch (ref) {
            /* Cookie Law */
            case 'cookielaw':
                MP_type = 'ajax';
                MP_src = './ajax/cookielawAlert.html';
                break;

                /* Messaggio "non ancora implementato" */
            case 'nofeature':
                MP_type = 'inline';
                MP_closeOnBgClick = true;
                MP_close_button = true;
                MP_src = '<div class="tg-modal">Funzionalità non ancora implementata</div>';
                break;

                /* Beginning News */
            case 'notizie':
                MP_src = 'ajax/news/last.html';
                MP_type = 'ajax';
                MP_callbacks.ajaxContentAdded = function () {
                     _.addScrollBar('.modal-notizie .scrollable', 'notizie');
                     _.client_state.news_showed = true;
                    $('#initNewsButton').one('click', function () {
                        if ($('input[type=checkbox]').prop('checked')) {
                            _.client_options.show_news = false;
                            SaveStorage('options', _.client_options);
                        }
                        _.sendInput();
                        _.closePopup();
                    });
                }
                MP_callbacks.close = function () {
                    _.sendInput();
                };
                break;

                /* Modals with Editor inside */
            case 'editor':
                MP_src = '#editorDialog';
                MP_close_button = true;
                MP_callbacks.open = function () {
                    $('.mfp-close').one('click', function (e) {
                        e.preventDefault();
                        _.abortEdit();
                        _.closePopup();
                    });
                };
                MP_callbacks.close = function (e) {
                    _.closeEditor();
                };
                break;

                /* Login Widget */
            case 'login':
                MP_closeOnBgClick = false;
                break;

            default:
                //TODO: make default value to avoid error.
                break;
        }

        // Open Modal / Popup
        $.magnificPopup.open({
            showCloseBtn: MP_close_button,
            closeOnBgClick: MP_closeOnBgClick,
            type: MP_type,
            preloader: false,
            items: {
                src: MP_src,
                type: MP_type
            },
            mainClass: 'tg-mp modal-' + ref,
            callbacks: MP_callbacks,
        });
        //add Draggable
        $($.magnificPopup.instance.contentContainer).draggabilly({
            handle: '.tg-modal-title',
            containment: '.tg-area'
        });

        return $.magnificPopup.instance;
    }

    addScrollBar(container, key, sx) {
        let scrollX = false;
        this.scrollbar[key] = new PerfectScrollbar(container, {
            wheelPropagation: 2,
            suppressScrollX: scrollX
        });

    }

    // UTILITY
    isModalOpen() {
        return $.magnificPopup.instance.isOpen;
    }

    closePopup() {
        $.magnificPopup.close();
    }

    scrollPanelTo(parent, scrollablepanel, animate) {
        let outputHeigt = $(parent).height();
        if (animate) {
            $(scrollablepanel).animate({
                scrollTop: outputHeigt
            }, 500, 'linear');
        } else {
            $(scrollablepanel).scrollTop(outputHeigt);
        }
    }

    main() {}
}