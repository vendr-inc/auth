/**
 * Rooms.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		sockets : {
            type : 'array',
            required : true
            },
		exp_time: {
			type: 'string',
			defaultsTo: Date.now()
			},
		active : {
			type : 'boolean',
			required : true,
			defaultsTo : true
			}
		}
	};

