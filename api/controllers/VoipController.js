/**
 * VoipController
 *
 * @description :: Server-side logic for managing Accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	outgoing : function(req,res){
		var client = require('twilio')("ACf2a6b1837b585b0a10259694beb74174", "365aa491eda9c6e67ccf897400b32bc6")
	
		client.calls.create({
		    url: "http://demo.twilio.com/docs/voice.xml",
		    to: "+18054037831",
		    from: "+13103128690"
			}, 

		function(err, call) {
		    process.stdout.write(call.sid);
			});
		}

	};

