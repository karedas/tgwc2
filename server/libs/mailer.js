// load nodemailer
var nodemailer = require('nodemailer');

// get config
var config = require('../config/ses');

// get templates
var path = require('path');
var templatesDir = path.resolve(__dirname, '..', 'views/mailer');
var emailTemplates = require('email-templates');


// transport
var transport = nodemailer.createTransport("SES", {
	AWSAccessKeyID: config.ses.accessKeyId,
	AWSSecretKey: config.ses.secretAccessKey,
	ServiceUrl: config.ses.serviceUrl
});

var EmailAddressRequiredError = new Error('email address required');
var EmailSubjectRequiredError = new Error('email subject required');

module.exports.send = function(templateName, locals, callback)
{
	// make sure that we have an user email
	if (!locals.to) {
		return callback(EmailAddressRequiredError);
	}

	// make sure that we have a message
	if (!locals.subject) {
		return callback(EmailSubjectRequiredError);
	}

	emailTemplates(templatesDir, function (err, template) {

		if (err) {
			return callback(err);
		}

		// Send a single email
		template(templateName, locals, function (err, html, text) {

			if (err) {
				return callback(err);
			}

			transport.sendMail({
				from: config.ses.sender,
				to: locals.to,
				subject: locals.subject,
				html: html,
				text: text
			}, callback);
		});
	});
}
