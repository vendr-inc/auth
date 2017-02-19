
module.exports = function(req, res, next) {

	if(!req.headers['fb_at']) return res.forbidden(Response.failure("This call requires a valid Facebook token."))

	req.fb_at = req.headers['fb_at']
	
	fb.setAccessToken(req.fb_at)

	return next();
	};
