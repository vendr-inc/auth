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
			email : { v:'email' },
			phone : { v:'phone' },
			code : { v:'string' },
			first_name : { v:'string' },
			middle_name : { v:'string', b:true },
			last_name : { v:'string' },
			user_name : { v:'string' },
			referral_code : { v:'string' , b:true },
			updated : { v:'string' }
			}

		data = Validator.run(data,req.body);


		if(!data.updated || (data.updated && data.updated != "1.2")) return res.send(200, Response.failure("Your Vendr application is outdated and no longer supported. To continue using Vendr, please upgrade to the latest version from the App Store."))
		if(data.failure) return res.send(200, data);
		
		var code = data.code;
		delete data.code
		delete data.updated

		// making small changes

		co(function*(){

			var token = yield Tokens.findOne({ data: data.phone, token : code })
			if(!token) return res.send(200, Response.failure("This is not a valid code."))

			if(Date.now() > Number(token.exp_time))	return res.send(200, Response.failure("Please request a new code because this one has expired."))

			var check_username = yield Accounts.findOne({ user_name : data.user_name })
			if(check_username) return res.send(200, Response.failure("This user name has already been registered."))

			var check_phone = yield Accounts.findOne({ phone : data.phone })
			if(check_phone) return res.send(200, Response.failure("This phone number has already been registered."))


			fb.api('/me' , { fields : ['id'] } , function(fbres){
				if(!fbres || fbres.error) return res.send(200, Response.failure("This was not a valid access token."))

				data.facebook = fbres.id


				fb.api('/oauth/access_token', { client_id : fb_client_id, client_secret : fb_client_secret, grant_type : 'fb_exchange_token' , fb_exchange_token : req.fb_at }  , function(fbres_et){

					if(!fbres || fbres.error) return res.send(200, Response.failure("This was not a valid access token."))

					co(function*(){

						var check_fb = yield Accounts.findOne({ facebook : fbres.id })
						if(check_fb) return res.send(200, Response.failure("This Facebook profile has already been registered."))


						data.facebook_at = fbres_et.access_token
						data.email_token = Token.generate(null, 6);
						data.email_verified = false
						
						var account = yield Accounts.create(data)

						Tokens.destroy({id:token.id}).exec(function(err){
							if(err) console.log("The token with an id of "+token.id+" was not deleted.")
							})

						Emails.send({
							template : 'verify_email',
							email : data.email,
							context : {
								username: data.user_name,
								code : data.email_token
								},
							subject : 'Email Verification'
							})
							

						var key = yield Keys.create({
							account_id : account.id,
							key : Token.auth_key(account.id),
							exp_time : Token.expiration(),
							user_agent : (req.headers["user-agent"]?req.headers["user-agent"]:""),
							ip_address : req.real_ip
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
								auth_email_verified : account.email_verified,
								auth_id : account.id,
								auth_key : key.key,
								exp_time : key.exp_time,
								fb_id : account.facebook,
								fb_at : fbres_et.access_token
								}
							}))	
			
						}).catch(err => res.send(200,Response.failure(err)))
					})
				})
			}).catch(err => res.send(200,Response.failure(err)))

		},
	login : function(req,res){
		var data = {
			updated : { v:'string' },
			}

		data = Validator.run(data,req.body);


		if(!data.updated || (data.updated && data.updated != "1.2")) return res.send(200, Response.failure("Your Vendr application is outdated and no longer supported. To continue using Vendr, please upgrade to the latest version from the App Store."))
		if(data.failure) return res.send(200, data);

		fb.api('/me' , { fields : ['id','first_name','last_name','email','birthday','gender','hometown','age_range','interested_in'] } , function(fbres){

			if(!fbres || fbres.error) return res.send(200, Response.failure("This was not a valid access token."))

			fb.api('/oauth/access_token', { client_id : fb_client_id, client_secret : fb_client_secret, grant_type : 'fb_exchange_token' , fb_exchange_token : req.fb_at }  , function(fbres_et){

				if(!fbres_et || fbres_et.error) return res.send(200, Response.failure("This was not a valid access token."))

				console.log(fbres_et)


				co(function*(){

					var account = yield Accounts.findOne({facebook : fbres.id})
					if(!account) return res.send(200, Response.success({msg:"Please register user.", data : {
						first_name : fbres.first_name,
						last_name : fbres.last_name,
						email : fbres.email
						}, code : 2000}))

					// if we have the emails from before 1.2, we have to add the verification field
					// update the access token

					if(!account.email_verified) {
						var account_update = yield Accounts.update({ id : account.id } , { facebook_at : fbres_et.access_token, email_verified : false })
						}
					else{
						var account_update = yield Accounts.update({ id : account.id } , { facebook_at : fbres_et.access_token })

						}

					if(!account_update) return res.send(200, Response.failure("We couldn't update the tokens."))


					var key = yield Keys.create({
							account_id : account.id,
							key : Token.auth_key(account.id),
							exp_time : Token.expiration(),
							user_agent : (req.headers["user-agent"]?req.headers["user-agent"]:""),
							ip_address : req.real_ip
							})
					if(!key) return res.send(200, Response.failure("There was an error processing this request."))

					return res.send(200, Response.success({
						msg : "Valid Facebook login.",
						data : {
							auth_first_name : account.first_name,
							auth_last_name : account.last_name,
							auth_name : account.first_name + " " + account.last_name,
							auth_user_name : account.user_name,
							auth_phone : account.phone,
							auth_email : account.email,
							auth_email_verified : (account.email_verified?account.email_verified:false),
							auth_id : account.id,
							auth_key : key.key,
							exp_time : key.exp_time,
							fb_id : account.facebook,
							fb_at : fbres_et.access_token
							}
						}))

					}).catch(err => res.send(200,Response.failure(err)))
				})
			})
		
		},
	extend : function(req,res){

		fb.api('/oauth/access_token', { client_id : fb_client_id, client_secret : fb_client_secret, grant_type : 'fb_exchange_token' , fb_exchange_token : fb_access_token }  , function(fbres){

			if(!fbres || fbres.error) return res.send(200, Response.failure("This was not a valid access token."))

			return res.send(200, Response.success("Token extended successfully."))
			})
		}
	};

