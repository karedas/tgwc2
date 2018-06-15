// //NPM Modules
import Cookies from 'js-cookie';
import Modernizr from "modernizr";

// import 'malihu-custom-scrollbar-plugin';
// import lodash from  'lodash';
// //My Modules
// import {input_history} from 'modules/input_history';
export default class TgGui {

    constructor() {


        this.isConnected = false;

        this.ws_server_addr = '';
        this.socket_io_resource = '';
        this.media_server_addr = '';
        this.ws_prefix = '/';
        this.image_path = '';
        this.sounds_path = '';

        /* Cookies Settings */
        this.cookies = {
            prefix: 'tgwc',
            expires: 365 * 10
        }

        /* Login */
        this.facebokoAppAuth = {
            clientId: '',
            loginURL: '',
            linkURL: ''
        }

        this.client_state = {};

        /* UI Game Options */
        this.client_options = {};

        //         this.notification = {
        //             unread: 0,
        //             originalTitle: document.title,
        //             focused: true,
        //             favico: null
        //         };

        this.debug = false;
    }

    init() {
        console.log('init');
        let _ = this;


        // Waiting any dependencenies, server status and resources before init connection.
        this.beforeStart().then(result => {
            _.startClient();
        }).catch(err => {
            console.log(err);
        });

    }

    // List of all mandatory dependencies before init  
    beforeStart() {

        let _ = this;

        return new Promise(resolve => {

            // Get Cookie "Italy cookie law"
            let cookie_consent = _.loadUserSessionData('cookie_consent');

            // Check Cookie Law Approval Status, then go to start or wait user action.
            if (!cookie_consent) {
                $('#cookieconsentbutton').on('click', function () {
                    _.saveUserSessionData('cookie_consent', true);
                    $('#cookielawdisclaimer').remove();
                    // Cookie Law approved = Start the Client
                    resolve();
                })
            } else {
                resolve();
            }
        });
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
        // Load State
        let saved_state = Cookies.getJSON(_.cookies.prefix + 'state');

        if (Modernizr.localstorage && saved_state) {
            _.saveUserSessionData('state', saved_state);
            Cookies.set(_.cookies.prefix + 'state', null);
        } 

        else {
            saved_state = _.loadUserSessionData('state')
        }

        if (saved_state) {
            $.extend(_.client_state, saved_state);
        }

        if (!_.client_state.when) {
            _.client_state.when = new Date().getTime();
            _.saveUserSessionData('state', _.client_state);
        }

        // Load Options
        let saved_options = Cookies.getJSON(_.cookies.prefix + 'options');

        if (Modernizr.localstorage && saved_options) {
            _.saveUserSessionData('options', saved_options);
            Cookies(cookies.prefix + 'options', null);
        }
        else {
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
            return Cookies(what);
        }
    }

    saveUserSessionData(what, value) {
        let _ = this;
        what = _.cookies.prefix + what;
        if (Modernizr.localstorage) {
            localStorage[what] = JSON.stringify(value);
        } else {
            Cookies(what, value, {
                'expires': _.cookies.expires,
                'path': _.cookies.path
            });
        }
    }
    
    startClient() {
        
        let _ = this;
        
        _.initSessionData();
        //await Facebook SDK before end.
        $.when(_.loadFacebookSDK(), _.loadAssets()).done(function(){
            console.log('facebook sdk and assets Loaded');
        });

    }


    // Load Assets List from relative filename
    loadAssets() {
        return new Promise(resolve => {
            setTimeout(resolve, 500, "value1");
        });
    }


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

    //     async loadAssets() {
    //         console.log('loadAssets');
    //         return;
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