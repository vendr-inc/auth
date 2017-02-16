module.exports = {
	generate : function(id) {
		!id?id=(Math.random().toString(36).substring(7)):null

		var crypto = require('crypto');

		var r1 = Math.random();
		var r2 = Math.floor(Math.random() * id.length);

		// Form a random string
		var s1 = id.substring(0, r2);
		var s2 = id.substring(r2, id.length-1);
		var s = s1 + r1 + s2;

		return crypto.createHash('sha1').update(s).digest('hex');
		},
	auth_key : function(id){
		var time = new Date();
	    var crypto = require('crypto');

	    var r = Math.floor(Math.random() * id.length);

	    // Form a random string
	    var s1 = id.substring(0, r);
	    var s2 = id.substring(r, id.length-1);
	    var s = s1 + time + s2;

	    return crypto.createHash('sha1').update(s).digest('hex');
		},	
	hash : function(data){
		var c = require("crypto");
		var str_to_hash = (data.length).toString() + data + "peoplr20";
		return c.createHash('md5').update(str_to_hash).digest('hex').toString("base64");
		},
	expiration : function(type){
		// var EXP_TIME_WEB = 1800000;
		var EXP_TIME_MOB = Date.now() + 2592000000;

		return EXP_TIME_MOB

  //   	var t = Date.now();
  //   	if (type === 'MOB') return t + EXP_TIME_MOB
  //       return t + EXP_TIME_WEB;
		}
	}