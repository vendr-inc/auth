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

  	GLOBAL.fb = require('fb');
	GLOBAL.fb_client_id = '153181341813266'
	GLOBAL.fb_client_secret = '5ff377ffe9b39dcd5f5f528509c91495'

	fb.options({ 'appSecret' : fb_client_secret, 'appId' : '153181341813266' })

	var redis = require("redis");
	GLOBAL.redisclient = redis.createClient({host: "test.peoplr.tech", port:"6379"});

	GLOBAL.services = {
		financials : {
			service : 'financials',
			host : 'http://test.peoplr.tech',
			port : '1338'
			},
		auth : {
			service : 'auth',
			host : 'http://test.peoplr.tech',
			port : '1337'
			}
		}

	cb()
	};
