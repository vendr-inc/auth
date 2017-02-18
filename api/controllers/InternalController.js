/**
 * LoginController
 *
 * @description :: Server-side logic for managing logins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	"check/username" : function(){
		var data = {
			user_name : { v:'string' }
			}

		data = Validator.run(data,req.body);
		if(data.failure) return res.send(200, data);

		co(function*(){

			var check_username = yield Accounts.findOne({ user_name : data.user_name })
			if(check_username) return res.send(200, Response.failure("This user name has already been registered."))

			return res.send(200, Response.success("Valid."))	


			}).catch(err => res.send(200,Response.failure(err)))

		},
	register : function(req, res){
		var data = {
			email : { v:'email', b:true },
			phone : { v:'phone' },
			code : { v:'string' },
			first_name : { v:'string' },
			middle_name : { v:'string', b:true },
			last_name : { v:'string' },
			user_name : { v:'string' },
			password : { v:'string' }
			}

		data = Validator.run(data,req.body);
		if(data.failure) return res.send(200, data);

		if(data.email) data.email_token = Token.generate();
		data.password = Token.hash(data.password);

		var code = data.code;
		delete data.code

		// making small change

		co(function*(){

			var token = yield Tokens.findOne({ data: data.phone, token : code })
			if(!token) return res.send(200, Response.failure("This is not a valid code."))

			if(Date.now() > Number(token.exp_time))	return res.send(200, Response.failure("Please request a new code because this one has expired."))

			var check_username = yield Accounts.findOne({ user_name : data.user_name })

			console.log(check_username)

			if(check_username) return res.send(200, Response.failure("This user name has already been registered."))

			var check_phone = yield Accounts.findOne({ phone : data.phone })
			if(check_phone) return res.send(200, Response.failure("This phone number has already been registered."))

			var account = yield Accounts.create(data)

			Tokens.destroy({id:token.id}).exec(function(err){
				if(err) console.log("The token with an id of "+token.id+" was not deleted.")
				})
				

			var key = yield Keys.create({
				account_id : account.id,
				key : Token.auth_key(account.id),
				exp_time : Token.expiration(),
				user_agent : (req.headers["user-agent"]?req.headers["user-agent"]:""),
				ip_address : Utils.ip(req.ip)
				})

			if(!key) return res.send(200,Response.failure("Authorization could not occur."))


			return res.send(200, Response.success({
				msg : "Facebook registered and logged in.",
				data : {
					auth_first_name : account.first_name,
					auth_last_name : account.last_name,
					auth_name : account.first_name + " " + account.last_name,
					auth_user_name : account.user_name,
					auth_phone : account.phone,
					auth_email : account.email,
					auth_id : account.id,
					auth_key : key.key,
					exp_time : key.exp_time
					}
				}))	


			}).catch(err => res.send(200,Response.failure(err)))
		},
	login : function(req, res){
		var data = {
			phone : { v:'phone', b:true , eo : { user_name : { v:'string' , b:true } } },
			password : { v:'string' }
			}

		data = Validator.run(data,req.body);
		if(data.failure) return res.send(200, data);

		var credential = (data.phone?{phone:data.phone}:{user_name : data.user_name})
		
		Accounts.findOne(credential).exec(function(err, found){

			if(err) return res.send(200, Response.failure(err))
			if(!found) return res.send(200, Response.failure("The login credentials were invalid. Please try again."))
			if(found.active == 0) return res.send(200, Response.failure("This account has been disabled. Please contact Peoplr."))
			if(found.password !== Token.hash(data.password)) return res.send(200, Response.failure("The password was incorrect."))

			// TODO let's delete all the previous keys issued to this user


			Keys.create({
				account_id : found.id,
				key : Token.auth_key(found.id),
				exp_time : Token.expiration(),
				user_agent : (req.headers["user-agent"]?req.headers["user-agent"]:""),
				ip_address : Utils.ip(req.ip)
				}).exec(function(err, created){
					if(err) return res.send(200, Response.failure(err))
					return res.send(200, Response.success({
						msg : "Valid login.",
						data : {
							auth_first_name : found.first_name,
							auth_last_name : found.last_name,
							auth_name : found.first_name + " " + found.last_name,
							auth_user_name : found.user_name,
							auth_phone : found.phone,
							auth_email : found.email,
							auth_id : found.id,
							auth_key : created.key,
							exp_time : created.exp_time
							}
						}))
					})
			})
		},
	logout : function(req, res){

		Keys.destroy({key:req.auth.key}).exec(function(err, destroyed){
			if(err) return res.send(200, Response.failure(err))
			return res.send(200, Response.success("Logout successful."))
			})
		
		

		}
	};

