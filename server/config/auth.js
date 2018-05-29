// expose our config directly to our application using module.exports
module.exports = {

	'facebookCanvasAuth' : {
		'clientID' 		: process.env.FACEBOOK_CANVAS_ID,
		'clientSecret' 	: process.env.FACEBOOK_CANVAS_SECRET
	},

	'facebookAppAuth' : {
		'clientID' 		: process.env.FACEBOOK_APP_ID,
		'clientSecret' 	: process.env.FACEBOOK_APP_SECRET
	}
	
};
