module.exports = {

	run : function(validators, input_data){
		if(!validators || !input_data){ return Response.failure('There was no data to validate.') }

		var total = 0;
		var errors = {};
		var returning = {};

		_.each(validators , function(details,key,list){
			var tbtested = input_data[key];
			var go = 0;


			if(key == "eon"){
				var eon_counter = 0;
				var done = false;
				do{
					eon_counter++;
					if(details[eon_counter]){
						var tangent = Validator.run(details[eon_counter], input_data);
						if(!tangent.failure) {
							_.extend(returning,tangent);
							done = true;
							} 
						}
					else errors[key] = tangent.failure;
					}
				while(!done && !errors[key]);
				}
			else if(!tbtested && typeof tbtested != "boolean"){
				if(details.eo){
					var t = Validator.run(details.eo, input_data)
					if(t.failure) errors[key] = t.failure.data
					else _.extend(returning, t)
					}
				else if(!details.b) errors[key] = { msg : 'This cannot be blank.' }
				else if(details.default || details.default == 0) returning[key] = details.default
				}
			else{
				// validate
				if(details.v){
					switch (details.v){
						default:
						case "json":
							if(tbtested.constructor == Object) go++
							else {
								// this is the validation if we are expecting json but don't have a structure for it
								try {
							        JSON.parse(tbtested);
							        go++;
							   		} 
							    catch (e) {
							    	errors[key] = { msg : "This is not valid JSON." }
							 	   }
							}
							break;
						case "email":
							 if ((/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(tbtested)) go++
							 else errors[key] = { msg : 'This is not a valid email address.' }  
							break;
						case "array":
							if(tbtested.constructor == Array) go++
								else errors[key] = { msg : "This value has to be an array." }
							break;
						case "any":
							go++;
							break;
						case "boolean":
							if(typeof tbtested != "boolean"){

								if(tbtested == "false"){ tbtested = false; go++}
								else if(tbtested == "true"){ tbtested = true; go++ }
								else errors[key] = { msg : "This value must be a boolean." }
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
						case "category":
						case "condition":
							go++;
							break;
						case "textarea":
							if(typeof tbtested != "string")
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
						case "currency":
							if(!Utils.isFloat(tbtested) && !Utils.isInt(tbtested)){
								errors[key] = { msg : "This value has to be a float." }
								}
							else {
								if(tbtested == 0 && details.nonzero) errors[key] = { msg : "This value cannot be zero." }
								if(details.positive && tbtested <0) errors[key] = { msg : "This value has to be greater than 0." }
								else go++
								}
							break;
						case "array_of_objects":
							if(tbtested.constructor == Array){
								if(typeof tbtested[0] != 'object') errors[key] = { msg : "The array must contain objects." }
								else go++;
								}
							else errors[key] = { msg : "This value must be an array of objects." }
							break;
						}
					}
				else if(details.in){
					if((details.in).indexOf(tbtested) !== -1) go++
					else{
						if(details.default || details.default == 0) { tbtested = details.default ; go++ }
						else errors[key] = { msg : 'The submitted data was not in the range of accepted values for this property.' , data : tbtested , accepted : details.in }
						}
					}
				else if(details.json){
					var t = Validator.run(details.data, tbtested)
					if(t.failure) errors[key] = t.failure.data
					else { tbtested = t; go++; }
					}
				else if(details.dependency){
					if(details.data[tbtested]  || details.default){
						var tester = ( details.data[tbtested] || data.default )
						if(tester != 'none'){
							var t = Validator.run(details.data[tbtested], input_data);
							if(t.failure) _.extend(errors, t.failure.data)
							// if(t.failure) errors[key] = { msg: "The field option chosen for this requires that additional information is submitted.", data : t.failure.data }
							else {
								_.extend(returning, t)
								go++
								}
							}
						else go++
						}
					else errors[key] = { msg : 'The submitted data is not an allowed value for this property.' };
					}

				if(go!=0) returning[key] = tbtested	
				}
			})

console.log(errors)
console.log(returning)

		if(Object.keys(errors).length != 0){ return { failure : { msg : 'There were validation errors with the data you submitted.' , data : errors } } }

		return returning;
		}

	}