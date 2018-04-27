var fs = require('fs'),
	path = require('path'),
	// lodash = require('lodash'),
	// Sequelize = require('sequelize'),
	db = {}
 
module.exports = function(opts)
{
	// var sequelize = new Sequelize('main','','', {
	// 	dialect: 'sqlite',
	// 	logging: opts && opts.logging ? opts.logging : false,
	// 	storage: opts && opts.storage ? opts.storage : './thegate.sqlite'
	// })

	// fs.readdirSync(__dirname)
	// 	.filter(function(file) {
	// 		return (file.indexOf('.') !== 0) && (file !== 'index.js')
	// 	})
	// 	.forEach(function(file) {
	// 		var model = sequelize.import(path.join(__dirname, file))
	// 		db[model.name] = model
	// 	});

	// Object.keys(db).forEach(function(modelName) {
	// 	if ('associate' in db[modelName]) {
	// 		db[modelName].associate(db)
	// 	}
	// });

	
	// return lodash.extend({
	// 	sequelize: sequelize,
	// 	Sequelize: Sequelize
	// }, db);
}
