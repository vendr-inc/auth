
module.exports = function(req, res, next) {


	console.log(req.headers)
	console.log(req.body)

	if(!req.headers['fb_at']) return res.forbidden(Response.failure("This call requires a valid Facebook token."))

	req.fb_at = req.headers['fb_at']
	
	fb.setAccessToken(req.fb_at)

	return next();
	};
