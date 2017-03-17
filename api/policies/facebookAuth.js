
module.exports = function(req, res, next) {


	console.log(req.headers)
	console.log(req.body)

	if(!req.headers['fbat']) return res.forbidden(Response.failure("This call requires a valid Facebook token."))

	req.fb_at = req.headers['fbat']
	
	fb.setAccessToken(req.fb_at)

	return next();
	};
