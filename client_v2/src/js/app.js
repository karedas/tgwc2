"use strict";
/*  TG 2.0 @2018
    Main Client Entry Point */
import TgClient from "modules/client.js";

(function(document, window) {
    $.ajaxSetup({ cache: true });
    Tg.onReady = function() {
        Tg.client = new TgClient();
        Tg.client.init();   
    };
    $(document).ready(Tg.onReady);
}(document, window));