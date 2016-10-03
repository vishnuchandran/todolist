const userService = require('../services/user.service');
const taskService = require('../services/task.service');

function login(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  userService.findOne({ 'emailId': email }, function(err, data) {
    if (err) {
      console.log("failed");
      const message = 'Try after sometimes';
      res.status(500).json(message);
    } else {
      if (!data) {
        console.log("hi")
        const message = [ { param: 'email', msg: 'Invalid EmailId or Password',value: undefined }];
        res.status(500).json(message);
      }
      if (data) {
        if (data.password == password) {
          req.session.data = data.emailId;
          req.session._id = data._id;
          console.log(req.session._id);
          res.status(200).json('success');
        }
        if (data.password != password) {
          const message =  [ { param: 'email', msg: 'Invalid EmailId or Password',value: undefined }];
          res.status(500).json(message);
        }
      }
    }
  });
}

function registration(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const conformPassword = req.body.conformPassword;

  // Validating the User Registration Detais.
  req.checkBody('firstName', "First Name is required").notEmpty();
  req.checkBody('lastName', "Last Name is required").notEmpty();
  req.checkBody('email', "Email Id is required").notEmpty();
  req.checkBody('email', "Email Id is not valid").isEmail();
  req.checkBody('conformPassword', "Password does not match").equals(req.body.password);

  // Checking the Validation errors
  const errors = req.validationErrors();

  if (errors) {
    res.status(500).json(errors);
    console.log("entered");
  } else {
    userService.findOne({ 'emailId': email }, function(err, data) {
      if (err) {
        console.log("failed");
        const message = 'Failed to create account';
        res.status(500).json(message);
      } else {
        if (data) {
          const message = [{param: 'email', msg:'Email Id already exist'}];
          res.status(500).json(message);
        }
        if (!data) {
          userService.save({
            'firstName': firstName,
            'lastName': lastName,
            'emailId': email,
            'password': conformPassword
          }, function(err, data) {
            if (err) {
              console.log("failed");
              const message = 'Failed to create account';
            } else {
              req.session.data = data.emailId;
              req.session._id = data._id;
              
              taskService.save({userId:req.session._id},function(error,taskdata){
                if (error) {
                  console.log("errrrrrrrrrrrrrrrrrr");
                } else {
                  console.log("succcccccccccccccc");
                }
              })
              res.send("success");
            }
          });
        }
      }
    });
  }
}

function logout(req, res) {
  req.session.destroy();
  res.status(200).send();
}


module.exports = {
  login: login,
  registration: registration,
  logout: logout
};
