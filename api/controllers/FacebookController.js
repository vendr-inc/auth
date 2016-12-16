/**
 * FacebookController
 *
 * @description :: Server-side logic for managing Facebook API concepts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	test : function(req,res){

		fb.api('/me' , { fields : ['id','first_name','last_name','email','birthday','gender','hometown','age_range','interested_in'] } , function(fbres){

			return res.send(200, fbres)
			})


		},
	register : function(req, res){
		var data = {
			user_name : { v:'string' },
			phone : { v:'phone' },
			code : { v:'string' }
			}

		data = Validator.run(data,req.body);
		if(data.failure) return res.send(200, data);

		if(data.email) data.email_token = Token.generate();

		Tokens.findOne({ data : data.phone , token : data.code }).exec(function(err, found){
			if(err) return res.send(200, Response.failure(err))
			if(!found && data.code != "TEST") return res.send(200, Response.failure("This is not a valid code."))

			// check expiration
			if(data.code != "TEST" && Date.now() > Number(found.exp_time))	return res.send(200, Response.failure("Please request a new code because this one has expired."))

			fb.api('/me' , { fields : ['id','first_name','last_name','email','birthday','gender','hometown','age_range','interested_in'] } , function(fbres){
				if(!fbres || fbres.error) return res.send(200, Response.failure("This was not a valid access token."))
				
				Users.findOne({$or:[{phone:data.phone}, {user_name : data.user_name} , { facebook:fbres.id }]}).exec(function(err,ufound){
					if(err) return res.send(200, Response.failure("There seems to have been an issue finding this user."))
					if(ufound) {
						
						if(ufound.facebook) return res.send(200, Response.failure("This user has already been registered using Facebook."))
						if(ufound.user_name == data.user_name) return res.send(200, Response.failure("This username has already been used before."))
						return res.send(200, Response.failure("This user has already been registered."))
						}

					data.first_name = (fbres.first_name?fbres.first_name:"Unknown")
					data.middle_name = (fbres.middle_name?fbres.middle_name:"Unknown")
					data.last_name = (fbres.last_name?fbres.last_name:"Unknown")
					data.facebook = fbres.id
					
					if(fbres.email){
						data.email = fbres.email
						data.email_token = Token.generate()
						}

					var code = data.code
					delete data.code


					Users.create(data).exec(function(err,created){
						if(err) return res.send(200, Response.failure(err))
						if(data.email){
							Send.email({
								to: data.email,
								subject: 'Welcome to Peoplr',
								text: 'Please check the following link to verify:',
								html: '<a href="https://accounts.peoplr.tech/verify/email?id=' + created.id + '&token=' + data.email_token + '"> Verify </a>'
								})
							}

						if(code != "TEST"){
							Tokens.destroy({id:found.id}).exec(function(err){
								if(err) console.log("The token with an id of "+found.id+" was not deleted.")
								})
							}

						Keys.create({
							account_id : created.id,
							key : Token.auth_key(created.id),
							exp_time : Token.expiration(),
							user_agent : (req.headers["user-agent"]?req.headers["user-agent"]:""),
							ip_address : Utils.ip(req.ip)
							}).exec(function(err, created_key){
								if(err) return res.send(200, Response.failure(err))

								return res.send(200, Response.success({
									msg : "User registered and logged in.",
									data : {
										auth_id : created.id,
										fb_id : fbres.id,
										auth_key : created_key.key,
										exp_time : created_key.exp_time,
										access_token : fb_access_token
										}
									}))
								})
						})
					})
				})
			})
		},
	login : function(req,res){
		var data = {
			code : { v:'string' }
			}
		
		data = Validator.run(data,req.query)
		if(data.failure) return res.send(200,data);

		fb.api('/oauth/access_token', { client_id : fb_client_id, client_secret : fb_client_secret, code : data.code , redirect_uri : "http://test.peoplr.tech:1337/facebook/login" }  , function(fbres_token){

			if(!fbres_token || fbres_token.error) return res.send(200, Response.failure("This was not a valid access token."))


			fb.setAccessToken(fbres_token.access_token);

			fb.api('/me', function(fbres){
				
				if(!fbres || fbres.error) return res.send(200, Response.failure("This was not a valid access token."))

				Users.findOne({facebook : fbres.id}).exec(function(err,found){
					if(err) return res.send(200, Response.failure("There seems to have been an issue with finding this user."))
					
					if(!found) return res.send(200, Response.success({
						msg : "Token valid, user needs to be registered.",
						data : {
							registered : false,
							fb_id : fbres.id,
							name : fbres.name,
							access_token : fbres_token.access_token
							}
						}))

					Keys.create({
						account_id : found.id,
						key : Token.auth_key(found.id),
						exp_time : Token.expiration(),
						user_agent : (req.headers["user-agent"]?req.headers["user-agent"]:""),
						ip_address : Utils.ip(req.ip)
						}).exec(function(err, created){
							if(err) return res.send(200, Response.failure(err))

							return res.send(200, Response.success({
								msg : "Valid Facebook login.",
								data : {
									auth_id : found.id,
									fb_id : found.facebook,
									auth_key : created.key,
									exp_time : created.exp_time,
									access_token : fbres.access_token
									}
								}))
							})
					})
				})			
			})
		},
	extend : function(req,res){

		fb.api('/oauth/access_token', { client_id : fb_client_id, client_secret : fb_client_secret, grant_type : 'fb_exchange_token' , fb_exchange_token : fb_access_token }  , function(fbres){

			if(!fbres || fbres.error) return res.send(200, Response.failure("This was not a valid access token."))

			return res.send(200, Response.success("Token extended successfully."))
			})
		},
	logout : function(req, res){

		Keys.destroy({key:req.auth.key}).exec(function(err, destroyed){
			if(err) return res.send(200, Response.failure(err))
			return res.send(200, Response.success("Logout successful."))
			})
		
		

		}
	};

