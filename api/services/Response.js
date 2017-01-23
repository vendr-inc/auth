module.exports = {

	update : {
		failure : function(){
			return {failure : { msg : "The update operation failed." } }
			}
		},
	create : {
		failure : function(){
			return {failure : { msg : "The create operation failed." } }
			}
		},
			

	failure : function(obj){

		console.log(obj)

		if(obj == undefined ){
			return { failure : { msg : "There was an error in processing this request.", code : "1000" } }
			}


		if(typeof obj == "string"){
			return { failure : { msg : obj, code : "1000" } }
			}

		if(obj.failure){

			if(!obj.failure.code) obj.failure.code = 1000
			return { failure : obj.failure }
			}

		// code 1000 means to display the message to the user.
		return { failure : { msg : obj.msg,  data : obj.data?obj.data:obj ,  code : obj.code||"1000" } }

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