"use strict";
/*  TG 2.0 @2018
    Main Client Entry Point */
import TgClient from "modules/client.js";
let debug = true;

(function(document, window) {
    $.ajaxSetup({ cache: true });
    Tg.onReady = function() {
        Tg.client = new TgClient({debug: debug});
        if (debug) {
            Tg.client.hideLoginPanel();
            Tg.client.loadInterface();
        } else {
            TG.client.init();   
        }     
    };
    $(document).ready(Tg.onReady);
}(document, window));