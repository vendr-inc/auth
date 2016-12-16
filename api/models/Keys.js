/**
 * Keys.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		account_id: {
			type: 'string',
			required: true
			},
		key: {
			type: 'string',
			required: true,
			primaryKey: true,
			unique: true
			},
		exp_time: {
			type: 'string',
			defaultsTo: Date.now()
			},
		dev_tok: {
			type: 'string'
			},
		app_id: {
			type: 'string'
			},
		active : {
			type : 'boolean',
			required : true,
			defaultsTo : true
			}
		}
	}