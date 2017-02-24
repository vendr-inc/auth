/**
 * VoipController
 *
 * @description :: Server-side logic for managing Accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	token : function(req, res){

		var AccessToken = require('twilio').AccessToken;

		// Substitute your Twilio AccountSid and ApiKey details
		var ACCOUNT_SID = 'ACf2a6b1837b585b0a10259694beb74174';
		var API_KEY_SID = 'SK5778b44dc3d6981b051f6ac738a63164';
		var API_KEY_SECRET = 'oXhmdigzMWkior13sHcAuEWrkR1FD17B';

		// Create an Access Token
		var accessToken = new AccessToken(
		  ACCOUNT_SID,
		  API_KEY_SID,
		  API_KEY_SECRET
		);

		// Set the Identity of this token
		accessToken.identity = req.active_account.id;

		// Grant access to Conversations
		var grant = new AccessToken.ConversationsGrant();
		grant.configurationProfileSid = 'VS388228ae2f3875f9c8ed343a4dd9ab0a';
		accessToken.addGrant(grant);

		// Serialize the token as a JWT
		var jwt = accessToken.toJwt();
		console.log(jwt);

		return res.send(200, Response.success({token : accessToken.toJwt()}))
		}

	};

