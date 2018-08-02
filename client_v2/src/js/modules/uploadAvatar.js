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
        this.form = '#formUplAvatar';
        this.deferred = null;
    }

    init() {
        let _ = this;
        _.deferred = new $.Deferred;
        _.uploadCrop = _.createCroppie();
        _.addEvents()
    }

    createCroppie() {
        return $('#croppied').croppie(this.options);
    }

    destroyCroppie() {
        this.uploadCrop.croppie('destroy');
    }

    readFile(input) {
        let _ = this;

        if(!$('#croppied').data('croppie')) {
            $('.croppy-result').remove();
            _.uploadCrop = _.createCroppie();
        }

        return new Promise(resolve => {
            let _ = this;
            if (input.files && input.files[0]) {
                let reader = new FileReader();

                reader.onload = function (e) {
                    $(_.form).addClass('ready');
                    _.uploadCrop.croppie('bind', {
                        url: e.target.result
                    })
                    /*.then(function (a) {
                        // Get the first file only
                        let file = input.files[0]; // FileList object.
                        _.data = new FormData();
                    });*/
                    
                };

                reader.readAsDataURL(input.files[0]);
            }
        });
    }

    crop() {
        let _ = this;
        _.uploadCrop.croppie('result', {
            type: 'rawcanvas',
            size: 'viewport',
            
        }).then(function (result) {
            _.result({
                src: result.toDataURL()
            });
        });
        
    }

    result(result) {
        let _ = this;
        let html;
        _.data = result.src;
        if (result.src) {
            $(_.form).toggleClass('ready sendable');
            $('<img class="croppy-result" src="'+ result.src +'" />').prependTo('#croppied');
            _.destroyCroppie();
        }
    }

    
    send(callback, done) {
        let _ = this;


        _.data = _.data.replace('data:image/png;base64,','');
        console.log(_.data);
        //TODO: Cambiare su Nginx il proxyreverse per la mappatura dell'url senza porta.
        // Send an HTTP POST request using the jquery
        $.ajax({
            enctype: 'multipart/form-data',
            url: _.baseurl + '/user/karedas',
            data: JSON.stringify({  "avatar": _.data}),
            processData: false,
            cache: false,
            contentType: "application/json",
            dataType: 'json',
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
        $('#cropAvatar').on('click', function(e){
            e.preventDefault();
            _.crop();
        })
        
        $(_.form).on('submit', function (e) {
            e.preventDefault();
            _.send();
        });

    }
}