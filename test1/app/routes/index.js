var express = require('express');
var router = express.Router();
var login = require('../models/loginSchema');


router.post("/register",function(req,res){
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var email = req.body.email;
	//console.log(email);
	var pass1 = req.body.pass1;
	var pass2 = req.body.pass2;

	req.checkBody('firstName',"First Name is required").notEmpty();
	req.checkBody('lastName',"Last Name is required").notEmpty();
	req.checkBody('email',"Email Id is required").notEmpty();
	req.checkBody('email',"Email Id is not valid").isEmail();
	//req.checkBody('pass1',"password is required").notEmpty();
	req.checkBody('pass2',"Password does not match").equals(req.body.pass1);


	var errors = req.validationErrors();
	console.log(errors);

	if(errors){
		res.status(500).json(errors)
		console.log("entered")
	}
	else {

		login.findOne({emailId : email},function(err,data){
			//console.log(data)
			if(err){
				console.log("failed");
			    var message = [ { param: 'email', msg: 'Failed to create account',value: undefined }];
			}
				
			 else {
			 	if(data == null){
			 		var createUser = new login;
					createUser.firstName = firstName;
					createUser.lastName = lastName;
					createUser.emailId = email;
					createUser.password = pass2;
					createUser.save(function(err){
					if(err){
						console.log("failed");
						var message = [ { param: 'email', msg: 'Failed to create account',value: undefined }];
					}
					else {
						res.send("success");
						console.log("success");
				
					}
					});
			 	}
			 	if(data != null) {
			 		console.log("emailid already exist");
					var message = [ { param: 'email', msg: 'Email Id already exist',value: undefined }];
					res.status(500).json(message);
			 	}
			 	
			}
		});
	}
});


router.post('/login',function(req,res){
	var email = req.body.email;
	var pass1 = req.body.pass1;

	login.findOne({emailId : email},function(err,data){
			//console.log(data)
			if(err){
				console.log("failed");
			    var message = [ { param: 'email', msg: 'Try after sometimes',value: undefined }];
			    res.status(500).json(message);
			}
				
			 else {
			 	if(data == null){
			 		var message = [ { param: 'email', msg: 'Invalid EmailId or Password',value: undefined }];
			 		res.status(500).json(message);	
			 	}
			 	if(data != null) {
			 		if(data.password == pass1){
			 			req.session.data = data._id;
			 			console.log(req.session.data);
			 			res.send("success");
			 		}
			 		if(data.password !=pass1){
			 			var message = [ { param: 'email', msg: 'Invalid EmailId or Password',value: undefined }];
			 			res.status(500).json(message);
			 		}	

			 	}
			 	
			}
		});



})
router.post('/insertdata',function(req,res){
	console.log("entered insertdata section");
	if(!req.session.data){
		var message = "Unautorized User";
		res.status(401).json(message);

	}
	else {
		if(req.body.task != null){
		//var todolist = req.body.task;
		login.findByIdAndUpdate(
        req.session.data,
        {$push: {"todolist": req.body.task}},
        {safe: true, upsert: true, new : true},
        function(err, data) {
        if(err){
        	var message = "Updating database failed";
			res.status(401).json(message);
        } 
      	else{
      		res.status(200).json("success");
      	}
        });

		
		

	}
	}	
})

// router.get('/user',function(req,res){
// 	if(!req.session.data){
// 		var message = "Unautorized User";
// 		res.status(401).json(message);

// 	}

// })

router.get('/displaylist',function(req,res){
	if(!req.session.data){
		var message = "Unautorized User";
		res.status(401).json(message);

	}
	else {
		login.findOne({_id : req.session.data},function(err,data){
			if(err){
				var message = "Unable to pull out data"
				res.status(401).json(message);	
			}
			else {
				
				res.status(200).json(data.todolist.reverse());
			}

		})
		
		
		

	}	

})

router.post('/logout',function(req,res){
	req.session.destroy();
	res.status(200).send();
})

module.exports = router;