
module.exports = function(req, res, next) {

	if(!req.headers["key"]) return res.send(200, Response.failure("No authorization key was provided."))
	return next();
	};
