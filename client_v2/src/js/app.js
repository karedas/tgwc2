"use strict";

/*  TG 2.0 @2018
    Main Client Entry Point */

import client from "modules/client.js";

(function(document, window) {
    
    $.ajaxSetup({ cache: true });

    TG.onReady = function() {
        TG.Client = new client();
        TG.Client.init();        
    };

    $(document).ready(TG.onReady);

}(document, window));