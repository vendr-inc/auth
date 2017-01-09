
module.exports = function(req, res, next) {

	if(!req.headers["key"]) return res.send(200, Response.failure({msg:"No authorization key was provided.", code:5000}))
	return next();
	};
