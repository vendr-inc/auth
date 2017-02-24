/**
 * VoipController
 *
 * @description :: Server-side logic for managing Accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	connect : function(req, res){

		sails.sockets.broadcast('message', { greeting: 'Hola!' });


		},
	subscribeToFunRoom: function(req, res) {
		// if (!req.isSocket) {
		// 	return res.badRequest();
		// 	}

		// var roomName = req.param('roomName');
		// 	sails.sockets.join(req, roomName, function(err) {
		// 	if (err) {
		// 	return res.serverError(err);
		// 	}

		// return res.json({
		// 	message: 'Subscribed to a fun room called '+roomName+'!'
		// 	});
		// 	});
		}

	};

