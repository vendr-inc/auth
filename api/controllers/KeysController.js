/**
 * KeysController
 *
 * @description :: Server-side logic for managing Keys
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	validate : function(req, res){

		Keys.findOne({key:req.headers["key"]}).exec(function(err, found){
			if(err) return res.send(200, Response.failure(err))
			if(!found) return res.send(200, Response.failure({msg:"That was an invalid key.", code:5000}))

			// ENABLE THIS LATER
			// if(Date.now() > Number(found.exp_time)) return res.send(200, Response.failure("This key has expired and is no longer valid."))

			Accounts.findOne({id:found.account_id}).exec(function(err, found){
				if(err) return res.send(200, Response.failure(err))
				if(!found) return res.send(200, Response.failure({msg:"There was no account found for this key.", code:5000}))
				if(found.active == 0) return res.send(200, Response.failure({msg:"This account has been disabled.", code:5000}))

				return res.send(200, Response.success({
					msg : "Valid key.",
					data : {
						user : found,
						exp_time : found.exp_time
						}
					}))
				})
			})
		},
	refresh : function(req, res){ 

		Keys.findOne({key:req.headers["key"]}).exec(function(err, found){
			if(err) return res.send(200, Response.failure(err))
			if(!found) return res.send(200, Response.failure({msg:"That was an invalid key.", code:5000}))
				
			Accounts.findOne({id:found.account_id}).exec(function(err, found){
				if(err) return res.send(200, Response.failure(err))
				if(!found) return res.send(200, Response.failure({msg: "There was no account found for this key.", code:5000} ))
				if(found.active == 0) return res.send(200, Response.failure({msg:"This account has been disabled.", code:5000}))

				var new_key = Token.auth_key(found.id);
				var new_time = Token.expiration();

				Keys.update({key:req.headers["key"]} , {exp_time:new_time, key:new_key}).exec(function(err,updated){
					
					if(err) return res.send(200, Response.failure(err))
					return res.send(200, Response.success({
						msg : "Key refreshed.",
						data : {
							auth_id : found.id,
							auth_key : new_key,
							exp_time : new_time
							}
						}))

					})
				})
			})
		}
	};

