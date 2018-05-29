// load the strategies
const LocalStrategy = require('passport-local').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');

// load the auth variables
const configAuth = require('./auth');


// expose this function to our app using module.exports
module.exports = function(logger, passport, db) {

    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
		db.Account.find(id).complete(done);
	});
	
	// signup: verify a new local user by email and token
	passport.use('local-signup-verification', new LocalStrategy({
			usernameField : 'email',
			passwordField : 'token',
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		function(req, email, token, done) {

			var password = req.body.password;
			var name = req.body.name;

			// asynchronous
			process.nextTick(function() {

				if (!db.Account.validPassword(password))
					return done(null, false, { message: 'Password non valida'});

				if (!db.Account.validName(name))
					return done(null, false, { message: 'Nome non valido'});


				// look up the email
				db.Account.find({ where: { local_email: email }}).success(function (user) {

					// no user found
					if (!user)
					{
						logger.error("passport/local-signup-verification: email %s not found", email);
						return done(null, false, { message: 'Utente non trovato'});
					}
					
					// user is already valid
					if (user.local_verified)
					{
						logger.error("passport/local-signup-verification: email %s already verified", email);
						return done(null, false, { message: 'Utente già confermato'});
					}
					
					// wrong token
					if (user.local_token != token)
					{
						logger.error("passport/local-signup-verification: email %s supplied wrong token '%s', expected '%s'", email, token, user.local_token);
						return done(null, false, { message: 'Conferma errata'});
					}
					
					user.local_password = db.Account.generateHash(password);
					user.local_name = name;
					user.local_verified = true;
					user.local_token = null;

					logger.info("passport/local-signup-verification: creating account for email %s with name %s", email, name);

					user.save().complete(done);

				}).error(function (error) {
					return done(error);
				})
			})
		})
	);

	// login: authenticate an existing local user by email an password
	// the user must exist in the db (created at signup)
	// no new account is created if not existing
    passport.use('local-login', new LocalStrategy({
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		function(req, email, password, done) {

			// asynchronous
			process.nextTick(function() {

				// look up the email
				db.Account.find({ where: { local_email: email }}).success(function (user) {

					// no user found
					if (!user)
						return done(null, false, { message: 'Utente non trovato'});

					// wrong password
					if (!user.correctPassword(password))
					{
						logger.error("passport/local-login: incorrect password for user %s (%d) from ip %s", user.name(), user.id, req.ip);
						return done(null, false, { message: 'Password errata'});
					}
					
					// check if can login (not disabled and validated)
					if (!user.canLoginLocal())
					{
						logger.error("passport/local-login: disabled user %s (%d) from ip %s", user.name(), user.id, req.ip);
						return done(null, false, { message: 'Utente non abilitato'});
					}
					
					// ok, return the user
					return done(null, user);

				}).error(function (error) {
					return done(error);
				})
			});
		})
    );



	function facebookUpdate(req, accessToken, unusedRefreshToken, profile, done) {

		// asynchronous
		process.nextTick(function() {

			if (req.user)
			{
				// get the logged user
				var user = req.user;

				// Check if the id is the same
				if (user.facebook_canvas_id != profile.id && user.facebook_app_id != profile.id)
				{
					logger.error("passport/facebook-update: update request from user %s (%d), id %d unknown", user.name(), user.id, profile.id);
					return done(null, false, { message: 'Utente non autenticato'});
				}

				// associate facebook to the current user				
				user.facebook_token = accessToken;

				logger.info("passport/facebook-update: updating user %s (%d) with id %s", user.name(), user.id, profile.id);

				// save and return the user
				user.save().complete(done);
			}
			else
			{
				logger.warn("passport/facebook-update: update request from unathenticated user with id", profile.id);
				return done(null, false, { message: 'Utente non autenticato'});
			}
		});
	}


	// facebook update: update the token associated with a user
	passport.use('facebook-token-update', new FacebookTokenStrategy({
			// Facebook App ID
			clientID: configAuth.facebookAppAuth.clientID,
			
			// Facebook App secret
			clientSecret: configAuth.facebookAppAuth.clientSecret,
			
			// Send app proof
			enableProof: true,
			
			// allows us to pass back the entire request to the callback
			passReqToCallback : true 
		},
		facebookUpdate)
	);


	// facebook update: update the token associated with a user
	passport.use('facebook-canvas-token-update', new FacebookTokenStrategy({
			// Facebook App ID
			clientID: configAuth.facebookCanvasAuth.clientID,
			
			// Facebook App secret
			clientSecret: configAuth.facebookCanvasAuth.clientSecret,
			
			// Send app proof
			enableProof: true,
			
			// allows us to pass back the entire request to the callback
			passReqToCallback : true 
		},
		facebookUpdate)
	);


	function facebookCanvasAuth(req, accessToken, unusedRefreshToken, profile, done) {
		return facebookAuth(req, accessToken, unusedRefreshToken, profile, 'canvas', done);
	}

	function facebookAppAuth(req, accessToken, unusedRefreshToken, profile, done) {
		return facebookAuth(req, accessToken, unusedRefreshToken, profile, 'app', done);
	}

	function facebookAuth(req, accessToken, unusedRefreshToken, profile, context, done) {

		// asynchronous
		process.nextTick(function() {

			// if we are here, user has successfully logged into facebook
			// facebook does not use refresh token

			// If no user, this is a login/create, else it is a link to account
			if (!req.user)
			{
				// create / login
				

				// Use the correct where condition
				var where_condition;
				if (context == 'canvas')
					where_condition = { facebook_canvas_id: profile.id };
				else
					where_condition = { facebook_app_id: profile.id }
					

				// look for a user with the same id
				db.Account.find({ where: where_condition}).success(function (user) {

					if (user)
					{
						// check if can login
						if (!user.canLoginFacebook())
						{
							logger.error("passport/facebook-token: disabled user %s (%d) from ip %s", user.name(), user.id, req.ip);
							return done(null, false, { message: 'Utente non abilitato'});
						}

						// found, update the token and return the user
						user.facebook_token = accessToken;
						user.facebook_email = profile.emails[0].value;
						user.facebook_name = profile.displayName;

						logger.warn("passport/facebook-token: login and update user %s (%d) with facebook user %s and email %s (%s)", user.name(), user.id, profile.id, user.facebook_email, user.facebook_name);

						// save and return the user
						user.save().complete(done);
					}
					else
					{
						// no user found, need to create one or associate
						
						
						// look up the emails
						var emails = profile.emails.map(function (email) { return email.value });
						
						if (emails.length == 0)
							return done(null, false, { message: 'Nessuna email presente' });
						
						db.Account.findAll({ where: db.Sequelize.or({ local_email: emails }, { facebook_email: emails })}).success(function (results) {

							if (results.length == 1)
							{
								// found a user with the same email
								// update the user with the facebook data (link)
								
								var user = results[0];
								
								if (context == 'canvas')
									user.facebook_canvas_id = profile.id;
								else
									user.facebook_app_id = profile.id;

								user.facebook_token = accessToken;
								user.facebook_email = profile.emails[0].value;
								user.facebook_name = profile.displayName;

								logger.error("passport/facebook-token: associating local user %s (%d) with facebook user %s and email %s (%s)", user.name(), user.id, profile.id, user.facebook_email, user.facebook_name);

								// save and return the user
								user.save().complete(done);
							}
							else if (results.length > 1)
							{
								logger.error("passport/facebook-token: too many local users with emails %j", emails);									
								
								// found a local user with the same email
								return done(null, false, { message: 'Email già in uso'});
							}
							else
							{
								// No resultrs, create a new one
								var user = {
									facebook_token: accessToken,
									facebook_email: profile.emails[0].value,
									facebook_name: profile.displayName,
								};

								if (context == 'canvas')
									user.facebook_canvas_id = profile.id;
								else
									user.facebook_app_id = profile.id;

								
								logger.info("passport/facebook-token: creating facebook user %s and email %s (%s)", profile.id, user.facebook_email, user.facebook_name);
								
								// no local user found, save as a new user
								db.Account.create(user).complete(done);
							}
						}).error(done);
					}
				}).error(done);
			}
			else
			{
				// already logged in, so this is a link
				
				// get the logged user
				var user = req.user;

				// associate facebook to the current user				
				if (context == 'canvas')
					user.facebook_canvas_id = profile.id;
				else
					user.facebook_app_id = profile.id;

				user.facebook_token = accessToken;
				user.facebook_email = profile.emails[0].value;
				user.facebook_name = profile.displayName;

				logger.warn("passport/facebook-token: associating user %s (%d) with facebook user %s and email %s (%s)", user.name(), user.id, profile.id, user.facebook_email, user.facebook_name);

				// save and return the user
				user.save().complete(done);
			}
		})
	}


	// facebook signup and login: lookup for a user with the specified facebook id
	// if not found, create a new account
	passport.use('facebook-token', new FacebookTokenStrategy({
			// Facebook App ID
			clientID: configAuth.facebookAppAuth.clientID,
			
			// Facebook App secret
			clientSecret: configAuth.facebookAppAuth.clientSecret,

			// Send app proof
			enableProof: true,
			
			// allows us to pass back the entire request to the callback
			passReqToCallback : true 
		},
		facebookAppAuth)
	);


	// facebook signup and login: lookup for a user with the specified facebook id
	// if not found, create a new account
	passport.use('facebook-canvas-token', new FacebookTokenStrategy({
			// Facebook App ID
			clientID: configAuth.facebookCanvasAuth.clientID,
			
			// Facebook App secret
			clientSecret: configAuth.facebookCanvasAuth.clientSecret,

			// Send app proof
			enableProof: true,
			
			// allows us to pass back the entire request to the callback
			passReqToCallback : true 
		},
		facebookCanvasAuth)
	);
};
