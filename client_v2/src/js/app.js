"use strict";
/*  TG 2.0 @2018
    Main Client Entry Point */
import TgClient from "modules/client.js";
import enquire from 'enquire-js';

(function(document, window) {
    $.ajaxSetup({ cache: true });

   /* enable any bootstrap tooltip */
    function onReady() {

        let Client = new TgClient();

        if (Client.debug) {
            window.debugclient = Client;
        }

        /* Get Cookie "Italy cookie law". */
        let cookie_consent = Client.LoadStorage('cookie_consent');
        /* Check Cookie Law Approval Status, then go to start or wait user action. */
        if (!cookie_consent) {
            $.when(Client.showCookieLawDisclaimer()).done(function(){
                Client.startClient();
            });

        } else {
            Client.removeCookieLawDisclaimer();
            Client.startClient();
        }
        
        /* Enquire Breakpoint/Viewport manager */
        

        let last_options;
        /*== LG viewport */
        enquire.register("screen and (max-width:1450px)", {
            match : function() {
                Client.setViewportSetup('lg');
            },      
            unmatch : function() {
                Client.setViewportSetup('xl');
            },  
            setup : function() {},      
            destroy : function() {},    
            deferSetup: false
        });

        /* Sm Viewport */
        enquire.register("screen and (max-width: 750px)", {
            match: function() {
                 last_options = {
                    extradetail_open : Client.client_options.extradetail_open
                }
                Client.client_options.extradetail_open = false;
                Client.setViewportSetup('sm');
            },
            unmatch: function() {
                Client.client_options.extradetail_open = last_options.extradetail_open;
            }
        })

    };    

    /* TODO: Google Analytics */
    
    $(document).ready(onReady);
    
    
}(document, window));