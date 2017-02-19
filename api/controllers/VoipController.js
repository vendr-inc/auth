/**
 * VoipController
 *
 * @description :: Server-side logic for managing Accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	outgoing : function(req,res){
		var data = {
			phone : { v:'phone' },
			}

		data = Validator.run(data,req.body);
		if(data.failure) return res.send(200, data);


		var client = require('twilio')("ACf2a6b1837b585b0a10259694beb74174", "365aa491eda9c6e67ccf897400b32bc6")
	
		client.calls.create({
		    url: "http://demo.twilio.com/docs/voice.xml",
		    to: "+" + data.phone,
		    from: "+13103128690"
			}, 

		function(err, call) {

			if(err) return res.send(200, Response.failure("Outgoing number not valid."))

			return res.send(200, Response.success("Call placed"))

			console.log(err)
			console.log(call)


		    process.stdout.write(call.sid);
			});
		},
	incoming : function(req, res){

		var twilio = require('twilio');

		var twiml = new twilio.TwimlResponse();
		twiml.say("Hello from your pals at Twilio! Have fun.");

		resp.dial("+18054037831")

		res.setHeader("content-type", "text/xml")

		res.send(200, twiml.toString())

		},
	token : function(req, res){
		var AccessToken = require('twilio').AccessToken;
		var IpMessagingGrant = AccessToken.VoiceGrant;

		// Used when generating any kind of tokens
		var twilioAccountSid = 'ACf2a6b1837b585b0a10259694beb74174';
		var twilioApiKey = 'SK5778b44dc3d6981b051f6ac738a63164';
		var twilioApiSecret = 'oXhmdigzMWkior13sHcAuEWrkR1FD17B';

		// Used specifically for creating IP Messaging tokens
		var serviceSid = 'APd815d05ada1d681bbbc8b1fe26bd196f';
		var appName = 'Vendr Inc.';
		var identity = 'aamir@vendr.tech';
		var deviceId = 'someiosdeviceid';
		var endpointId = appName + ':' + identity + ':' + deviceId;

		// Create a "grant" which enables a client to use IPM as a given user,
		// on a given device
		var ipmGrant = new VoiceGrant({
		    serviceSid: serviceSid,
		    endpointId: endpointId
			});

		// Create an access token which we will sign and return to the client,
		// containing the grant we just created
		var token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret);
		token.addGrant(ipmGrant);
		token.identity = identity;

		// Serialize the token to a JWT string
		console.log(token.toJwt());


		return res.send(200,Response.success(token.toJwt()))
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

