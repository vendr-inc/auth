/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  	attributes: {
  		email : {
  			type : 'email'
  			},
      email_token : {
        type : 'string'
        },
      email_verified : {
        type : 'boolean',
        required : true,
        defaultsTo : false
        },
      first_name : {
        type : 'string',
        required: true
        },
      last_name : {
        type : 'string',
        required: true
        },
      middle_name : {
        type : 'string'
        },
      user_name : {
        type : 'string',
        required: true,
        unique : true
        },
  		phone : {
  			type : 'string',
  			required : true,
  			unique : true
  			},
      password : {
        type : 'string'
        },
      facebook : {
        type : 'string'
        },
      facebook_at : {
        type : 'string'
        },
      linkedin : {
        type : 'string'
        },
      google : {
        type : 'string'
        },
  		active : {
  			type : 'boolean',
        required : true,
  			defaultsTo : true
  			},
  		status : {
  			type : 'integer',
  			defaultsTo : 1
  			}
		}

	};

