var User = require('../models/user');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ichhhomelesshelper@gmail.com',
        pass: 'homeless'
    }
});
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
            text: 'Hello '+user.firstName+' have been registered with ICHH, your password is: '+user.password     
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
module.exports.editUser = function(req,res){ 
  console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");
  console.log(req.body);
  User.update({_id:req.body._id}, {$set: { firstName: req.body.firstName, surname: req.body.surname, phoneNumber: req.body.phoneNumber, email: req.body.email, admin: req.body.admin }}, function(err,results){
      if(err){
         res.json(err);  
      }else{
          console.log(results);
         res.json(results);
      } 
  });
}
//--------------------------------------------------------------------------------
module.exports.getUsers = function(req,res){  
  User.find({},'-password', function (err, results) {
    res.json(results);   
    console.log(results); 
  });
}
module.exports.getPassword = function(req,res){ 
  console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");
    console.log(req.query.email)
  User.findOne({email: req.query.email},function (err, results) {
      if(err){
         console.log(err);
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


//--------------------------Ionic mobile login API----------------------------------
// module.exports.loginUser = function(req,res){
//   console.log(req.body);
//   User.find({email:req.body.email,password:req.body.password},function(err, user){
//    if(err){
//      res.send(err);
//    }else{
//       if(!user.length){
//         console.log("it doesnt exist");
//         res.send("Invalid Username or password");
//       }else{
//         console.log("Its in the database");    
//         res.send("valid");
//       }
//    }
//   })
// }
//--------------------------------------------------------------------------------