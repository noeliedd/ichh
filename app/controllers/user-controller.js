var User = require('../models/user');
//nodemailer transporter object used to send email
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ichhhomelesshelper@gmail.com',
        pass: 'homeless'
    }
});

//Takes in user object.Generates random password,if save is successful it sends to email address provided
module.exports.addUser = function(req,res){  
  var user = new User(req.body);  
  user.password = Math.random().toString(36).substring(7);
  
  user.save(function (err, result) {  
      if(err){
           res.json(err);  
      }else{
          var mailOptions = {
              from: 'ichhhomelesshelper@gmail.com', // sender address 
              to: user.email, // list of receivers 
              subject: 'Your new password', // Subject line 
              text: 'Hello '+user.firstName+', you have been registered with ICHH, your password is: '+user.password     
          };     
          transporter.sendMail(mailOptions, function(error, info){
              if(error){
                  console.log(error);
              }else{
                  console.log('Message sent: ' + info.response);
              }
          });        
         res.json(result);
      }      
  });
}

//Upates user based on the objectId
module.exports.editUser = function(req,res){ 
  User.update({_id:req.body._id}, {$set: { firstName: req.body.firstName, surname: req.body.surname, phoneNumber: req.body.phoneNumber, email: req.body.email, admin: req.body.admin }}, function(err,results){
      if(err){
         res.json(err);  
      }else{
         res.json(results);
      } 
  });
}

//Returns all user objects without their passwords
module.exports.getUsers = function(req,res){  
  User.find({},'-password', function (err, results) {
    if(err){
      res.json(err);
    }else{
      res.json(results); 
    }  
  });
}

//returns user object based on id, less some attributes
module.exports.getUserById = function(req,res){  
  User.findOne({_id: req.query._id},'-password -email -phoneNumber -admin', function (err, results) {
    if(err){
      res.json(err);
    }else{
      res.json(results); 
    }    
  });
}

//Searches for email address posted to endpoint. if found retrieves the password and emails to user
module.exports.getPassword = function(req,res){ 
  User.findOne({email: req.query.email},function (err, results) {
      if(err){ 
         res.json(err);  
      }else{
          if(results){
              var mailOptions = {
                  from: 'ichhhomelesshelper@gmail.com', // sender address 
                  to: results.email, // list of receivers 
                  subject: 'Password Reminder', // Subject line 
                  text: 'Hello '+results.firstName+' your password is : '+results.password     
              };     
              transporter.sendMail(mailOptions, function(error, info){
                  if(error){
                      console.log(error);
                  }else{
                      console.log('Message sent: ' + info.response);
                  }
              }); 
              console.log(results);
              res.send("Successful");
          }else{
              res.send("Email not found");
          }                
      } 
  });  
}
