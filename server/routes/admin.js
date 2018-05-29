module.exports = function(logger, app, db, passport, mailer) {

	app.get('/admin/characters',
		function (req, res) {
			res.send(500);
		});


	app.get('/admin/accounts',
		function (req, res) {
			
			db.Account
				.findAll({
					include: [{ model: db.CharacterAccount, as: 'Characters', attributes: ['name','disabled'] }]
				})
				.success(function (results) {
					res.render('accounts.ejs', { accounts: results });
				})
				.failure(function (error) {
					res.send(500);
				});

		});

	app.get('/admin/accounts/:account_id',
		function (req, res) {
			var account_id = req.params.account_id;
			
			db.Account
				.find({
					where: { id: account_id },
					include: [{ model: db.CharacterAccount, as: 'Characters' }]
				})
				.success(function (account) {
					if (account)
					{
						res.render('account.ejs', {
							account: account
						});
					}
					else
					{
						res.send(404);
					}
				})
				.failure(function (error) {
					res.send(500);
				});
		});

	app.get('/admin/accounts/:account_id/newpassword',
		function (req, res) {
			var account_id = req.params.account_id;
			
			db.Account
				.find({
					where: { id: account_id }
				})
				.success(function (account) {
					if (account && account.hasLocal())
					{
						var password = db.Account.generatePassword();
						account.local_password = db.Account.generateHash(password);
						account.save().success(function (account) {

							mailer.send('newpassword', {
								to: account.local_email,
								subject: "The Gate MUD: nuova password di accesso",
								password: password
							}, function(error, response) {

								if (error)
								{
									logger.error("admin/accounts/newpassword: error sending email to %s (%d), address %s", account.name(), account.id, account.local_email);
									res.render('password_changed.ejs', { account: account, message: error });
								}
								else
								{
									logger.info("admin/accounts/newpassword: %s (%d) forced new password", account.name(), account.id);
									res.render('password_changed.ejs', { account: account, message: "La nuova password è stata inviata via email all'indirizzo dell'account." });
								}
							});

						}).failure(function (error) {
							res.send(500);
						});
					}
					else
					{
						res.render('password_changed.ejs', { account: account, message: 'Non esiste account locale' });
					}
				})
				.failure(function (error) {
					res.send(500);
				});
		});
	
	app.get('/admin/characters/:pgid',
		function (req, res) {
			var pgid = req.params.pgid;
			
			db.CharacterAccount
				.find(pgid)
				.success(function (character) {
					if (character)
					{
						res.render('character.ejs', {
							character: character
						});
					}
					else
					{
						res.send(404);
					}
				})
				.failure(function (error) {
					res.send(500);
				});
		});	
}
