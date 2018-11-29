"use strict"

/*  TG 2.0 @2018
    Main Client Entry Point */
    import enquire from 'enquire-js';
    import { TgGui } from "modules/client";
    import { CookieDisclaimer } from 'modules/cookie_disclaimer';
    import { setViewportReference } from 'modules/utility';
    
    const Client = new TgGui();


(function(document, window) {

    $.ajaxSetup({ cache: true });

   /* Enable any bootstrap tooltip */
    function onReady() {
        
        Client.init();

        /* Enquire Breakpoint/Viewport manager */
        // let last_options;
        /*== LG viewport */
        /*
        enquire.register("screen and (max-width:1450px)", {
            match : function() {
                setViewportReference('lg');
            },
            unmatch : function() {
                setViewportReference('xl');
            },  
            setup : function() {},
            destroy : function() {},
            deferSetup: false
        });

        /* Sm Viewport *//*
        enquire.register("screen and (max-width: 750px)", {
            match: function() {
                 last_options = {
                    extradetail_open : Client.client_options.extradetail_open
                }
                Client.client_options.extradetail_open = false;
                setViewportReference('sm');
            },
            unmatch: function() {
                Client.client_options.extradetail_open = last_options.extradetail_open;
            }
        })*/

    };    

    /* TODO: Google Analytics */
    
    $(document).ready(onReady);
    
    
}(document, window));