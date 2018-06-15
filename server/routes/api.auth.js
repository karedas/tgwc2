var validator = require('validator');
var util = require('util');
var banEmail = require('../libs/banemail');

banEmail.load();

module.exports = function(logger, app, db, passport, mailer) {

	// logout a user

	app.delete('/api/login',
		function (req, res) {
			var user = req.user;

			if (user)
				logger.info("logout: %s (%d) logged out", user.name(), user.id);

			req.logout();
			res.json({status:"ok"});
		});

	// Change local password
	app.put('/api/local/login',
		isLoggedIn,
		function (req, res) {
			var user = req.user;
			var password = req.body.password;

			if (!db.Account.validPassword(password))
			{
				res.send(400);
			}
			else if (!user.hasLocal())
			{
				res.send(401);
			}
			else
			{
				user.local_password = db.Account.generateHash(password);
				
				user.save().success(function (user) {
					logger.info("local/login: %s (%d) changed password", user.name(), user.id);
					res.json({status:"ok"});
				}).failure(function (error) {
					res.send(500);
				});
			}
		});


	// login an existing local user
	app.post('/api/local/login',
		passport.authenticate('local-login'),
		function (req, res) {
			var user = req.user;

			logger.info("local/login: %s (%d) logged in", user.name(), user.id);

			var user = req.user;
			
			res.json({
				status:"ok", 
				user: {
					name: user.name(),
					email: user.email(),
					has_facebook: user.hasFacebook(),
					has_local: user.hasLocal()
				}});
		});


	function send_email_and_response(user, res){
		// Send the email containing the token
		var clientLink = app.get('client_url');
		var verificationLink = util.format("%s?token=%s",
						app.get('client_url'),
						user.local_token);

		mailer.send('registration', {
			to: user.local_email,
			subject: "The Gate MUD: richiesta di creazione account",
			verificationLink: verificationLink,
			clientLink: clientLink
		}, function(error, response) {

			if (error)
			{
				logger.error("send_email_and_response: error sending email to %s from ip %s, %s", user.local_email, user.local_ip_request, error);
				res.json(503, { status:"error", message: 'Errore di invio'});
			}
			else
			{
				logger.info("send_email_and_response: email sent to %s from ip %s, %s", user.local_email, user.local_ip_request, response.messageId);
				res.json({status:"ok"});
			}
		});
	}


	// send a creation request
	app.post('/api/local/request',
		function (req, res) {

			var ip = req.ip;
			var email = req.body.email;
			if (!validator.isEmail(email) || banEmail.IsBanned(email))
			{
				res.json(400, { status:"error", message: 'Email non valida'});
				return;
			}

			// Check if there are too many unverified requests from the same ip address
			db.Account.count({ where: db.Sequelize.and(
				{ local_verified: false },
				{ local_ip_request: ip }
			)}).success(function (count) {

				var max_requests = req.app.get('max_requests_per_ip');

				if (max_requests != null && count >= max_requests)
				{
					logger.error("local/request: too many requests from ip %s, email %s", ip, email);
					res.send(403);
				}
				else
				{
					
					// check if the same email is already registered for local account
					db.Account.find({ where: { local_email: email }}).success(function (user) {
						
						// if found a user, this is a double registration
						if (user)
						{
							logger.error("local/request: email %s has duplicate local user %s (%d)", email, user.name(), user.id);
							
							res.json(409, { status:"error", message: 'Email già registrata'});
							return;
						}


						// now we must look for a facebook account with the same email and no local account
						// or create a new account

						db.Account.find({ where: { facebook_email: email }}).success(function (user) {
							
							if (user)
							{
								// found a facebook user with the same email
								
								// if is also local, return an error
								if (user.local_email || user.disabled)
								{
									logger.error("local/request: email %s has duplicate facebook user %s (%d)", email, user.name(), user.id);
									
									res.json(409, { status:"error", message: 'Email già registrata'});
									return;
								}

								// no user found, create a new one
								var token = db.Account.generateToken();
								
								user.local_email = email;
								user.local_token = token;
								user.local_verified = false;
								user.local_ip_request = ip;
								
								user.save().success(function (user) {

									// asynchronous
									process.nextTick(function() {
										send_email_and_response(user, res);
									});
									
								}).failure(function (error) {
									res.send(500);
								});
							}
							else
							{
								// no user found, create a new one
								var token = db.Account.generateToken();

								// create a new account and return the user
								db.Account.create({
									local_email: email,
									local_token: token,
									local_verified: false,
									local_ip_request: ip,
									disabled: false
								}).success(function (user) {

									// asynchronous
									process.nextTick(function() {
										send_email_and_response(user, res);
									});
									
								}).failure(function (error) {
									res.send(500);
								});

							}
							
						}).failure(function (error) {
							res.send(500);
						});

					}).failure(function (error) {
						res.send(500);
					});
				}
					
			}).error(function (error) {
				res.send(500);
			});
		});

	// enable local user using token
	app.post('/api/local/verify',
		passport.authenticate('local-signup-verification'),
		function (req, res) {
			var user = req.user;
			res.json({
				status:"ok", 
				user: {
					name: user.name(),
					email: user.email(),
					has_facebook: user.hasFacebook(),
					has_local: user.hasLocal()
				}});
		});

	app.get('/api/local/token/:token',
		function (req, res) {
			var token = req.params.token;
			if (token)
			{
				db.Account.find({ where: { local_token: token }}).success(function (user) {

					if (user && !user.local_verified)
					{
						res.json({status:"ok", email:user.local_email});
					}
					else
					{
						res.json(404,{ status:'error', message:'Token non trovato' });
					}
				}).failure(function (error) {
					res.send(500);
				});
			}
			else
			{
				res.json(400, { status:"error", message: 'Token non valido'});
			}
		});

	// link local
	app.post('/api/local/link',
		isLoggedIn,
		function (req, res) {

			var ip = req.ip;
			var user = req.user;
			var email = req.body.email;
			
			if (!validator.isEmail(email))
			{
				res.json(400, { status:"error", message: 'Email non valida'});
				return;
			}
		
			// check if the same local email is already registered
			db.Account.find({ where: { local_email: email }}).success(function (founduser) {

				// if found a user, this is a double registration
				if (founduser)
				{
					res.json(409, { status:"error", message: 'Email già registrata'});
					return;					
				}


				// check if the same email is already registered for facebook
				db.Account.find({ where: { facebook_email: email }}).success(function (founduser) {

					// if found a user but is not the same logged, forbid it
					if (founduser && user.id != founduser.id)
					{
						res.json(409, { status:"error", message: 'Email già registrata'});
						return;
					}

					// create a new token
					var token = db.Account.generateToken();
					
					user.local_email = email;
					user.local_token = token;
					user.local_verified = false;
					user.local_ip_request = ip;
					
					user.save().success(function (user) {

						// asynchronous
						process.nextTick(function() {
							send_email_and_response(user, res);
						});
						
					}).failure(function (error) {
						res.send(500);
					});

				}).error(function (error) {
					res.send(500);
				})
			}).error(function (error) {
				res.send(500);
			})
		});
	
	// unlink a local user from the account
	/*
	app.delete('/api/local/link',
		isLoggedIn,
		function (req, res) {			
			var user = req.user;
			if (user.canUnlink())
			{
				user.local_email = null;
				user.local_password = null;
				user.local_name = null;
				user.local_token = null;
				user.local_verified = false;
				
				user.save().success(function (user) {
					res.json({status:"ok"});
				}).failure(function (error) {
					res.send(500);
				});
			}
			else
			{
				res.send(409);
			}
		});
	*/


	function facebookLoginOk(req, res) {
		var user = req.user;
		res.json({
			status:"ok", 
			user: {
				name: user.name(),
				email: user.email(),
				has_facebook: user.hasFacebook(),
				has_local: user.hasLocal()
			}});
	}

	// FACEBOOK CANVAS
	
	// login/create a facebook account
	app.post('/api/facebook-canvas/login',
		passport.authenticate('facebook-canvas-token'),
		facebookLoginOk);

	// update a facebook account
	app.put('/api/facebook-canvas/login',
		passport.authorize('facebook-canvas-token-update'),
		function (req, res) {
			res.json({status:"ok"});
		});


	// FACEBOOK CONNECT

	// login/create a facebook account
	app.post('/api/facebook/login',
		passport.authenticate('facebook-token'),
		facebookLoginOk);

	// update a facebook account
	app.put('/api/facebook/login',
		passport.authorize('facebook-token-update'),
		function (req, res) {
			res.json({status:"ok"});
		});

	// connect an existing account with facebook
	app.post('/api/facebook/link',
		isLoggedIn,
		passport.authorize('facebook-token'),
		function (req, res) {
			res.json({status:"ok"});
		});

	
	app.get('/api/profile',
		isLoggedIn,
		function (req, res) {
			var user = req.user;
			
			res.json({
				status:"ok", 
				user: {
					name: user.name(),
					email: user.email(),
					has_facebook: user.hasFacebook(),
					has_local: user.hasLocal()
				}});
		});


	// route middleware to make sure a user is logged in
	function isLoggedIn(req, res, next) {

		// if user is authenticated in the session, carry on 
		if (req.isAuthenticated())
			return next();
		
		// not authenticated, return 401
		res.sendStatus(401);
	}
	
}
