/* Print log in Goole Chrome Tool'  */
export function clog(msg) {
    console.log(`TGLog: ${msg}`);
}


export let Viewport = {
    viewport : 'md',

    get className() {
        return this.viewport;
    },

    set className(vp) {
        let el = document.getElementsByClassName('tg-area');
        el.setAttribute('data-viewport', vp);
    }
}



