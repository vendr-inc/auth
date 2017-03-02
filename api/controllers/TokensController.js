/**
 * TokensController
 *
 * @description :: Server-side logic for managing tokens generated for various things
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	"phone/send" : function(req, res){
		var data = {
			phone : { v:'phone' }
			}

		data = Validator.run(data,req.body);
		if(data.failure) return res.send(200, data);

		Accounts.findOne({phone:data.phone}).exec(function(err,found){

			console.log(err)
			console.log(found)

			if(err) return res.send(200, Response.failure(err))


			if(found) return res.send(200, Response.failure("This phone number has already been registered."))

			Tokens.findOne({ data : data.phone , type : "phone/send" }).exec(function(err, found){
				if(err) return res.send(200, Response.failure(err))
				
				var token = Math.floor(Math.random() * 9000) + 1000

				var client = require('twilio')("ACf2a6b1837b585b0a10259694beb74174", "365aa491eda9c6e67ccf897400b32bc6")

				client.messages.create({
					to : data.phone,
					from : "+13103128690",
					body : "Your Vendr code is: " + token + ". Please use this code within 5 minutes to register your account successfully."
					} , function(err, msg){
						console.log(err)
						if(err) return res.send(200, Response.failure("The code could not be sent."))

						if(found){
							Tokens.update({data:data.phone,type:"phone/send"},{
								exp_time : Date.now() + (60*60*5*1000),
								token : token,
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
								exp_time : Date.now() + (60*60*5*1000),
								}).exec(function(err, created){
									if(err) return res.send(200, Response.failure(err))
									return res.send(200, Response.success("A code was sent to " + data.phone + "."))
									})
							}
						})
				})
			})
		},
	"phone/forgot" : function(req, res){
		var data = {
			phone : { v:'phone' }
			}

		data = Validator.run(data,req.body);
		if(data.failure) return res.send(200, data);

		Accounts.findOne({phone:data.phone}).exec(function(err,found){

			console.log(err)
			console.log(found)

			if(err) return res.send(200, Response.failure(err))
			if(!found) return res.send(200, Response.failure("This phone number was not found."))

			Tokens.findOne({ data : data.phone , type : "phone/forgot" }).exec(function(err, found){
				if(err) return res.send(200, Response.failure(err))
				
				var token = Math.floor(Math.random() * 9000) + 1000

				var client = require('twilio')("ACf2a6b1837b585b0a10259694beb74174", "365aa491eda9c6e67ccf897400b32bc6")

				client.messages.create({
					to : data.phone,
					from : "+13103128690",
					body : "Your reset password code from Vendr is: " + token + ". Please use this code within 5 minutes to reset your password."
					} , function(err, msg){
						console.log(err)
						if(err) return res.send(200, Response.failure("The code could not be sent."))

						if(found){
							Tokens.update({data:data.phone,type:"phone/forgot"},{
								exp_time : Date.now() + (60*60*5*1000),
								token : token,
								}).exec(function(err, created){
									if(err) return res.send(200, Response.failure(err))
									return res.send(200, Response.success("A code was sent to " + data.phone + "."))
									})
							}
						else{
							Tokens.create({
								type : "phone/forgot",
								token : token,
								data : data.phone,
								exp_time : Date.now() + (60*60*5*1000),
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

