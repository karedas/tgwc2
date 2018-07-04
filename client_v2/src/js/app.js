"use strict";
/*  TG 2.0 @2018
    Main Client Entry Point */
import TgClient from "modules/client.js";
import enquire from 'enquire-js';

(function(document, window) {
    $.ajaxSetup({ cache: true });

   // enable any bootstrap tooltip
    function onReady() {
        let client = new TgClient();
        client.init();   
        
        // Enquire Breakpoint/Viewport manager
        let vp = '';
        enquire.register("screen and (max-width:1450px)", {
            match : function() {
                client.setViewportSetup('lg');
            },      
            unmatch : function() {
                client.setViewportSetup('xl');
            },  
            setup : function() {},      
            destroy : function() {},    
            deferSetup: false
        });

    };    

    // TODO: Google Analytics
     
    
    $(document).ready(onReady);
    
    
}(document, window));