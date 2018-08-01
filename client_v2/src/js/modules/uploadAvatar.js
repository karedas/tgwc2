import 'croppie'; 
export default class uploadAvatar {
    constructor(baseurl) {
        this.baseurl = baseurl;
        this.uploadCrop;
        this.options = {
            viewport: {
                width: 190,
                height: 156,
                type: 'square'
            },
            boundary: {
                width: 190,
                height: 156
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
        _.uploadCrop = $('#croppied').croppie(_.options);
        _.addEvents()
    }

    readFile(input) {
        let _ = this;
        return new Promise(resolve => {

            let _ = this;
            _.form = $(input).closest('form');
            if (input.files && input.files[0]) {
                let reader = new FileReader();

                reader.onload = function (e) {
                    $(_.form).addClass('ready');
                    _.uploadCrop.croppie('bind', {
                        url: e.target.result
                    }).then(function () {
                        // Get the first file only
                        let file = input.files[0]; // FileList object.
                        _.data = new FormData();
                        _.data.append('avatar', file);
                    });
                };

                reader.readAsDataURL(input.files[0]);
            }
        });
    }

    send(callback, done) {
        let _ = this;
        //TODO: Cambiare su Nginx il proxyreverse per la mappatura dell'url senza porta.
        // Send an HTTP POST request using the jquery
        $.post({
            enctype: 'multipart/form-data',
            url: _.baseurl + '/user/karedas',
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

    crop() {
        let _ = this;
        _.uploadCrop.croppie('result', {
            type: 'rawcanvas',
            size: 'viewport',
            format: 'png'
        }).then(function (canvas) {
            _.result({
                src: canvas.toDataURL()
            });
        });
    }

    result(result) {
        let _ = this;
        let html;

        if (result.src) {
            $('<img class="croppy-result" src="'+ result.src +'" />').prependTo('#croppied');
            _.uploadCrop.destroy();
        }
    }

    onUpload(callback) {
        let _ = this;
        return _.deferred.promise($(this));
    }
    
    
    addEvents() {
        let _ = this;

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
            _.crop();
        });

    }
}