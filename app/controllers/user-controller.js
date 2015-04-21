var User = require('../models/user');

module.exports.addUser = function(req,res){  
  var user = new User(req.body);  
  user.save(function (err, result) {  
      if(err){
       res.json(err);  
      }else{
       res.json(result);
      }      
  });
}
module.exports.getUsers = function(req,res){  
  User.find({},'-password', function (err, results) {
    res.json(results);   
    console.log(results); 
  });
}
module.exports.loginUser = function(req,res){
  console.log(req.body);
  User.find({email:req.body.email,password:req.body.password},function(err, user){
   if(err){
     res.send(err);
   }else{
      if(!user.length){
        console.log("it doesnt exist");
        res.send("Invalid Username or password");
      }else{
        console.log("Its in the database");    
        res.send("valid");
      }
   }
  })
}