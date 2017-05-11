
module.exports = function(req, res, next) {

	console.log("all auth.")

	if(!vendr_development){
		console.log("yes, here")
		console.log((req.headers["x-forwarded-for"]).split(",")[0])
		req.real_ip = (req.headers["x-forwarded-for"]).split(",")[0]
		console.log(req.ip)
		console.log(req.real_ip)
		}
	

	console.log(req.headers)
	console.log(req.ip)

	return next();
	};
