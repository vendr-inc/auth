/**
 * VoipController
 *
 * @description :: Server-side logic for managing Accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	connect : function(req, res){

		var data = {
			to : { v:'string' }
			}
		
		data = Validator.run(data, req.body)
		if(data.failure) return res.send(200,data)


		co(function*(){

			var to_account = yield Accounts.findOne({ id: data.to  })
			if(!to_account) return res.send(200, Response.failure("No account found"))

			var room = (((to_account.id).localCompare(req.active_account.id) == -1) ? to_account.id + "_" + req.active_account.id : req.active_account.id + "_" + to_account.id)

		console.log(room)

			
			sails.sockets.join(sails.sockets.getId() , room, function(err){

				if(err) return res.send(200, Response.failure(err))

				})
	
			}).catch(err => res.send(200,Response.failure(err)))


		},
	disconnect : function(req, res){

		var data = {
			to : { v:'string' }
			}
		
		data = Validator.run(data, req.body)
		if(data.failure) return res.send(200,data)


		co(function*(){

			var to_account = yield Accounts.findOne({ id: data.to  })
			if(!to_account) return res.send(200, Response.failure("No account found"))
		
			var room = (((to_account.id).localCompare(req.active_account.id) == -1) ? to_account.id + "_" + req.active_account.id : req.active_account.id + "_" + to_account.id)

		console.log(room)
			
			sails.sockets.leave(sails.sockets.getId() , room , function(err){

				if(err) return res.send(200, Response.failure(err))

				})
	
			}).catch(err => res.send(200,Response.failure(err)))


		}

	};

