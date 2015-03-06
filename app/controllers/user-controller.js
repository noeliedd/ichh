var User = require('../models/user');

module.exports.addUser = function(req,res){
  console.log("Ye Dope " +req.body.email); 
  var user = new User(req.body);  
  user.save(function (err, result) {   
      console.log(err);       
  });
}