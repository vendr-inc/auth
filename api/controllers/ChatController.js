/**
 * VoipController
 *
 * @description :: Server-side logic for managing Accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	connect : function(req, res){

		console.log(sails.sockets.id(req.socket))

		}

	};

