var User = require('../models/user');

module.exports.addUser = function(req,res){  
  console.log("Ye Dope " +req.body); 
  var user = new User(req.body);  
  user.save(function (err, result) {  
      if(err){
         res.send(err);  
      }            
  });
}
module.exports.getUsers = function(req,res){  
  User.find({},'-password', function (err, results) {
    res.json(results);   
    console.log(results); 
  });
}