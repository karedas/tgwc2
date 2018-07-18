// Shorthand for $( document ).ready()
$(function() {

    let socket = io.connect('192.168.10.10:3333', {
        'reconnection': false,
        'autoConnect:': true,
        'forceNew': true,
        'resource':'socket.io/',
        'transports': ['websocket']
    });
    
    
    
        let $uploadCrop;
        function readFile(input) {
            if (input.files && input.files[0]) {
               var reader = new FileReader();
               
               reader.onload = function (e) {
                   $('.croppertest').addClass('ready');
                   $uploadCrop.croppie('bind', {
                       url: e.target.result
                   }).then(function(){
                       console.log('jQuery bind complete');
    
                         // Get the first file only
                            var file = input.files[0]; // FileList object.
    
                            var data = new FormData();
                            data.append('file', file);
                            data.append('fileName', file.name);
                            data.append('type', file.type);
    
                            // Send an HTTP POST request using the jquery
                            $.ajax({
                                url: 'upload',
                                data: data,
                                processData: false,
                                contentType: false,
                                type: 'POST',
                                success: function(data){
                                console.log('Image uploaded!');
                                }
                            });
    
                   });
                   
               }
               
               reader.readAsDataURL(input.files[0]);
           }
       }
    
       $uploadCrop = $('#croppied').croppie({
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
       });
    
       $('#testUpload').on('change', function () { readFile(this); });
       $('.upload-result').on('click', function (ev) {
           $uploadCrop.croppie('result', {
               type: 'canvas',
               size: 'viewport'
           }).then(function (resp) {
                //send to server 
                socket.emit('image','image!');
           });
       });

});
