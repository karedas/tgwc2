import 'croppie'; 
export default class uploadAvatar {
    constructor() {
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
    }

    init() {
        let _ = this;
        _.addCropEvent()
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
                        _.data.append('fileName', file.name);
                        _.data.append('type', file.type);
                    });
                }

                reader.readAsDataURL(input.files[0]);
            }
        });
    }

    send(baseurl) {
        //TODO: Cambiare su Nginx il proxyreverse per la mappatura dell'url senza porta.
        // Send an HTTP POST request using the jquery
        let _ = this;
        console.log(_.data);
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
                console.log('success, send to socket avvenuto');
                resolve(x);
            }
        });

    }

    addCropEvent() {
        let _ = this;

        $('.uploadResult').on('click', function (ev) {
            _.uploadCrop.croppie('result', {
                type: 'canvas',
                size: 'viewport'
            }).then(function (resp) {
                console.log('then');
                //send to server 
                //socket.emit('image','image!');
            });
        });

    }
}