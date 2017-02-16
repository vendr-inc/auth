/**
 * KeysController
 *
 * @description :: Server-side logic for managing Keys
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	validate : function(req, res){

		return res.send(200, Response.success({
			msg : "Valid key.",
			data : {
				user : req.active_account,
				exp_time : req.active_account.exp_time
				}
			}))

		},
	refresh : function(req, res){ 

		var new_key = Token.auth_key(req.active_account.id);
		var new_time = Token.expiration();

		Keys.update({key:req.headers["key"]} , {exp_time:new_time, key:new_key}).exec(function(err,updated){
			
			if(err) return res.send(200, Response.failure(err))
			return res.send(200, Response.success({
				msg : "Key refreshed.",
				data : {
					auth_id : req.active_account.id,
					auth_key : new_key,
					exp_time : new_time
					}
				}))

			})
		
		}
	};

