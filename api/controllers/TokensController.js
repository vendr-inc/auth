/**
 * TokensController
 *
 * @description :: Server-side logic for managing tokens generated for various things
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	"phone/send" : function(req, res){
		var data = {
			phone : { v:'phone' },
			// resend : { v:'boolean' , default : false }
			}

		data = Validator.run(data,req.body);
		if(data.failure) return res.send(200, data);

		Accounts.findOne({phone:data.phone}).exec(function(err,found){

			if(err) return res.send(200, Response.failure(err))
			if(found) return res.send(200, Response.failure("This phone number has already been registered."))

			Tokens.findOne({ data : data.phone , type : "phone/send" }).exec(function(err, found){
				if(err) return res.send(200, Response.failure(err))
				
				var token = found?found.token:Math.floor(Math.random() * 9000) + 1000

				var client = require('twilio')("ACdd27abf6914ae131ad2248a529eff4aa", "9e2f645e33b1ac624a84deea89cebcc6")

				client.messages.create({
					to : data.phone,
					from : "+14152149780",
					body : "Your Peoplr code is: " + token + ". Please use this code within 5 minutes to continue login."
					} , function(err, msg){
						
						if(err) return res.send(200, Response.failure("The code could not be sent."))

						if(found){
							Tokens.update({phone:data.phone,type:"phone/send"},{
								exp_time : Date.now() + (60*60*5),
								}).exec(function(err, created){
									if(err) return res.send(200, Response.failure(err))
									return res.send(200, Response.success("A code was sent to " + data.phone + "."))
									})
							}
						else{
							Tokens.create({
								type : "phone/send",
								token : token,
								data : data.phone,
								exp_time : Date.now() + (60*60*5),
								}).exec(function(err, created){
									if(err) return res.send(200, Response.failure(err))
									return res.send(200, Response.success("A code was sent to " + data.phone + "."))
									})
							}
						})
				})
			})
		}
	};

