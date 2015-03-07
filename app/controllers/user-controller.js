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