module.exports = function(logger, app, db) {

	app.get('/api/characters',
		isLoggedIn,
		function (req, res) {
			var user = req.user;
			
			db.CharacterAccount
				.findAll({where: { AccountId: user.id }})
				.success(function (chars) {
					res.send(chars.map(function (char) {
						return { name:char.name, pgid:char.pgid, disab:char.disabled == true };
					}));
				})
				.failure(function (error) {
					res.send(500);
				});

		});

/*
	app.get('/api/characters/:pgid',
		isLoggedIn,
		function (req, res) {
			var user = req.user;
			var pgid = req.params.pgid;
			
			db.CharacterAccount
				.find({where:
					db.Sequelize.and(
						{ accountId: user.id },
						{ pgid: pgid }
				)})
				.success(function (char) {
					res.send(char.name);
				})
				.failure(function (error) {
					res.send(500);
				})
		});
*/

	// route middleware to make sure a user is logged in
	function isLoggedIn(req, res, next) {

		// if user is authenticated in the session, carry on 
		if (req.isAuthenticated())
			return next();
		
		// not authenticated, return 401
		res.send(401);
	}
}
