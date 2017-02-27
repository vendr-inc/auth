/**
 * VoipController
 *
 * @description :: Server-side logic for managing Accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	incoming : function(req,res){

		// console.log("outgoing calls being connected")

		// var data = {
		// 	phone : { v:'phone' },
		// 	}

		// data = Validator.run(data,req.body);
		// if(data.failure) return res.send(200, data);


		var client = require('twilio')("ACf2a6b1837b585b0a10259694beb74174", "365aa491eda9c6e67ccf897400b32bc6")
	
		client.calls.create({
		    url: "http://demo.twilio.com/docs/voice.xml",
		    to: "voice_test",
		    // to: "+" + data.phone,
		    from: "quick_start"
			}, 

		function(err, call) {

			console.log(err)
			console.log(call)

			if(err) return res.send(200, Response.failure("Outgoing number not valid."))

			// return res.send(200, Response.success("Call placed"))

			// console.log(err)
			// console.log(call)


		    process.stdout.write(call.sid);
			});
		},

	outgoing : function(req, res){

		console.log("here")

		var twilio = require('twilio')
		
		var twiml = new twilio.TwimlResponse();
		twiml.say("Welcome to Vendr! We are connecting your call.");

		twiml.dial("+18054037831", {callerId: "+13103128690" })

		res.setHeader("content-type", "text/xml")

		res.send(200, twiml.toString())

		},
	token : function(req, res){

		console.log("getting token")

		var AccessToken = require('twilio').AccessToken;
		var vgrant = AccessToken.VoiceGrant;

		// Used when generating any kind of tokens
		var twilioAccountSid = 'ACf2a6b1837b585b0a10259694beb74174';
		var twilioApiKey = 'SK5778b44dc3d6981b051f6ac738a63164';
		var twilioApiSecret = 'oXhmdigzMWkior13sHcAuEWrkR1FD17B';

		// Used specifically for creating IP Messaging tokens
		var serviceSid = 'APd815d05ada1d681bbbc8b1fe26bd196f';

		// Create a "grant" which enables a client to use IPM as a given user,
		// on a given device
		var ipmGrant = new vgrant({
		    outgoingApplicationSid: serviceSid,
		    pushCredentialSid : 'CR90a7f722c817fddaa1b77b554dc657d8'
			});

		// Create an access token which we will sign and return to the client,
		// containing the grant we just created
		var token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret);
		token.addGrant(ipmGrant);
		token.identity = 'user';

		// Serialize the token to a JWT string
		console.log(token.toJwt());


		return res.send(200,token.toJwt())
		},
	masked : function(req, res){
		var client = require('twilio')("ACf2a6b1837b585b0a10259694beb74174", "365aa491eda9c6e67ccf897400b32bc6")

		var purchase = function (areaCode) {
		var phoneNumber;

		return client.availablePhoneNumbers('US').local.get({
			areaCode: areaCode,
			voiceEnabled: true,
			smsEnabled: true
			}).then(function(searchResults) {
				if (searchResults.availablePhoneNumbers.length === 0) {
				throw { message: 'No numbers found with that area code' };
				}

		return client.incomingPhoneNumbers.create({
			phoneNumber: searchResults.availablePhoneNumbers[0].phoneNumber,
			voiceApplicationSid: "APd815d05ada1d681bbbc8b1fe26bd196f",
			smsApplicationSid: "APd815d05ada1d681bbbc8b1fe26bd196f"
			});
			}).then(function(number) {
				return number.phone_number;
				});
			}

		}

	};

