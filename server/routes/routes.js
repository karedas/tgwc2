
module.exports = function(app, passport) {

    // Route for showing the profile Page.
    app.get('profile', isLoggedIng, function(req, res) {

    });

    // FACEBOOK ROUTES ==================================
    app.get('/auth/facebook', passport.authenticate('facebook') {
        scope: ['public_profile', 'email']
    });

    // handle the callback after facebook has authenticate the user
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/profile', 
        failureRedirect : '/'
    }))

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
}


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if(req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}