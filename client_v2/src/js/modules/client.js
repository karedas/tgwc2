// //NPM Modules
import Cookies from 'js-cookie';
import io from 'socket.io-client';
import Modernizr from "modernizr";
import 'magnific-popup';

//Custom
import FacebookSDK from 'FacebookSdk';
import Map from 'mapDrawer';
// Assets file list.
import assetsList from 'assets_list.json';



// import 'malihu-custom-scrollbar-plugin';
// import lodash from  'lodash';
// //My Modules
// import {input_history} from 'modules/input_history';
export default class TgGui {

    constructor(options) {

        this.ws_server_addr = '51.38.185.84';
        this.socket_io_resource = 'socket.io';
        this.media_server_addr = './images/';
        this.ws_prefix = '/';
        this.image_path = '';
        this.sounds_path = '';

        /* Cookies Settings */
        this.cookies = {
            prefix: 'tgwc',
            expires: 365 * 10
        };

        /* Connection */
        this.serverIsOnline = false;
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

        this.client_state = {};

        /* UI Game Options */
        this.client_options = {};

        this.debug = false;
        
    }

    init() {
        let _ = this;
        // Get Cookie "Italy cookie law"
        let cookie_consent = _.loadUserSessionData('cookie_consent');
        // Check Cookie Law Approval Status, then go to start or wait user action.
        if (!cookie_consent) {
            _.showCookieLawDisclaimer();
        } else {
            _.startClient();
        }
    }

    startClient() {
        let _ = this;

        let facebookSDK = new FacebookSDK();
        facebookSDK.load();

        _.initSessionData();
        _.connectToServer().then(function (resolve) {
            _.showLoginPanel();
        }).catch(function (error) {
            console.log(error);
        });
    }

    connectToServer() {
        let _ = this;
        return new Promise(function (resolve, reject) {

            // Initialize Connection to the WebSocket
            _.socket = io.connect(_.ws_server_addr, {
                'reconnect': false,
                'force new connection': true,
                'resource': _.socket_io_resource,
            });

            // WebSocket is Up
            _.socket.on('connect', function () {
                _.serverIsOnline = true;
                _.networkActivityMessage("Server Online", 'up');
                
                _.socket.on('data', _.handleLoginData.bind(_));

                resolve();
            });
            
            _.socket.on('disconnect', function () {
                _.networkActivityMessage("Disconnesso dal server");
            });

            _.socket.on('connect_error', function (e) {
                if (_.isConnected) {
                    _.networkActivityMessage("Connessione chiusa");
                } else {
                    _.networkActivityMessage("Il server di gioco è offline.");
                }
                reject();
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
                        _.sendOOB({ itime: _.client_state.when.toString(16) });
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
                        _.preloadClient().then(function (resolve, reject) {

                            _.completeHandshake();
                            _.handleServerData(data.slice(end + 2));
                            _.hideLoginPanel();
                            _.loadInterface();
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
        _.socket.removeListener('data', _.handleLoginData);
        _.socket.on('data', _.handleServerData.bind(_));
        //_.setHandshaked();
    }

    handleServerData(msg) {

        let _ = this;

        _.netdata += msg;

        let len = _.netdata.length;

        if (_.netdata.indexOf("&!!", len - 3) !== -1) {
            
            let now,
                data = _.preparseText(_.netdata.substr(0, len - 3));

            try {
                _.showOutput(_.parseForDisplay(data));
            } catch (err) {
                console.log(err.message);
            }

            _.netdata = '';
            
            now = Date.now();



        } else if (len > 200000) {
            _.showOutput('<br>Errore di comunicazione con il server!<br>');
            _.netdata = '';
            _.setDisconnect();
        }
    }

    /* COOKIE LAW */
    showCookieLawDisclaimer() {
        let _ = this;
        $('.tg-cookielawcontent').show();
        // Cookie Law approved === true,  Start the Client
        $('#cookieconsentbutton').on('click', function () {
            _.saveUserSessionData('cookie_consent', true);
            $('.tg-cookielawcontent').remove();
            _.startClient();
        });
    }
    
    initSessionData() {

        let _ = this;
        // Load State
        let saved_state = Cookies.getJSON(_.cookies.prefix + 'state');

        if (Modernizr.localstorage && saved_state) {
            _.saveUserSessionData('state', saved_state);
            Cookies.set(_.cookies.prefix + 'state', null);
        } else {
            saved_state = _.loadUserSessionData('state');
        }

        if (saved_state) {
            $.extend(_.client_state, saved_state);
        }
        if (_.client_state.when == null) {
            _.client_state.when = new Date().getTime();
            _.saveUserSessionData('state', _.client_state);
        }

        // Load Options
        let saved_options = Cookies.getJSON(_.cookies.prefix + 'options');

        if (Modernizr.localstorage && saved_options) {
            _.saveUserSessionData('options', saved_options);
            Cookies(cookies.prefix + 'options', null);
        } else {
            saved_options = _.loadUserSessionData('options');
        }

        if (saved_options) {
            $.extend(_.client_options, saved_options);
        }
    }

    loadUserSessionData(what) {

        what = this.cookies.prefix + what;

        if (Modernizr.localstorage) {
            let data = localStorage[what];
            return data ? JSON.parse(data) : null;
        } else {
            return Cookies.get(what);
        }
    }

    saveUserSessionData(what, value) {
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
    * ASSETS PRELOAD 
    */
    preloadClient() {
        let _ = this;

        let percentage = 0;
        let stepSize = 100 / assetsList.length;
        $('#tgPreloader').show().find('span').text(percentage);

        let images = [];

        return new Promise(function (resolve, reject) {
            for (let i = 0; assetsList.length > i; i++) {
                let img = new Image();
                img.onload = function () {
                    percentage = percentage + stepSize;
                    $('#tgPreloader span').text(Math.round(percentage));

                    $('#tgPreloader')
                    $(window).trigger('tgassetsload--step');

                    if (assetsList.length - 1 == i) {
                        // All Images loaded
                        resolve();
                    }
                };
                img.src = _.media_server_addr + assetsList[i];
            }
        });
    }


    hideLoginPanel() {
        $('.tg-loginpanel').hide();
    }

    showLoginPanel() {
        let _ = this;

        $('.tg-loginform').show();
        $('#login_username').focus();

        $('#loginPanel').on('submit', function (e) {

            e.preventDefault();

            let name = $('#login_username').val();
            let pass = $('#login_password').val();

            if (!name || !pass) {
                //Notify user to provide credentials
                return;
            }

            _.connectionInfo.loginName = name;
            _.connectionInfo.loginPass = pass;
            _.connectionInfo.mode = "login";

            _.performLogin();
        });

        // On New  Character Creation button
        $('#doNewCharacter').on('click', _.openPopup);
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

    loginNetworkActivityMessage(msg, dataname) {
        $('#loginNetworkActivityMessage').text(msg).attr('data-status', dataname);
    }

    networkActivityMessage(msg) {
        $('#networkActivityMessage').text(msg);
    }
 

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

        // Not repeated tags

        // Hide text (password)
        msg = msg.replace(/&x\n*/gm, function () {
            console.log('input type password enabled');
            // _.inputPassword();
            return '';
        });

        // Show text (normal input)
        msg = msg.replace(/&e\n*/gm, function () {
            console.log('input type text enabled');
            //inputText();
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
            let st = status.slice(5, status.lastIndexOf('"')).split(',');
            return _.setStatus(st);
        });

        // Player status
        msg = msg.replace(/&!up"[^"]*"\n*/gm, function (update) {
            console.log('playerstatus 2 - inv, eq , room version');
            let ud = update.slice(5, status.lastIndexOf('"')).split(',');

            if (ud[0] > client_update.inventory.version)
                client_update.inventory.needed = true;

            if (ud[1] > client_update.equipment.version)
                client_update.equipment.needed = true;

            if (ud[2] > client_update.room.version)
                client_update.room.needed = true;

            return '';
        });

        // Image in side frame (with gamma)
        msg = msg.replace(/&!img"[^"]*"\n*/gm, function (image) {
            console.log('show image with gamma');
            // var image = image.slice(6, image.lastIndexOf('"')).split(',');
            // showImageWithGamma(image[0], image[1], image[2], image[3]);
            return '';
        });

        // Image in side frame
        msg = msg.replace(/&!im"[^"]*"\n*/gm, function (image) {
            console.log('Image in side frame');

            // var image = image.slice(5, image.lastIndexOf('"'));
            // showImage(image);
            return '';
        });

        // Player is logged in
        msg = msg.replace(/&!logged"[^"]*"/gm, function () {
            _.inGame = true;
            return '';
        });

        // Close the text editor
        msg = msg.replace(/&!ea"[^"]*"\n*/gm, function (options) {
            console.log('closeEditor');
            _.closeEditor();
            return '';
        });

        // Open the text editor
        msg = msg.replace(/&!ed"[^"]*"\n*/gm, function (options) {
            var options = options.slice(5, options.lastIndexOf('"')).split(',');
            var text = options.slice(2).toString().replace(/\n/gm, ' ');
            openEditor(options[0], options[1], text);
            return '';
        });

        // Map data
        msg = msg.replace(/&!map\{[\s\S]*?\}!/gm, function (map) {
            let map_parse = $.parseJSON(map.slice(5, -1));
            _.updateMap(map_parse);
            return '';
        });

        // Book
        msg = msg.replace(/&!book\{[\s\S]*?\}!/gm, function (b) {
            b = $.parseJSON(b.slice(6, -1));
            openBook(b);
            return '';
        });

        // List of commands
        msg = msg.replace(/&!cmdlst\{[\s\S]*?\}!/gm, function (cmd) {
            cmd = $.parseJSON(cmd.slice(8, -1).replace(/"""/, '"\\""'));
            return renderCommandsList(cmd);
        });

        // Generic page (title, text)
        msg = msg.replace(/&!page\{[\s\S]*?\}!/gm, function (p) {
            p = $.parseJSON(p.slice(6, -1)); /* .replace(/\n/gm,' ') */
            // return addFrameStyle(addBannerStyle(p.title) + '<div class="text">' + p.text.replace(/\n/gm, '<br>') + '</div>');
            return '<div class="msg-title">' + p.title + '</div><div class="text">' + p.text.replace(/\n/gm, '<br>') + '</div>';
        });

        // Generic table (title, head, data)
        msg = msg.replace(/&!table\{[\s\S]*?\}!/gm, function (t) {
            t = $.parseJSON(t.slice(7, -1));
            return renderTable(t);
        });

        // Inventory
        msg = msg.replace(/&!inv\{[\s\S]*?\}!/gm, function (inv) {
            inv = $.parseJSON(inv.slice(5, -1));
            renderInventory(inv);
            return '';
        });

        // Room details
        msg = msg.replace(/&!room\{[\s\S]*?\}!/gm, function (dtls) {
            dtls = $.parseJSON(dtls.slice(6, -1));
            //return renderDetails(dtls, dtls.dir ? 'dir' : 'room');
        });

        // Person details
        msg = msg.replace(/&!pers\{[\s\S]*?\}!/gm, function (dtls) {
            dtls = $.parseJSON(dtls.slice(6, -1));
            // return renderDetails(dtls, 'pers');
        });

        // Object details
        msg = msg.replace(/&!obj\{[\s\S]*?\}!/gm, function (dtls) {
            dtls = $.parseJSON(dtls.slice(5, -1).replace(/\n/gm, ' '));
            return _.renderDetailsInText(dtls, 'obj');
        });

        // Equipment
        msg = msg.replace(/&!equip\{[\s\S]*?\}!/gm, function (eq) {
            eq = $.parseJSON(eq.slice(7, -1).replace(/\n/gm, '<br>'));
            //renderEquipment(eq);
            return '';
        });

        // Workable lists
        msg = msg.replace(/&!wklst\{[\s\S]*?\}!/gm, function (wk) {
            wk = $.parseJSON(wk.slice(7, -1));
            //return renderWorksList(wk);
        });

        // Skill list
        msg = msg.replace(/&!sklst\{[\s\S]*?\}!/gm, function (skinfo) {
            skinfo = $.parseJSON(skinfo.slice(7, -1));
            //return renderSkillsList(skinfo);
        });

        // Player info
        msg = msg.replace(/&!pginf\{[\s\S]*?\}!/gm, function (info) {
            info = $.parseJSON(info.slice(7, -1));
            //return renderPlayerInfo(info);
        });

        // Player status
        msg = msg.replace(/&!pgst\{[\s\S]*?\}!/gm, function (status) {
            status = $.parseJSON(status.slice(6, -1));
            //return renderPlayerStatus(status);
        });

        // Selectable generic
        msg = msg.replace(/&!select\{[\s\S]*?\}!/gm, function (s) {
            s = $.parseJSON(s.slice(8, -1));
            //return selectDialog(s);
        });

        // Refresh command
        msg = msg.replace(/&!refresh\{[\s\S]*?\}!/gm, function (t) {
            t = $.parseJSON(t.slice(9, -1));
            return handleRefresh(t);
        });

        // Pause scroll
        msg = msg.replace(/&!crlf"[^"]*"/gm, function () {
            //pauseOn();
            console.log('//pauseOn();');
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
            return addFilterTag(type, msg);
        });


        msg = msg.replace(/&!ce"[^"]*"/gm, function (image) {
            var image = image.slice(5, -1);
            return renderEmbeddedImage(image);
        });

        msg = msg.replace(/&!ulink"[^"]*"/gm, function (link) {
            var link = link.slice(8, -1).split(',');
            return renderLink(link[0], link[1]);
        });

        msg = msg.replace(/&!as"[^"]*"/gm, '');

        msg = msg.replace(/&!(ad|a)?m"[^"]*"/gm, function (mob) {
            var mob = mob.slice(mob.indexOf('"') + 1, -1).split(',');
            var desc = mob.slice(5).toString();
            return renderMob(mob[0], mob[1], mob[2], mob[3], desc, 'interact pers');
        });

        msg = msg.replace(/&!(ad|a)?o"[^"]*"/gm, function (obj) {
            var obj = obj.slice(obj.indexOf('"') + 1, -1).split(',');
            var desc = obj.slice(5).toString();
            return renderObject(obj[0], obj[1], obj[2], obj[3], desc, 'interact obj');
        });

        msg = msg.replace(/&!sm"[^"]*"/gm, function (icon) {
            var icon = icon.slice(5, -1).split(',');
            //return renderIcon(icon[0], icon[1], 'room', null, null, 'interact pers');
        });

        msg = msg.replace(/&!si"[^"]*"/gm, function (icon) {
            var icon = icon.slice(5, -1).split(',');
            //return renderIcon(icon[0], null, null, null, null, "v " + icon[1]);
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
        msg = msg.replace(/\n/gm, '<br>');

        msg = _.replaceColors(msg);

        return msg.replace(/<p><\/p>/g, '');

    }

    replaceColors(msg) {
        msg = msg.replace(/&B/gm, '<div class="gray">');
        msg = msg.replace(/&R/gm, '<div class="lt-red">');
        msg = msg.replace(/&G/gm, '<div class="lt-green">');
        msg = msg.replace(/&Y/gm, '<div class="yellow">');
        msg = msg.replace(/&L/gm, '<div class="lt-blue">');
        msg = msg.replace(/&M/gm, '<div class="lt-magenta">');
        msg = msg.replace(/&C/gm, '<div class="lt-cyan">');
        msg = msg.replace(/&W/gm, '<div class="white">');
        msg = msg.replace(/&b/gm, '<div class="black">');
        msg = msg.replace(/&r/gm, '<div class="red">');
        msg = msg.replace(/&g/gm, '<div class="green">');
        msg = msg.replace(/&y/gm, '<div class="brown">');
        msg = msg.replace(/&l/gm, '<div class="blue">');
        msg = msg.replace(/&m/gm, '<div class="magenta">');
        msg = msg.replace(/&c/gm, '<div class="cyan">');
        msg = msg.replace(/&w/gm, '<div class="lt-white">');
        msg = msg.replace(/&-/gm, '</div>');

        return msg;
    }




    /* *****************************************************************************
    * SKY
    */

    setSky(sky) {
        console.log('TODO:SKY');
        // let skypos = ['0','1','2','3','4','5','6','7','8','9','N','d','e','f','g','i','o','p','q','r','s','t','u','w','y'];
        // $('#sky').css('background-position', '0 -'+(skypos.indexOf(sky)*29)+'px');
    }

    /* *****************************************************************************
    * DOORS
    */
   
    setDoors() {
        console.log('TODO:DOORS');
    }

    /* *****************************************************************************
    * AUDIO & MUSIC
    */

    playAudio() {
        console.log('TODO:playaudio')
    }

    /* *****************************************************************************
     * PLAYER STATUS
    */

    updatePlayerStatus(hprc, mprc) {
        let hcolor = prcLowTxt(hprc, hlttxtcol);
        let mcolor = prcLowTxt(hprc, hlttxtcol);

        $('.movebar').width(limitPrc(mprc)+'%');
        $('.moveprc').css('color', mcolor).text(mprc);
    
        $('.healthbar').width(limitPrc(hprc)+'%');
        $('.healthprc').css('color', hcolor).text(hprc);
    }

    setStatus(st) {
        _.updatePlayerStatus(st[0], st[1]);
        return;
    }

    
    /* *****************************************************************************
     * MAP
    */
    updateMap (map) {
        _.drawCanvasMap();
    }




    renderDetailsInText(info, type) {
        let res = '';

        if (info.title)
            res += '<div class="room"><div class="lts"></div>' + capFirstLetter(info.title) + '<div class="rts"></div></div>';
        /* addBannerStyle(capFirstLetter(info.title), 'mini', 'long'); */

        res += _.renderDetailsInner(info, type, false);

        //if(info.image)
        //    showImage($('#image-cont'), info.image);

        return res;
    }

    renderDetailsInner(info, type, inDialog) {
        let _ = this,
            textarea = '';
        if (info.action) {
            textarea += '<p>' + info.action + '</p>';
        }
        /* Print description */
        if (info.desc) {
            if (info.desc.base) {
                if (type == 'room')
                    last_room_desc = _.formatText(info.desc.base);
                textarea += _.formatText(info.desc.base);
            } else if (info.desc.repeatlast && last_room_desc)
                textarea += last_room_desc;

            if (info.desc.details)
                textarea += _.formatText(info.desc.details, 'yellow');

            if (info.desc.equip)
                textarea += _.formatText(info.desc.equip, 'green');
        }

    }

    formatText(text, style) {
        let page = '';
        let parags = text.replace(/\r/gm, '').replace(/([^.:?!,])\s*\n/gm, '$1 ').split(/\n/);

        $.each(parags, function (i, p) {
            page += '<p' + (style ? ' class="' + style + '"' : '') + '>' + p + '</p>';
        });

        return page;
    }

    sendOOB(data) {
        let _ = this;
        if (!_.isConnected) {
            return;
        }
        _.socket.emit('oob', data);
    }

    processCommands(text) {
        let _ = this;
        if (_.inGame) {

        }
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


    showOutput(text) {
        let toHtml = $(text);
        $('#output').append(toHtml);
    }

    clearOutput() {
        $('#output').empty();
    }

    loadInterface() {

        /*
         * Interface Modules List.
         */

        let _ = this;

        //_.outputinit();
        $('.tg-main').show();

        _.keyboardMapInit();
        _.focusInput();
        _.mapInit();
        _.main();
    }

    /* -------------------------------------------------
     * KEYBOARD MAP
     * -------------------------------------------------*/

    keyboardMapInit() {

        let _ = this;

        $(document).on('keydown', function (event) {
            //TODO if is not connected?
            if (event.metaKey || event.ctrlKey) {
                return true;
            }

            if ($(event.target).is('#tgInputUser') === true) {

                /* Enter Key */
                if (event.which == 13) {
                    _.sendInput();
                    return false;
                }
            }

        });
    }

    
    /* -------------------------------------------------
     *  MAP 
     * -------------------------------------------------*/
    mapInit() {
        let _ = this;
        let MiniMap = new Map();
        MiniMap.init();
        MiniMap.prepareCanvas();
        
    }

    sendInput() {
        this.processCommands($('#tgInputUser').val());
    }

    focusInput() {
        $('#tgInputUser').focus();
    }

    openPopup() {
        let _ = this,
            content; 

        console.log(this);
        $.magnificPopup.open({
            type: 'inline',
            items: {
                src: '<div class="tg-modal">Funzionalità non ancora implementata</div>',
                type: 'inline'
            }
        });
    }

    main() {

    }


}