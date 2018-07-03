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
            },      // OPTIONAL
                                        // If supplied, triggered when the media query transitions
                                        // *from an unmatched to a matched state*
        
            unmatch : function() {
                client.setViewportSetup('xl');
            },    // OPTIONAL
                                        // If supplied, triggered when the media query transitions
                                        // *from a matched state to an unmatched state*.
                                        // Also may be called when handler is unregistered (if destroy is not available)
        
            setup : function() {
            },      // OPTIONAL
                                        // If supplied, triggered once immediately upon registration of the handler
        
            destroy : function() {},    // OPTIONAL
                                        // If supplied, triggered when handler is unregistered. Place cleanup code here
            
            deferSetup: true
    
        });

    };    



    // TODO: Google Analytics
     
    
    $(document).ready(onReady);
    
    
}(document, window));