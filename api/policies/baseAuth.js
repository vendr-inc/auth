
module.exports = function(req, res, next) {

	if(req.method !== "POST") return res.forbidden(Response.failure(req.method + " methods are not allowed on this API."))

	return next();
	};
