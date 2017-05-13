module.exports = {

	ip : function(ip){
		var checker = require('ipaddr.js')
		if(checker.IPv4.isValid(ip)){
			return ip;
			}
		else if(checker.IPv6.isValid(ip)){
			ip = checker.IPv6.parse(ip)
			if(ip.isIPv4MappedAddress()){
				return ip.toIPv4Address().toString();
				}
			return ip
			}
		return "Unknown IP"
		},
	random : function (length, chars) {
	    var result = '';
	    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
	    return result;
		}

	}