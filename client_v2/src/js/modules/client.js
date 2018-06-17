// //NPM Modules
import Cookies from 'js-cookie';
import io from 'socket.io-client';
import Modernizr from "modernizr";
import assetsList from 'assets_list.json';

// import 'malihu-custom-scrollbar-plugin';
// import lodash from  'lodash';
// //My Modules
// import {input_history} from 'modules/input_history';
export default class TgGui {

    constructor() {

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
        this.facebokoAppAuth = {
            clientId: '',
            loginURL: '',
            linkURL: ''
        };

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
        
        _.connectToServer().then(function(resolve){
            _.enableLoginPanel();
        })
        .catch(function(error){
            //Connection error
        });
    }

    connectToServer() {
        let _ = this;
        return new Promise(function(resolve, reject){
            _.socket = io.connect(_.ws_server_addr, {
                'reconnect': false,
                'force new connection':true,
                'resource': _.socket_io_resource,
            });
    
            _.socket.on('connect', function(){
                _.socket.on('data', _.handleLoginData.bind(_));
                _.loginNetworkActivityMessage("Server Online", 'up');
                _.setConnect();
                resolve();
            });
    
            _.socket.on('disconnect', function(){
                _.networkActivityMessage("Disconnesso dal server");
            });
            _.socket.on('connect_error', function(e){
                if(_.isConnected){
                    _.networkActivityMessage("Connessione chiusa");
                }
                else {
                    _.loginNetworkActivityMessage("Il server di gioco è offline.");
                }
                reject();
            });
        });
    }

    setConnect() {
        this.isConnected = true;
    }

    checkConnectionStatus() {
        return this.isConnected;
    }

    showCookieLawDisclaimer() {
        let _ = this;
        $('#cookielawdisclaimer').show();
        $('#cookieconsentbutton').on('click', function () {
            _.saveUserSessionData('cookie_consent', true);
            $('#cookielawdisclaimer').remove();
            // Cookie Law approved = Start the Client
            _.startClient();
        });
    }

    preloadClient() {
        let _ = this;

        let percentage = 0;
        let stepSize = 100 / assetsList.length;
        $('#tgPreloader').show().find('span').text(percentage);

        let images = [];

        return new Promise(function(resolve, reject){
            for (let i = 0; assetsList.length > i; i++) {
                let img = new Image ();
                img.onload = function() {
                    percentage =percentage + stepSize;
                    $('#tgPreloader span').text( Math.round(percentage));
                    
                    $('#tgPreloader')
                    $(window).trigger('tgassetsload--step');

                    if(assetsList.length - 1 == i) {
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

    enableLoginPanel() {

        let _ = this;

        $('.tg-loginform').show();
        
                
        $('#loginPanel').on('submit', function(e){

            e.preventDefault();
  
            let name = $('#login_username').val();
            let pass = $('#login_password').val();
            
            if(!name || !pass) {
                //Notify user to provide credentials
                return;
            }
            
            _.connectionInfo.loginName = name;
            _.connectionInfo.loginPass = pass;
            _.connectionInfo.mode = "login";
            
            _.networkActivityMessage("Connessione in corso...");
            // Get Cookie "Italy cookie law"
            let cookie_consent = _.loadUserSessionData('cookie_consent');
            // Check Cookie Law Approval Status, then go to start or wait user action.
            if (!cookie_consent) {
                _.showCookieLawDisclaimer();
                // TODO se ok, allora send oob;
                setTimeout(function(){performLogin();},1500);
            } 
            else {
                _.performLogin();
            }
        });
    }

    performLogin() {
        let _ = this;
        if (_.connectionInfo.mode == 'login'){
            _.sendToServer("login:" + _.connectionInfo.loginName + "," + _.connectionInfo.loginPass+"\n");
        }
    }

    loginErrorClean() {
        _.connectionInfo.error = null;
    }

    loginError(msg) {
        this.connectionInfo.error = msg;
        this.networkActivityMessage(msg);
    }

    loginNetworkActivityMessage(msg, dataname) {
        $('#tgServerStatus').text(msg).attr('data-status', dataname);
    }

    networkActivityMessage(msg) {
        //$('#tgServerStatus').text(msg);
    }

    startClient() {
        let _ = this;
        //await Facebook SDK before end.
        _.loadFacebookSDK();
    }

    loadFacebookSDK() {

        let _ = this;

        return $.getScript('https://connect.facebook.net/it_IT/sdk.js', function () {
            FB.init({
                appId: _.facebokoAppAuth.clientId,
                status: true,
                cookie: false,
                loggin: false,
                version: 'v2.7',
                xfbml: true
            });
            // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
            // for any authentication related change, such as login, logout or session refresh. This means that
            // whenever someone who was previously logged out tries to log in again, the correct case below 
            // will be handled.
            FB.Event.subscribe('auth.authResponseChange', function (response) {
                // Here we specify what we do with the response anytime this event occurs. 
                if (response.status === 'connected') {
                    // The response object is returned with a status field that lets the app know the current
                    // login status of the person. In this case, we're handling the situation where they 
                    // have logged in to the app.
                    let newToken = response.authResponse.accessToken;

                    if (initialized) {
                        if (facebookToken) {
                            facebookAccountUpdate(newToken);
                        } else {
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
            });

            $('#loginbutton,#feedbutton').removeAttr('disabled');
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

    // Load Assets List from relative filename
    loadAssets(imageArray) {
        
    }

    handleLoginData(data){
        let _ = this; 

        if(data.indexOf("&!connmsg{") == 0) {
            let end = data.indexOf('}!');
            let rep = $.parseJSON(data.slice(9, end+1));
            
            if(rep.msg) {
                switch(rep.msg) {
                    case 'ready':
                        _.serverIsOnline = true;
                        break;
    
                    case 'enterlogin':
                        console.log('enterlogin');
                        _.performLogin();
                        break;
    
                    case 'shutdown':
                        console.log('shutdown');
                        _.networkActivityMessage('Attenzione, il server sarà spento entro breve per manutenzione.');
                        performLogin();
                        break;
    
                    case 'reboot':
                        console.log('reboot');
                        _.networkActivityMessage('Attenzione, il server sarà riavviato entro breve.');
                        performLogin();
                        break;
    
                    case 'created':
                    case 'loginok':
                        // Preload client then start the magic
                        _.preloadClient().then(function(resolve, reject) {
                            _.hideLoginPanel();
                            _.completeHandshake();
                            _.handleServerData(data.slice(end+2));
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
                        if(!connectionError)
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
        _.socket.on('data', _.handleServerData);
    }

    handleServerData(msg) {
        let _ = this;
        
        _.netdata += msg;
        let len = _.netdata.length;

        if(_.netdata.indexOf("&!!", len-3) !== -1 ) {

            let data = _.preparseText(_.netdata.substr(0, len - 3));

            try {
                _.showOutput(_.parseForDisplay(data));
            } catch(err) {
                console.log(err.message);
            }

            _.netdata = '';

            let now = Date.now();
        }
        else if ( len > 200000 ) {
            _.showOutput('<br>Errore di comunicazione con il server!<br>');
            _.netdata = '';
            _.setDisconnect();
        }
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
            pas;

        // Hide text (password)
	    //msg = msg.replace(/&x\n*/gm, function() {
		//inputPassword();
        //return '';
        //});

        // Show Text (normal input)
        msg = msg.replace(/&e\n*/gm, function() {
            _.inputText();
            return '';
	    });
        
    }

    sendOOB(data){	
        let _ = this;
         if (! _.isConnected) {
             return;
         }
        _.socket.emit('oob', data);
    }

    sendToServer(text) {
        let _ = this;
        if(!_.isConnected) {
            return;
        }
        _.socket.emit('data', text);
    }

    getLoginReplyMessage(what) {
        let login_reply_message = {
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

        return login_reply_message[what];
    }

    /*enableLoginPanel() {
        let _ = this;
        console.log('enableLoginPanel');

        // Normal Login
        $('#tgLoginBtn').click(function() {

        });

        $('#tgFacebookLoginBtn').click(function(){});

        // New Character Creation 
        $('#tgNewCharactherRegistration').click(function(){

        });
    }*/

    //         // Event when client finishes loading
    //         // if ("Notification" in window) {
    //         //     Notification.requestPermission();
    //         // }

    //         //waiting any dependencenies and resources before init connection.
    //         console.log('init');
    //         this.beforeStart().then(result => {
    //             // got final result

    //             console.log('ok');

    //             // this.checkOptions();
    //             // this.initHandshake();
    //             // this.addDOMEvents();

    //         }).catch(err => {
    //            console.log(err);
    //         });
    //     }



    //     checkOptions() {
    //         // DEBUG STATUS
    //         if(this.options.debug) {
    //             $('body').append('<div id="debug"/>');
    //             console.log("%c Attenzione, i LOG client sono attivi.", 'background: red; color: white');
    //         }
    //     }


    //     initHandshake() {

    //         let _ = this;
    //          // This is safe to call, it will always only
    //         // initialize once.
    //         Evennia.init();
    //         // register listeners
    //         Evennia.emitter.on("text", this.onText.bind(_));
    //         Evennia.emitter.on("prompt", this.onPrompt.bind(_));
    //         Evennia.emitter.on("default", this.onDefault.bind(_));
    //         Evennia.emitter.on("connection_close", this.onConnectionClose.bind(_));
    //         Evennia.emitter.on("logged_in", this.onLoggedIn.bind(_));
    //         Evennia.emitter.on("webclient_options", this.onGotOptions.bind(_));
    //         // silence currently unused events
    //         Evennia.emitter.on("connection_open", this.onSilence.bind(_));
    //         Evennia.emitter.on("connection_error", this.onSilence.bind(_));

    //         // set an idle timer to send idle every 3 minutes,
    //         // to avoid proxy servers timing out on us
    //         setInterval(function () {
    //                 // Connect to server
    //                 Evennia.msg("text", ["idle"], {});
    //             },
    //             60000 * 3
    //         );
    //     }

    //     // Ask the user if he wants to reconnect
    //     reconnect() {
    //         return false;
    //     }
    //     //Performing connection to server via auto or manual request.
    //     connectToServer() {
    //         Evennia.connect();
    //         return;
    //     }

    //     // Handle text coming from the server
    //     onText(args, kwargs) {

    //         console.log('onText');
    //         let _ = this;
    //         // append message to previous ones, then scroll so latest is at
    //         // the bottom. Send 'cls' kwarg to modify the output class.
    //         let renderto = "main";
    //         console.log('kwargs', kwargs);
    //         if (kwargs["type"] == "help") {
    //             if (("helppopup" in options) && (options["helppopup"])) {
    //                 renderto = "#helpdialog";
    //             }
    //         }

    //         if (renderto == "main") {
    //             let mwin = $("#outputfield");
    //             let cls = lodash.isEmpty(kwargs) ? 'out' : kwargs['cls'];
    //             mwin.append("<div class='" + cls + "'>" + args[0] + "</div>");
    //             mwin.animate({
    //                 scrollTop: document.getElementById("outputfield").scrollHeight
    //             }, 0);

    //             this.onNewLine(args[0], null);

    //         } else {
    //             console.log('TODO: openPopup(renderto, args[0])')
    //             // openPopup(renderto, args[0]);
    //         }
    //     }

    //     onPrompt() {
    //         console.log('onPrompt')
    //     }

    //     onDefault() {
    //         console.log('onDefault')
    //     }

    //     onConnectionClose() {
    //         console.log('onConnectionClose')
    //     }

    //     onLoggedIn() {
    //         console.log('onLoggedIn')
    //     }

    //     onGotOptions() {
    //         console.log('onGotOptions')
    //     }

    //     // Silences events we don't do anything with.
    //     onSilence(cmdname, args, kwargs) {}

    //     // New line insert event (coming from user or server).
    //     onNewLine(text, originator) {
    //         console.log('onNewLine');
    //         let _ = this; 
    //         // Changes unfocused browser tab title to number of unread messages
    //         // unread++;
    //         // favico.badge(unread);
    //         // document.title = "(" + unread + ") " + originalTitle;
    //         // if (!_.notification.focused) {
    //             // Changes unfocused browser tab title to number of unread messages
    //             // _.notification.unread++;
    //             //   favico.badge(unread);
    //             // document.title = "(" + unread + ") " + originalTitle;
    //             // if ("Notification" in window) {
    //             //     if (("notification_popup" in options) && (options["notification_popup"])) {
    //             //         Notification.requestPermission().then(function (result) {
    //             //             console.log('TODO Here');
    //             //             //     if(result === "granted") {
    //             //             //     var title = originalTitle === "" ? "Evennia" : originalTitle;
    //             //             //     var options = {
    //             //             //         body: text.replace(/(<([^>]+)>)/ig,""),
    //             //             //         icon: "/static/website/images/evennia_logo.png"
    //             //             //     }

    //             //             //     var n = new Notification(title, options);
    //             //             //     n.onclick = function(e) {
    //             //             //         e.preventDefault();
    //             //             //          window.focus();
    //             //             //          this.close();
    //             //             //     }
    //             //             //   }
    //             //         });
    //             //     }
    //             //     if (("notification_sound" in options) && (options["notification_sound"])) {
    //             //         console.log('TODO Here (audio/sound?)');

    //             //         // var audio = new Audio("/static/webclient/media/notification.wav");
    //             //         // audio.play();
    //             //     }
    //             // }
    //         // }
    //     }

    //     // Grab text from inputline and send to Server
    //     doSendText() {
    //         if(!Evennia.isConnected()) {
    //             if(reconnect()) {
    //                 //Making a connection if the user does not have one.
    //                 this.onText(['Riconnessione in corso..."'], {cls: "sys"});
    //                 this.connectToServer();

    //             };
    //             return ;
    //         };

    //         let inputfield = $('#inputfield');
    //         let outtext = inputfield.val();
    //         let lines = outtext.trim().replace(/[\r]+/,"\n").replace(/[\n]+/, "\n").split("\n");

    //         for(var i = 0; i < lines.length; i++) {
    //             let line = lines[i].trim();
    //             if(line.length > 7 && line.substr(0,7) == '##send') {
    //                 // send a specific oob instruction ["cmdname",[args],{kwargs}]
    //                 line = line.slice(7);
    //                 let cmdarr = JSON.parse(line);
    //                 let cmdname = cmdarr[0];
    //                 let args = cmdarr[1];
    //                 let kwargs = cmdarr[2];

    //                 console.log(cmdarr);
    //                 log(cmdname, args, kwargs);
    //                 Evennia.msg(cmdname, args, kwargs);
    //             }
    //             else {
    //                 input_history.add(line);
    //                 inputfield.val('');
    //                 Evennia.msg("text", [line], {});
    //             }
    //         }

    //     }

    //     // doOpenOptions() {}


    //     onKeyPress(event) {
    //         console.log('onKeyPress');        
    //     }

    //     // catch all keyboard input, handle special chars
    //     onKeyDown(event) {

    //         console.log('onKeyDown');
    //         let _ = this;
    //         let code = event.which;
    //         let history_entry = null;
    //         let inputfield = $('#inputfield');

    //         inputfield.focus();
    //         // enter key sends text
    //         if (code === 13 ) {
    //             this.doSendText();
    //             event.preventDefault();
    //         }
    //         else if (inputfield[0].selectionStart == inputfield.val().length) {
    //             // Only process up/down arrow if cursor is at the end of the line.    
    //             if(code === 30) {

    //             }
    //             else if (code === 40) {
    //                 history_entry = input_history.fwd();
    //             }
    //         }
    //         // escape key
    //         if (code === 27 ) {}

    //     }

    //     toggleNavbarPosition() {
    //        $('#tgNavbar').toggleClass('order-2');
    //     }

    //     // It Applies option base on data-option attribute setted on trigger element
    //     toggleClientOption() {
    //         //TODO: we need to store option every triggering
    //        let option = $(this).attr('data-option');
    //        if (option != '') {
    //            option = 'op-' + option;
    //        }

    //        $('body').toggleClass(option);
    //     }

    //     addDOMEvents() {

    //         let _ = this;

    //         // Pressing the send button
    //         $("#inputsend").on("click", this.doSendText.bind(_));
    //          // Event when any key is pressed
    //         $(document).keydown(this.onKeyDown.bind(_));

    //         /* NavBar events */
    //         $('#toggleNavbarPosition').on('click', this.toggleNavbarPosition);

    //         $('.tg-trigger-option').on('click', this.toggleClientOption);

    //     }

    //     // Appends any kind of message inside Debug Output box
    //     tglog(msg) {
    //         if (msg) {
    //             $('#debug').append('DEBUG MSG: ' + msg);
    //         }
    //     }
}