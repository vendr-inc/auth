module.exports = {

	run : function(validators, input_data){
		if(!validators || !input_data){ return Response.failure('There was no data to validate.') }

		var total = 0;
		var errors = {};
		var returning = {};

		_.each(validators , function(details,key,list){
			var tbtested = input_data[key];
			var go = 0;

			if(!tbtested && typeof tbtested != "boolean"){
				if(details.eo){
					var t = Validator.run(details.eo, input_data)
					if(t.failure) errors[key] = t.failure.data
					else _.extend(returning, t)
					}
				else if(!details.b) errors[key] = { msg : 'This cannot be blank.' }
				else if(details.default) returning[key] = details.default
				}
			else{
				// validate
				if(details.v){
					switch (details.v){
						default:
						case "any":
							go++;
							break;
						case "boolean":
							if(typeof tbtested != "boolean"){
								errors[key] = { msg : "This value must be a boolean." }
								}
							else go++
							break;
						case "phone":
							// enter validation for phone numbers
							if(typeof tbtested != "string"){
								errors[key] = { msg : "The phone number has to be submitted as a string." }
								}
							else go++
							break;
						case "string":
							if(typeof tbtested != "string"){
								errors[key] = { msg : "This value has to be a string." }
								}
							else go++
							break;
						case "integer":
							if(!Utils.isInt(tbtested)){
								errors[key] = { msg : "This value has to b a whole number." }
								}
							else {
								if(tbtested == 0 && details.nonzero) errors[key] = { msg : "This value cannot be zero." }
								if(details.positive && tbtested <0) errors[key] = { msg : "This value has to be greater than 0." }
								else go++
								}
							break;
						case "float":
							if(!Utils.isFloat(tbtested) && !Utils.isInt(tbtested)){
								errors[key] = { msg : "This value has to be a float." }
								}
							else {
								if(tbtested == 0 && details.nonzero) errors[key] = { msg : "This value cannot be zero." }
								if(details.positive && tbtested <0) errors[key] = { msg : "This value has to be greater than 0." }
								else go++
								}
							break;
						}
					}
				else if(details.json){
					var t = Validator.run(details.data, tbtested)
					if(t.failure) errors[key] = t.failure.data
					else { tbtested = t; go++; }
					}

				if(go!=0) returning[key] = tbtested	
				}
			})

		if(Object.keys(errors).length != 0){ return { failure : { msg : 'There were validation errors with the data you submitted.' , data : errors } } }

		return returning;
		}

	}