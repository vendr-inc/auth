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
		}

	}