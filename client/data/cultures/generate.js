#!/usr/bin/env node

var fs = require('fs');
var util = require('util');

if (!process.argv[2])
{
	throw new Error('No file specified');
}

fs.readFile(process.argv[2], { encoding: 'utf-8' }, function(err, content) {
	if (err) throw err;
	
	var cultRegex = /^\s*Cult\s+"(.*)+"\s*$/i;
	var raceRegex = /^\s*Razza\s+"(.*)"\s*$/i;
	
	
	var data = {};
	
	var currentCulture;
	content.split('\n').forEach(function (line) {
		
		var matchResult;
		if (matchResult = line.match(cultRegex))
		{
			var culture = matchResult[1];
			
			currentCulture = fs.existsSync(util.format('./%s.html', culture.replace(' ', ''))) ? culture : null;
			
			if (!currentCulture)
			{
				console.log("Cultura inesistente: %s", culture);
			}
		}
		else if (currentCulture && (matchResult = line.match(raceRegex)))
		{
			var race = matchResult[1];
			
			if (!data[race])
				data[race] = new Array();
			
			data[race].push({
				name:currentCulture,
				help_url:util.format("<%%= url_hash('data/cultures/%s.html') %%>", currentCulture.replace(' ', ''))
			});
		}
	});
	
	var dataAsJson = 
		'<%-\n'+
		'require "pathname"\n'+
		'require "./#{File.dirname(__FILE__)}/../../config/config"\n'+
		'require "./#{File.dirname(__FILE__)}/../../config/utils"\n'+
		'-%>\n'+
		JSON.stringify(data, null, '\t');
	
	fs.writeFile('./data.json', dataAsJson, function(err) {
		if (err) throw err;
		console.log("Cultures file generated!");
	});
});
