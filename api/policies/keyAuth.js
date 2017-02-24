
module.exports = function(req, res, next) {

	console.log(req.headers)
	console.log(req.body)


	if(!req.headers["key"]) return res.send(200, Response.failure({msg:"No authorization key was provided.", code:5000}))

	// copied validate code for now from KeysController

	Keys.findOne({key:req.headers["key"]}).exec(function(err, found){
		if(err) return res.send(200, Response.failure(err))
		if(!found) return res.send(200, Response.failure({msg:"That was an invalid key.", code:5000}))

		console.log(Date.now())
		console.log(found.exp_time)


		if(Date.now() > Number(found.exp_time)) return res.send(200, Response.failure({msg:"This key has expired and is no longer valid." , code:5100}))

		Accounts.findOne({id:found.account_id}).exec(function(err, found){
			if(err) return res.send(200, Response.failure(err))
			if(!found) return res.send(200, Response.failure({msg:"There was no account found for this key.", code:5000}))
			if(found.active == 0) return res.send(200, Response.failure({msg:"This account has been disabled.", code:5000}))

			req.active_account = found

			return next();
			})
		})
	};
