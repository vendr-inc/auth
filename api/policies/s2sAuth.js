
module.exports = function(req, res, next) {

	var auth = req.headers['authorization'];
	var time = req.headers['peoplr-time'];

	if(!auth) return res.forbidden(Errors.failure("User unauthorized."))
	if(!time) return res.forbidden(Errors.failure("No time parameter."))

	var local_time = Time.get();
	
	if(Math.abs(local_time - time) > 15000) return res.forbidden(Errors.failure("Request timed out."))

	var method = req.method;
	var path = req.path;
	var crypto = require("crypto");

	var str = "";

	str = str + method + "\n" + time + "\n" + path;
	var hash = crpto.createHmac("sha256", "12345").update(str).digest("hex");

	var token = new Buffer(hash).toString("base64");
	token = "PPLR " + token;

	if(token != auth) return res.forbidden(Errors.failure("Token mismatch."));

	return next();
	};
