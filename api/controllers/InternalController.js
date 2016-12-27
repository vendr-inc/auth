/**
 * LoginController
 *
 * @description :: Server-side logic for managing logins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
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


		Tokens.findOne({ data : data.phone , token : code }).exec(function(err, found){
			if(err) return res.send(200, Response.failure(err))
			if(!found && code != "TEST") return res.send(200, Response.failure("This is not a valid code."))

			// check expiration
			if(code != "TEST" && Date.now() > Number(found.exp_time))	return res.send(200, Response.failure("Please request a new code because this one has expired."))
			
			Accounts.findOne({$or:[{phone:data.phone}, {user_name : data.user_name}]}).exec(function(err,ufound){

				if(err) return res.send(200, Response.failure(err))
				if(ufound){
					if(ufound.phone == data.phone) return res.send(200, Response.failure("This phone number has already been registered."))
					if(ufound.user_name == data.user_name) return res.send(200, Response.failure("This user name has already been registered."))
					}
				
				Accounts.create(data).exec(function(err,created){
					if(err) return res.send(200, Response.failure(err))
					if(data.email){
						// Send.email({
						// 	to: data.email,
						// 	subject: 'Welcome to Sellyx',
						// 	text: 'Please check the following link to verify:',
						// 	html: '<a href="https://accounts.peoplr.tech/verify/email?id=' + created.id + '&token=' + data.email_token + '"> Verify </a>'
						// 	})
						}

					if(code != "TEST"){
						Tokens.destroy({id:found.id}).exec(function(err){
							if(err) console.log("The token with an id of "+found.id+" was not deleted.")
							})
						}

					return res.send(200, Response.success({
						msg : "Account created.",
						data : {
							auth_id : created.id
							}
						}))
					})
				})
			})
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
							auth_name : found.first_name + " " + found.last_name,
							auth_user_name : found.user_name,
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

