module.exports = {

	failure : function(obj){

		if(obj == undefined ){
			return { failure : { msg : "There was an error in processing this request.", code : "1000" } }
			}


		if(typeof obj == "string"){
			return { failure : { msg : obj, code : "1000" } }
			}

		// code 1000 means to display the message to the user.
		return { failure : { msg : obj.msg, code : obj.code||"1000" } }

		},
	success : function(obj){
		if(obj == undefined ){
			return { success : { msg : "The request was successfully processed.", code : "1000" } }
			}


		if(typeof obj == "string"){
			return { success : { msg : obj, code : "1000" } }
			}

		if(typeof obj == "object"){
			!obj.msg?obj.msg = "Valid request.":null
			return { success : obj }
			}

		// code 1000 means to display the message to the user.
		// return { success : { msg : obj.msg, code : obj.code||"1000" } }
		}

	}