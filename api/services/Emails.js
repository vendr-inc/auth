module.exports = {

	send : function(obj){
		// give template name
		// give context
		// give subject

		
		var path = require('path')
		var EmailTemplate = require('email-templates').EmailTemplate
		var nodemailer = require('nodemailer')
		// var wellknown = require('nodemailer-wellknown')
		var async = require('async')

		var template = new EmailTemplate(path.join(__dirname, 'views', 'email', obj.template))
		// Prepare nodemailer transport object
		var transport = nodemailer.createTransport({
			service: 'gmail',
			secureConnection: false,
			auth: {
				user: 'contact@vendr.tech',
				pass: 'vendR321'
				}
			})

		// Send a single email
		template.render(obj.context, function (err, results) {
			if (err) {
				return console.error(err)
				}

			transport.sendMail({
				from: 'Vendr Registration <contact@vendr.tech>',
				to: obj.email,
				subject: obj.subject,
				html: results.html,
				text: results.text
				}, function (err, responseStatus) {
					if (err) {
						return console.error(err)
						}
					console.log(responseStatus.message)
					})
			})
		}
	}