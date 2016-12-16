module.exports = {

	email : function(obj){
		var nodemailer = require('nodemailer');

	    // create reusable transporter object using SMTP transport
	    var transporter = nodemailer.createTransport({
	        service: 'Gmail',
	        auth: {
	            user: 'aamir@peoplr.tech',
	            pass: 'appWin23'
	    	    }
	    	});

	    var data = (obj.data?obj.data:obj);
	    if(!data.from) data.from = 'The Peoplr Team <no-reply@peoplr.tech>'
	    if(!data.to) return console.log(error);

		transporter.sendMail(data, function(err,info){
			console.log((err?err:"Message sent: " + info.response))
			})
		}

	}