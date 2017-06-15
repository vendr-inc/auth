	/**
 * AccoutnsController
 *
 * @description :: Server-side logic for managing Accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	"email/get" : function(req,res){
		var data = {
			id : { v:'string' }
			}
		
		data = Validator.run(data, req.body)
		if(data.failure) return res.send(200,data)

		co(function*(){

			var account = yield Accounts.findOne({ id:data.id })
			if(!account) return res.send(200, Response.failure("That was not a valid account id"))

			return res.send(200, Response.success({ data : { email : account.email } }))
	
			}).catch(err => res.send(200,Response.failure(err)))
		},
	"email/verify" : function(req,res){

		var data = {
			code : { v:'string' }
			}
		
		data = Validator.run(data, req.body)
		if(data.failure) return res.send(200,data)

		co(function*(){

			var account = yield Accounts.findOne({ id:req.active_account.id })
			if(!account) return res.send(200, Response.failure("That was not a valid account id"))

			if(account.email_token != data.code) return res.send(200, Response.failure("That was an invalid code. Please check the code and try again."))

			var update = yield Accounts.update({ id: req.active_account.id } , { email_verified : true })
			if(!update) return res.send(200, Response.failure("The account could not be updated at this time"))

			return res.send(200, Response.success("Account updated."))
		
			}).catch(err => res.send(200,Response.failure(err)))
		},
	"email/resend" : function(req,res){

		co(function*(){

			var account = yield Accounts.findOne({ id:req.active_account.id })
			if(!account) return res.send(200, Response.failure("That was not a valid account id"))



			if(account.email_token.length != 6){
				let b = Token.generate(null, 6);

				var update = yield Accounts.update({ id: req.active_account.id } , { email_token : b })
				if(!update) return res.send(200, Response.failure("The account could not be updated at this time"))
				}
			else{
				let b = account.email_token
				}

			Emails.send({
				template : 'verify_email',
				email : account.email,
				context : {
					username: account.user_name,
					code : b
					},
				subject : 'Email Verification'
				})

			return res.send(200, Response.success("Email sent."))
		
			}).catch(err => res.send(200,Response.failure(err)))
		},
	"update/phone" : function(req,res){
		var data = {
			phone : { v:'phone' },
			code : { v:'string' }
			}
		
		data = Validator.run(data, req.body)
		if(data.failure) return res.send(200,data)

		co(function*(){

			var token = yield Tokens.findOne({ data: data.phone, token : data.code })
			if(!token) return res.send(200, Response.failure("That was not a valid code"))

			var update = yield Accounts.update({ id: req.active_account.id } , { phone : data.phone })
			if(!update) return res.send(200, Response.failure("The account could not be updated at this time"))

			if(data.code){
				Tokens.destroy({id:token.id}).exec(function(err){
					if(err) console.log("The token with an id of "+token.id+" was not deleted.")
					})
				}

			return res.send(200, Response.success("Account updated."))
	
			}).catch(err => res.send(200,Response.failure(err)))
		},
	"update/email" : function(req,res){
		var data = {
			email : { v:'string' }
			}
		
		data = Validator.run(data, req.body)
		if(data.failure) return res.send(200,data)

		co(function*(){

			let b = Token.generate(null, 6)

			Emails.send({
				template : 'verify_email',
				email : data.email,
				context : {
					username: req.active_account.user_name,
					code : b
					},
				subject : 'Email Verification'
				})



			var update = yield Accounts.update({ id: req.active_account.id } , { email : data.email, email_verified : false, email_token : b })
			if(!update) return res.send(200, Response.failure("The account could not be updated at this time"))

			return res.send(200, Response.success("Account updated."))
	
			}).catch(err => res.send(200,Response.failure(err)))
		},

	"update/password" : function(req,res){
		var data = {
			old_password : { v:'string' },
			new_password : { v:'string' }
			}
		
		data = Validator.run(data, req.body)
		if(data.failure) return res.send(200,data)

		co(function*(){

			if(req.active_account.password !== Token.hash(data.old_password)) return res.send(200, Response.failure("The current password was incorrect."))

			var update = yield Accounts.update({ id: req.active_account.id } , { password : Token.hash(data.new_password) })
			if(!update) return res.send(200, Response.failure("The account could not be updated at this time"))

			return res.send(200, Response.success("Account updated."))
	
			}).catch(err => res.send(200,Response.failure(err)))
		},

	};

