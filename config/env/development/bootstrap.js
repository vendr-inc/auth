/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  	global.client_id = '556461251141807';
  	global.client_secret = '0276bf7ae1981f694659814b81bb4491';
  	global.co = require('co');
	global.request = require('request');
	global.q = require("q");

	global.lhost = "localhost"

	global.mongodb = require('mongodb').ObjectID

	console.log("uhhh")


 //  	var redis = require("redis");
	// global.redisclient = redis.createClient({host: lhost, port:"6379"});


	const{ tryCatch } = require('co-try-catch');

	global.services = {
		financials : {
			service : 'financials',
			host : 'http://fn.vendr.tech',
			port : '80'
			},
		auth : {
			service : 'auth',
			host : 'http://auth.vendr.tech',
			port : '80'
			},
		ec : {
			service : 'ecommerce',
			host : 'http://ec.vendr.tech',
			port : '80'
			}
		}

  cb();
};
