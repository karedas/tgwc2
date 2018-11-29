export default class FacebookSDK{
    
    constructor () {
    this.facebokoAppAuth = {
            clientId: '',
            loginURL: '',
            linkURL: ''
        };
    }

    load() {
        
        let _ = this;

        return $.getScript('https://connect.facebook.net/it_IT/sdk.js', function () {
            FB.init({
                appId: _.facebokoAppAuth.clientId,
                status: true,
                cookie: false,
                loggin: false,
                version: 'v2.7',
                xfbml: true
            });
            // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
            // for any authentication related change, such as login, logout or session refresh. This means that
            // whenever someone who was previously logged out tries to log in again, the correct case below 
            // will be handled.
            FB.Event.subscribe('auth.authResponseChange', function (response) {
                // Here we specify what we do with the response anytime this event occurs. 
                if (response.status === 'connected') {
                    // The response object is returned with a status field that lets the app know the current
                    // login status of the person. In this case, we're handling the situation where they 
                    // have logged in to the app.
                    let newToken = response.authResponse.accessToken;

                    if (initialized) {
                        if (facebookToken) {
                            facebookAccountUpdate(newToken);
                        } else {
                            doFacebookLogin(response.authResponse.accessToken);
                        }
                    }

                    facebookToken = newToken;
                } else if (response.status === 'not_authorized') {
                    // In this case, the person is logged into Facebook, but not into the app
                    facebookToken = null;
                } else {
                    // In this case, the person is not logged into Facebook. Note that at this stage there
                    // is no indication of whether they are logged into the app.
                    facebookToken = null;
                }
            });

            $('#loginbutton,#feedbutton').removeAttr('disabled');
        });

    }
}