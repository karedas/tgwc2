import 'croppie'; 
export default class uploadAvatar {
    constructor(baseurl) {
        this.baseurl = baseurl;
        this.uploadCrop;
        this.options = {
            viewport: {
                width: 250,
                height: 200,
                type: 'square'
            },
            boundary: {
                width: 250,
                height: 200
            },
            enableExif: true
        }
        this.data = null;
        this.form = null;
        this.deferred = null;
    }

    init() {
        let _ = this;
        _.deferred = new $.Deferred;
        _.addEvents()
    }

    readFile(input) {

        return new Promise(resolve => {

            let _ = this;
            _.form = $(input).closest('form');
            if (input.files && input.files[0]) {
                let reader = new FileReader();

                reader.onload = function (e) {
                    $(_.form).addClass('ready');
                    _.uploadCrop = $('#croppied').croppie(_.options);
                    _.uploadCrop.croppie('bind', {
                        url: e.target.result
                    }).then(function () {
                        console.log('jQuery bind complete');
                        // Get the first file only
                        let file = input.files[0]; // FileList object.

                        _.data = new FormData();
                        _.data.append('avatar', file);
                    });
                }

                reader.readAsDataURL(input.files[0]);
            }
        });
    }

    send(baseurl, callback, done) {
        //TODO: Cambiare su Nginx il proxyreverse per la mappatura dell'url senza porta.
        // Send an HTTP POST request using the jquery
        let _ = this;
        $.post({
            enctype: 'multipart/form-data',
            url: baseurl + '/user/karedas',
            data: _.data,
            processData: false,
            cache: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                //TODO: NEED SOCKET HERE
                _.deferred.resolve();
            }
        });
    }

    onUpload(callback) {
        let _ = this;
        return _.deferred.promise($(this));
    }
    
    addEvents() {
        $('.uploadResult').on('click', function (ev) {
            _.croppie('result', {
                type: 'canvas',
                size: 'viewport'
            });
        });

        $('#playerImgFile').on('change', function (e) {
            _.readFile(this);
        });

        /* Upload Image */
        $('#formUplAvatar').on('submit', function (e) {
            e.preventDefault();
            _.send();
        });

    }
}