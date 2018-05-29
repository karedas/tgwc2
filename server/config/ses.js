// expose our config directly to our application using module.exports
module.exports = {

	// accessKeyId is picked up from environment variable AWS_ACCESS_KEY_ID
	// secretAccessKey is picked up from environment variable AWS_SECRET_ACCESS_KEY
	'ses' : {
		'serviceUrl'		: 'https://email.eu-west-1.amazonaws.com',
		'accessKeyId'		: process.env.AWS_ACCESS_KEY_ID,
		'secretAccessKey'	: process.env.AWS_SECRET_ACCESS_KEY,
		'sender'			: 'The Gate Mud Staff <staff@thegatemud.it>'
	}
	
};
