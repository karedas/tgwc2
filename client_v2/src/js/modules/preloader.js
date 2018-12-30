export default class Preloader {
    constructor(assets, basepath) {
        this.basepath = basepath;
        this.assetsList = assets;
    }

    init() {
        let _ = this;

        return new Promise(function (resolve, reject) {
            if (!_.assetsList) {
                reject('TG Error: Assets List mancante');
            }

            $('body').attr('data-loginstatus', 'preload');

            _.loadAssets().done(function (images) {
                // All Images loaded
                $('#tgPreloader').remove();
                resolve();
            });
        });
    }

    loadAssets() {
        let _ = this;
        let percentage = 0;
        let stepSize = 100 / _.assetsList.length;


        let images = [],
            loadedimages = 0,
            postaction = function () {},
            assets = (typeof _.assetsList != "object") ? [_.assetsList] : _.assetsList;

            percentage = Math.floor(percentage + stepSize);


        function imageloadpost() {

            if (loadedimages == assets.length - 1) {
                percentage = 100;
            }
            $('#tgPreloader').find('span').text(percentage);
            $('.pbar').css('width', percentage + '%');

            loadedimages++;

            if (loadedimages == assets.length) {
                postaction(images) //call postaction and pass in newimages array as parameter
            }

            percentage = percentage > 100 ? 100 : percentage;
            $('#tgPreloader').find('span').text(percentage);
        }
        
        for (let i = 0; i < assets.length; i++) {
            images[i] = new Image();
            images[i].src = _.basepath + assets[i];
            images[i].onload = function () {
                percentage++;
                imageloadpost();
            }
            images[i].onerror = function () {
                percentage++;
                imageloadpost();
            }
        }

        return { //return blank object with done() method
            done: function (f) {
                postaction = f || postaction //remember user defined callback functions to be called when images load
            }
        }
    }


    /* Complete list of fun random phrases that will be shown during the preload */
    // randomizeFunnyText(count) {
    //     let phrases = [
    //         'Prima Frase',
    //         '2 Frase',
    //         '3 Frase',
    //         '4 Frase',
    //         '5 Frase',
    //         '6 Frase',
    //         '7 Frase',
    //         '8 Frase'
    //     ];

    //     let m = phrases.length, 
    //         t, i;
    //     // While there remain elements to shuffle…
    //     while (m) {
    //         // Pick a remaining element
    //         i = Math.floor(Math.random() * m--);
    //         // And swap it with the current element.
    //         t = array[m];
    //         phrases[m] = phrases[i];
    //         phrases[i] = t;
    //     }

    //     let candidatePhrases = phrases.slice.slice(0, 4);
    //     console.log(candidatePhrases);
    // }
}