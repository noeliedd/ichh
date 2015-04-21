var Route = require('../models/route'); 

module.exports.addRoute = function(req,res){  
  var route = new Route(req.body);  
  route.save(function (err, result) {  
      if(err){
       res.json(err);  
      }else{
       res.json(result);
      }      
  });
}
module.exports.activeRoutes = function(req,res){  
  Route.find({ 'isActive': true },'-dateCreated -path', function (err, results) {
    res.json(results);   
    console.log(results); 
  });
}
module.exports.getRoute   = function(req,res){  
  console.log(req.query.route_id);
  Route.findOne({ '_id': req.query.route_id },'-dateCreated', function (err, results) {
    res.json(results);   
    console.log(results); 
  });
}
/*module.exports.getUsers = function(req,res){  
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
}*/