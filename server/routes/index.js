var fs = require('fs'),
	path = require('path')

module.exports = function(logger, app, db, passport, mailer) {
	fs
		.readdirSync(__dirname)
		.filter(function(file) {
			return (file.indexOf('.') !== 0) && (file !== 'index.js')
		})
		.forEach(function(file) {
			require(path.join(__dirname, file))(logger, app, db, passport, mailer);
		});
}
