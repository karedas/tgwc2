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
