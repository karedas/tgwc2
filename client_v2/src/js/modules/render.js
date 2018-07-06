export default class Renders {
    constructor() {}
    
    genericPage(page) {
        let _ = this;
        let html = '<div class="tg-title lt-red">' + page.title + '</div><div class="text">' + page.text.replace(/\n/gm, '<br>') + '</div>';
        if (page.title == 'Notizie') {
            _.openPopup('notizie', "Notizie dal gioco", html);
        } else {
            //TODO: Page parse generic 
            console.log('!page todo');
        }
    }

    
    mob(icon, condprc, count, mrn, desc, addclass) {
        return '<div class="mob">' + this.renderIcon(icon, mrn, 'room', null, null, addclass) + '<div class="desc">' + _.decoratedDescription(condprc, null, null, count, desc) + '</div></div>'
    }
    
    object(icon, condprc, count, mrn, desc, addclass) {
        return '<div class="obj">' + _.renderIcon(icon, mrn, 'room', null, null, addclass) + '<div class="desc">' + _.decoratedDescription(condprc, null, null, count, desc) + '</div></div>'
    }

    description(condprc, moveprc, wgt, count, desc) {
        let _ = this;
        let countStr = '';

        if (count > 1) {
            countStr = '&#160;<span class="cnt">[x' + count + ']</span>';
        }
        return _.renderMinidetails(condprc, moveprc, wgt) + desc.replace(/\n/gm, ' ') + countStr;
    }

    minidetails(condprc, moveprc, wgt) {
        let pos = -11 * Math.floor(22 * (100 - condprc) / 100);
        return '<div class="hstat" style="background-position:0 ' + pos + 'px" data-condprc="' + condprc + '"' + (moveprc ? ' data-moveprc="' + moveprc  + '"': '') + (wgt != null ? ' wgt="' + wgt + '"' : '') + '></div>';
    }
}