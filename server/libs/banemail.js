// get templates
var fs = require('fs');
var path = require('path');
var util = require('util');

var defaultBannedFileName = path.resolve(__dirname, '..', 'bannedemails');

var bannedList = [];

module.exports.load = function(bannedFileName)
{
	try {
		var data = fs.readFileSync(bannedFileName ? bannedFileName : defaultBannedFileName);
		bannedList = data.toString().trim().split("\n").map(function (elem) {
			return elem.trim();
		});
		console.log(util.format("%d banned domains loaded", bannedList.length));
	} catch (err) {
		// Ignore the error (ex: missing file)
	}
}

module.exports.IsBanned = function(email)
{
	var emailDomain = (email.split('@')[1]).trim();
	
	var found = bannedList.some(function(bannedDomain) {
		if (emailDomain == bannedDomain)
			return true;
	});
	
	return found;
}
