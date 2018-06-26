"use strict";
/*  TG 2.0 @2018
    Main Client Entry Point */
import TgClient from "modules/client.js";

(function(document, window) {
    $.ajaxSetup({ cache: true });
    function onReady() {
        console.log('client');
        let client = new TgClient();
        client.init();   

    };

    // TODO: Google Analytics
     
    $(document).ready(onReady);
    
}(document, window));