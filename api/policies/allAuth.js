
module.exports = function(req, res, next) {

	console.log("all auth.")

	if(!vendr_development) req.ip = req.headers["X-Forwarded-For"]
	

	return next();
	};
