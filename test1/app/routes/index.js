var express = require('express');
var router = express.Router();

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

		login.firstName = firstName;
		createUser.lastName = lastName;
		createUser.emailId = email;
		createUser.password = pass2;
		createUser.save(function(err){
			if(err){
				console.log("failed")
			}
			else {
				console.log("success")
			}
		})
		console.log("entered1")
	}
});



module.exports = router;