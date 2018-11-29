import Cookies from 'js-cookie';
import Modernizr from "modernizr";


export class SessionStorage {

    constructor () {
        this.cookies = {
            prefix: 'tgwc_',
            expires: 365 * 10
        };
    }

    setup(client_state) {

        let _ = this;
        // Load State
        let saved_state = Cookies.getJSON(_.cookies.prefix + 'state');
    
        if (Modernizr.localstorage && saved_state) {
            this.save('state', saved_state);
            Cookies.set(_.cookies.prefix + 'state', null);
        } else {
            saved_state = this.load('state');
        }
        if (saved_state) {
            $.extend(client_state, saved_state);
        }
        if (!client_state.when) {
            client_state.when = new Date().getTime();
            this.save('state', client_state);
        }
    
        // Load Options
        let saved_options = Cookies.getJSON(_.cookies.prefix + 'options');
        if (Modernizr.localstorage && saved_options) {
            this.save('options', saved_options);
            Cookies.set(_.cookies.prefix + 'options', null);
        } else {
            saved_options = this.load('options');
        }
    
        if (saved_options) {
            $.extend(_.client_options, saved_options);
        }
    }
    
    load(what) {
    
        what = this.cookies.prefix + what;
    
        if (Modernizr.localstorage) {
            let data = localStorage[what];
            return data ? JSON.parse(data) : null;
        } else {
            return Cookies.get(what);
        }
    }
    
    save(what, value) {
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
}

