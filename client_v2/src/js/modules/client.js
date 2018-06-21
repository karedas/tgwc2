// //NPM Modules
import Cookies from 'js-cookie';
import io from 'socket.io-client';
import Modernizr from "modernizr";

// import _Handlebars from 'handlebars/dist/handlebars';
import 'magnific-popup';
import 'malihu-custom-scrollbar-plugin';

//Custom
import FacebookSDK from 'FacebookSdk';
import Map from 'mapDrawer';
// Assets file list.
import assetsList from 'assets_list.json';


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
        this.client_options = {
            alpha_approved: false,
            shortcuts: [],
            login: {},
        };

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
        this.dir_down=5;

        this.dir_names = ['nord', 'est', 'sud', 'ovest', 'alto', 'basso'];
        this.dir_status = '000000';

        /* Shortcuts */
        this.shortcuts_map = {};

        /* Input */
        this.cmd_prefix = '';

        /* Output */
        this.last_room_desc='';

        /* Health bars */
        this.hlttxtcol = [
            { let: 25, txt: 'orangered' },
            { let: 50, txt: 'yellow' },
            { let: 100, txt: 'greenyellow' },
        ];

        this.client_update = {
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

        this.template = {
            modal : ['alertAlpha']
        }

        /* Debug */
        this.debug = false;

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
                _.networkActivityMessage("Server Online", 1);
                _.socket.on('data', _.handleLoginData.bind(_));

                resolve();
            });

            _.socket.on('disconnect', function () {
                _.networkActivityMessage("Disconnesso dal server");
            });

            _.socket.on('connect_error', function (e) {
                if (_.serverIsOnline) {
                    _.networkActivityMessage("Connessione chiusa");
                } else {
                    _.networkActivityMessage("Il server di gioco è offline.", 0);
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
                        _.hideLoginPanel();
                        _.openPopup('alpha_version', function(done){
                             _.preloadClient().then(function (resolve, reject) {
                                _.completeHandshake();
                                _.handleServerData(data.slice(end + 2));
                                _.loadInterface();
                            });
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

            let data = _.preparseText(_.netdata.substr(0, len - 3));

            try {
                _.showOutput(_.parseForDisplay(data));
            } catch (err) {
                console.log(err.message);
            }

            _.netdata = '';

            let now = Date.now();

            if( now > _.client_update.last + 1000 ) {
                if (_.client_update.room.needed) {
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

    /* COOKIE LAW */
    showCookieLawDisclaimer() {
        let _ = this;
        $('.tg-cookielawcontent').show();
        // Cookie Law approved === true,  Start the Client
        $('#cookieconsentbutton').on('click', function () {
            _.SaveStorage('cookie_consent', true);
            $('.tg-cookielawcontent').remove();
            _.startClient();
        });
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
        if (_.client_state.when == null) {
            _.client_state.when = new Date().getTime();
            _.SaveStorage('state', _.client_state);
        }

        // Load Options
        let saved_options = Cookies.getJSON(_.cookies.prefix + 'options');

        if (Modernizr.localstorage && saved_options) {
            _.SaveStorage('options', saved_options);
            Cookies(cookies.prefix + 'options', null);
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

    UploadUserConfiguration() {
        // TODO
    }

    ExtractAndSaveUserConfiguration() {
        // TODO
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
        $('#doNewCharacter').on('click', function(){
            _.openPopup();
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

    loginNetworkActivityMessage(msg, dataname) {
        $('.tg-loginstatus').text(msg).attr('data-status', status);
    }

    networkActivityMessage(msg, status) {
        $('.tg-serverstatus').text(msg).attr('data-status', status);
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

        // Hide text (password)
        // msg = msg.replace(/&x\n*/gm, function () {
        //     console.log('input type password enabled');
        //     // _.inputPassword();
        //     return '';
        // });

        // Show text (normal input)
        // msg = msg.replace(/&e\n*/gm, function () {
        //     console.log('input type text enabled');
        //     //inputText();
        //     return '';
        // });

        // Sky picture
        msg = msg.replace(/&o.\n*/gm, function (sky) {
            console.log('set sky');
            let sky_parse = sky.charAt(2);
            _.setSky(sky_parse);
            return '';
        });

        // Exits info
        msg = msg.replace(/&d\d{6}\n*/gm, function (doors) {
            console.log('Exit Info');
            let doors_parse = doors.substr(2, 6);
            _.setDoors(doors_parse);
            return '';
        });

        // // Audio
        // msg = msg.replace(/&!au"[^"]*"\n*/gm, function (audio) {
        //     let audio_parse = audio.slice(5, audio.lastIndexOf('"'));
        //     // _.playAudio(audio_parse);
        //     console.log('_.playAudio');
        //     return '';
        // });

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

        // // Image in side frame (with gamma)
        // msg = msg.replace(/&!img"[^"]*"\n*/gm, function (image) {
        //     console.log('show image with gamma');
        //     // var image = image.slice(6, image.lastIndexOf('"')).split(',');
        //     // showImageWithGamma(image[0], image[1], image[2], image[3]);
        //     return '';
        // });

        // // Image in side frame
        // msg = msg.replace(/&!im"[^"]*"\n*/gm, function (image) {
        //     console.log('Image in side frame');
        //     // var image = image.slice(5, image.lastIndexOf('"'));
        //     // showImage(image);
        //     return '';
        // });

        // Player is logged in
        msg = msg.replace(/&!logged"[^"]*"/gm, function () {
            _.inGame = true;
            return '';
        });

        // // Close the text editor
        // msg = msg.replace(/&!ea"[^"]*"\n*/gm, function (options) {
        //     console.log('closeEditor');
        //     // _.closeEditor();
        //     return '';
        // });

        // // Open the text editor
        // msg = msg.replace(/&!ed"[^"]*"\n*/gm, function (options) {
        //     let options_parse = options.slice(5, options.lastIndexOf('"')).split(',');
        //     let text = options_parse.slice(2).toString().replace(/\n/gm, ' ');
        //     openEditor(options_parse[0], options_parse[1], text);
        //     return '';
        // });

        // Map data
        msg = msg.replace(/&!map\{[\s\S]*?\}!/gm, function (map) {
            let map_parse = $.parseJSON(map.slice(5, -1));
            // _.updateMap(map_parse);
            console.log('update map');
            return '';
        });

        // // Book
        // msg = msg.replace(/&!book\{[\s\S]*?\}!/gm, function (b) {
        //     b = $.parseJSON(b.slice(6, -1));
        //     console.log('open book');
        //     // openBook(b);
        //     return '';
        // });

        // // List of commands
        // msg = msg.replace(/&!cmdlst\{[\s\S]*?\}!/gm, function (cmd) {
        //     let cmd_parse = $.parseJSON(cmd.slice(8, -1).replace(/"""/, '"\\""'));
        //     // return _.renderCommandsList(cmd_parse);
        //     console.log('return commands list');
        // });

        // // Generic page (title, text)
        // msg = msg.replace(/&!page\{[\s\S]*?\}!/gm, function (p) {
        //     console.log('page_parse');
        //     let page_parse = $.parseJSON(p.slice(6, -1)); /* .replace(/\n/gm,' ') */
        //     // return addFrameStyle(addBannerStyle(p.title) + '<div class="text">' + p.text.replace(/\n/gm, '<br>') + '</div>');
        //     return '<div class="msg-title">' + page_parse.title + '</div><div class="text">' + page_parse.text.replace(/\n/gm, '<br>') + '</div>';
        // });

        // // Generic table (title, head, data)
        // msg = msg.replace(/&!table\{[\s\S]*?\}!/gm, function (t) {
        //     let gtable_parse = $.parseJSON(t.slice(7, -1));
        //     // return renderTable(gtable_parse);
        //     console.log('Generic table');
        // });

        // // Inventory
        // msg = msg.replace(/&!inv\{[\s\S]*?\}!/gm, function (inv) {
        //     let inv_parse = $.parseJSON(inv.slice(5, -1));
        //     console.log('inventory');
        //     // renderInventory(inv_parse);
        //     return '';
        // });

        // Room details
        msg = msg.replace(/&!room\{[\s\S]*?\}!/gm, function (dtls) {
            let dtls_parse = $.parseJSON(dtls.slice(6, -1));
            return _.renderDetails(dtls_parse, dtls_parse.dir ? 'dir' : 'room');
        });

        // Person details
        msg = msg.replace(/&!pers\{[\s\S]*?\}!/gm, function (dtls) {
            dtls_parse = $.parseJSON(dtls.slice(6, -1));
            return _.renderDetails(dtls_parse, 'pers');
        });

        // Object details
        msg = msg.replace(/&!obj\{[\s\S]*?\}!/gm, function (dtls) {
            dtls_parse = $.parseJSON(dtls.slice(5, -1).replace(/\n/gm, ' '));
            return _.renderDetailsInText(dtls_parse, 'obj');
        });

        // Equipment
        // msg = msg.replace(/&!equip\{[\s\S]*?\}!/gm, function (eq) {
        //     let eq_parse = $.parseJSON(eq.slice(7, -1).replace(/\n/gm, '<br>'));
        //     //renderEquipment(eq_parse);
        //     return '';
        // });

        // // Workable lists
        // msg = msg.replace(/&!wklst\{[\s\S]*?\}!/gm, function (wk) {
        //     wk = $.parseJSON(wk.slice(7, -1));
        //     //return renderWorksList(wk);
        // });

        // // Skill list
        // msg = msg.replace(/&!sklst\{[\s\S]*?\}!/gm, function (skinfo) {
        //     skinfo = $.parseJSON(skinfo.slice(7, -1));
        //     //return renderSkillsList(skinfo);
        // });

        // // Player info
        // msg = msg.replace(/&!pginf\{[\s\S]*?\}!/gm, function (info) {
        //     info = $.parseJSON(info.slice(7, -1));
        //     //return renderPlayerInfo(info);
        // });

        // // Player status
        // msg = msg.replace(/&!pgst\{[\s\S]*?\}!/gm, function (status) {
        //     let status_parse = $.parseJSON(status.slice(6, -1));
        //     //return renderPlayerStatus(status_parse);
        // });

        // // Selectable generic
        // msg = msg.replace(/&!select\{[\s\S]*?\}!/gm, function (s) {
        //     s = $.parseJSON(s.slice(8, -1));
        //     //return selectDialog(s);
        // });

        // // Refresh command
        // msg = msg.replace(/&!refresh\{[\s\S]*?\}!/gm, function (t) {
        //     let rcommand_parse = $.parseJSON(t.slice(9, -1));
        //     return handleRefresh(rcommand_parse);
        // });

        // Pause scroll
        msg = msg.replace(/&!crlf"[^"]*"/gm, function () {
            _.pauseOn();
            return '';
        });

        // // Clear message
        // pos = msg.lastIndexOf('&*');
        // if (pos >= 0) {
        //     _.clearOutput();
        //     msg = msg.slice(pos + 2);
        // }

        // // Filterable messages
        // msg = msg.replace(/&!m"(.*)"\{([\s\S]*?)\}!/gm, function (line, type, msg) {
        //     return addFilterTag(type, msg);
        // });


        // msg = msg.replace(/&!ce"[^"]*"/gm, function (image) {
        //     let image_parse = image.slice(5, -1);
        //     return renderEmbeddedImage(image_parse);
        // });

        // msg = msg.replace(/&!ulink"[^"]*"/gm, function (link) {
        //     let link_parse = link.slice(8, -1).split(',');
        //     return renderLink(link_parse[0], link_parse[1]);
        // });

        // msg = msg.replace(/&!as"[^"]*"/gm, '');

        // msg = msg.replace(/&!(ad|a)?m"[^"]*"/gm, function (mob) {
        //     let mob_parse = mob.slice(mob.indexOf('"') + 1, -1).split(',');
        //     let desc_parse = mob.slice(5).toString();
        //     return renderMob(mob_parse[0], mob_parse[1], mob_parse[2], mob_parse[3], desc_parse, 'interact pers');
        // });

        // msg = msg.replace(/&!(ad|a)?o"[^"]*"/gm, function (obj) {
        //     let obj_parse = obj.slice(obj.indexOf('"') + 1, -1).split(',');
        //     let desc_parse = obj.slice(5).toString();
        //     return renderObject(obj_parse[0], obj_parse[1], obj_parse[2], obj_parse[3], desc_parse, 'interact obj');
        // });

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
        msg = msg.replace(/\n/gm, '<br>');
        if(msg !== '') {
            msg = _.replaceColors('<div class="tgline">'+msg+'</div>');
        }

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
    * OUTPUT BUTTONS
    */

    
    pauseOn(){
        console.log('pauseON');
        // if(autoscroll_enabled) {
        //     autoscroll_enabled = false;
        //     $('#pausebutton').button("option", "icons", { primary: 'ui-icon-custom-play' });
    }

    pauseOff(){ 
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
        return '-'+tc[0]+'px -'+tc[1]+'px';
    }

    tileCoords(tilenum){ 
        var posx = 32 * (tilenum & 0x7f);
        var posy = 32 * (tilenum >> 7);

        return [posx, posy];
    }

    renderIcon(icon, mrn, cnttype, cntmrn, cmd, addclass) {
        let _ = this;
        if(!icon)
            icon = 416;
    
        return '<div class="iconimg'+(addclass ? ' '+addclass : '') + '" style="background-position:' +  _.tileBgPos(icon)+'"'+(mrn ? ' mrn="'+mrn+'"': '')+(cmd ? ' cmd="'+cmd+'"': '')+(cnttype ? ' cnttype="'+cnttype+'"': '')+(cntmrn ? ' cntmrn="'+cntmrn+'"': '')+'></div>';
    }

    /* *****************************************************************************
     * SKY
     */

    setSky(sky) {
        let skypos = ['0','1','2','3','4','5','6','7','8','9','N','d','e','f','g','i','o','p','q','r','s','t','u','w','y'];
        $('#sky').css('background-position', '0 -'+(skypos.indexOf(sky)*29)+'px');
    }

    /* *****************************************************************************
     * DOORS
     */

    setDoors(doors) {
        let _ = this;
        for (let d = 0; d < this.dir_names.length; ++d) {
		    $('#'+ _.dir_names[d]).css('background-position', -33*doors[d]);
        _.dir_status = doors;
        }
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
        let _ = this;
        let hcolor = _.prcLowTxt(hprc, _.hlttxtcol);
        let mcolor = _.prcLowTxt(hprc, _.hlttxtcol);

        $('.movebar').width(_.limitPrc(mprc) + '%');
        $('.moveprc').css('color', mcolor).text(mprc);

        $('.healthbar').width(_.limitPrc(hprc) + '%');
        $('.healthprc').css('color', hcolor).text(hprc);
    }

    setStatus(st) {
        //TODO in combat or not 

        let _ = this;
        _.updatePlayerStatus(st[0], st[1]);
        return '';
    }

    /* *****************************************************************************
     * MAP
     */
    updateMap(map) {
        let _ = this;
       // _.drawCanvasMap();
    }

    renderDetailsInText(info, type) {
        let _ = this;
        let res = '';

        if (info.title)
            res += '<div class="room"><div class="lts"></div>' + _.capFirstLetter(info.title) + '<div class="rts"></div></div>';
        /* addBannerStyle(capFirstLetter(info.title), 'mini', 'long'); */

        res += _.renderDetailsInner(info, type, false);

        //if(info.image)
        //    showImage($('#image-cont'), info.image);

        return res;
    }

    renderDetails(info, type){
		return this.renderDetailsInText(info, type);
    }

    renderDetailsInner(info, type) {
        let _ = this;

        let textarea = '';

        if (info.action) {
            textarea += '<p>' + info.action + '</p>';
        }
        /* Print description */
        if (info.desc) {
            if (info.desc.base) {
                if (type == 'room')
                    _.last_room_desc = _.formatText(info.desc.base);
                textarea += _.formatText(info.desc.base);
            } else if (info.desc.repeatlast && _.last_room_desc)
                textarea += _.last_room_desc;

            if (info.desc.details)
                textarea += _.formatText(info.desc.details, 'yellow');

            if (info.desc.equip)
                textarea += _.formatText(info.desc.equip, 'green');
        }

        return textarea;

    }

    capFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    formatText(text, style) {
        let page = '';
        let parags = text.replace(/\r/gm, '').replace(/([^.:?!,])\s*\n/gm, '$1 ').split(/\n/);

        $.each(parags, function (i, p) {
            page += '<p' + (style ? ' class="' + style + '"' : '') + '>' + p + '</p>';
        });

        return page;
    }


/* *****************************************************************************
 * STATUS BAR
 */

    limitPrc(prc) {
        if(prc < 0)
            prc = 0;
        else if (prc > 100)
            prc = 100;

        return prc;
    }

    prcLowTxt(val, values){
        for(var i=0; i < values.length; ++i) {
            if(val <= values[i].val) {
                return values[i].txt;
            }
            return null;
        }
    }

    prcHighTxt(val, values){
        for(var i=0; i < values.length; ++i) {
            if(val >= values[i].val)
                return values[i].txt;
        }
        return null;
    }

    sendOOB(data) {
        let _ = this;
        if (!_.serverIsOnline) {
            return;
        }
        _.socket.emit('oob', data);
    }

    processCommands(text) {
        let _ = this;
        if (_.inGame) {
            let cmds = _.parseInput(text);

            if (cmds) {
                _.historyPush(text);
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
     * COMMAND HISTORY
     */

    updateInput() {
        let _ = this;
        var text = _.cmd_history[_.cmd_history_pos] ? _.cmd_history[_.cmd_history_pos] : '';
        $('#inputline').val(text).focus();
    }

    historyTop() {
        let _ = this;
        if (_.cmd_history_pos > 0) {
            _.cmd_history_pos = 0;
            updateInput();
        }
    }

    historyBottom() {
        let _ = this;
        if (_.cmd_history_pos < _.cmd_history.length) {
            _.cmd_history_pos = _.cmd_history.length;
            updateInput();
        }
    }

    historyUp() {
        let _ = this;
        if (_.cmd_history_pos > 0) {
            _.cmd_history_pos--;
            updateInput();
        }
    }

    historyDown() {
        let _ = this;
        if (_.cmd_history_pos < _.cmd_history.length) {
            _.cmd_history_pos++;
            updateInput();
        }
    }

    historyPush(text) {
        let _ = this;

        if (text.length > 0) {
            if (_.cmd_history.length >= _.max_history_length)
                _.cmd_history.shift();

            if (_.cmd_history.length == 0 || _.cmd_history[_.cmd_history.length - 1] != text)
            _.cmd_history.push(text);

            _.cmd_history_pos = _.cmd_history.length;

            $('#tgInputUser').val('');
        }

        return text;
    }

    sendToServer(text) {
        let _ = this;
        if (!_.serverIsOnline) {
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
        console.log(text);
        $('#output').append(text);
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
        $('.tg-main').addClass('d-flex');
        _.outputInit();
        _.keyboardMapInit();
        _.focusInput();
        _.mapInit();
        _.main();
        
    }

    /* -------------------------------------------------
     * OUTPUT
     * -------------------------------------------------*/

    outputInit() {
        $('#output').mCustomScrollbar();
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
            return true;
        });
    }


    /* -------------------------------------------------
     *  MAP 
     * -------------------------------------------------*/
    mapInit() {
        let _ = this;
        _.MiniMap = new Map();
        _.MiniMap.init();
        _.MiniMap.prepareCanvas();

    }

    sendInput() {
        this.processCommands($('#tgInputUser').val());
    }

    focusInput() {
        $('#tgInputUser').focus();
    }


    getTemplate(source, context) {
        let template = Handlebars.compile(source);
        let html = template(context);
        return html;
    }


    openPopup(id, done) {

        let _ = this;
        let MP_type = 'inline',
            MP_html = '<div class="tg-modal">Funzionalità non ancora implementata</div>',
            MP_callbacks = {};
        

        if(id) {
            MP_callbacks.close =  function(){
                done();
            };
            MP_callbacks.open = function(e) {
            };
        };

        // ==  Webclient , Alpa Version Alert
        if(id == 'alpha_version') {

            if(_.client_options.alpha_approved) {
                done();
                return;
            }

            MP_html = 'ajax/alphaModalAlert.html'
            MP_type = 'ajax';
            MP_callbacks.close = function() {
                _.client_options.alpha_approved = true;
                done();
            }
        }
        // ==  News
        if(id == 'news') {
        }



        // Open Modal / Popup
        $.magnificPopup.open({
            type: MP_type,
            items: {
                src: MP_html,
            },
            callbacks: MP_callbacks
        });
    }

    main() {}


}