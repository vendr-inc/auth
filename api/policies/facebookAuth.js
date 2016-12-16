
module.exports = function(req, res, next) {

	if(!req.headers['fb_access_token']) return res.forbidden(Response.failure("This call requires a valid Facebook token."))

	GLOBAL.fb_access_token = req.headers['fb_access_token']

	fb.setAccessToken(fb_access_token)
	return next();
	};
