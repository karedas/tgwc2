import { SessionStorage } from 'session';

export const CookieLawDisclaimer = {

    constructor(){
        this.src = './ajax/cookielawAlert.html';
    },

    load() {
        return $.ajax(this.src, {
            success: (response) => { this.open }
        });
    },

    open(response) {

        let _ = this;

        $('body').append(response);

        $('#tgCookieLaw').jqxWindow({
            minWidth: '100%',
            width: '100%',
            height: 'auto',
            resizable: false,
            draggable: false,
            isModal: true,
            keyboardCloseKey: 'none',
            animationType: 'fade',
            modalOpacity: 1,
        }).on('open', () => {
            this.onChange();
        })
    },

    onChange() {
    
        let def = $.Deferred();


    
        $(document).on('change', '#cookieCheckbox', function () {
            $('#cookieconsentbutton')
                .toggleClass('invisible')
                .one('click', function () {
                    _.SaveStorage('cookie_consent', true);
                    _.closeAllPopups();
                    //Done deferred back
                    def.resolve();
                });
        });

        return def;
    },

    remove() {
        $('.tg-cookielawcontent').remove();
    }
}



