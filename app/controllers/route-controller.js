var Route = require('../models/route'); 
//--------------------------Add Route-------------------------------------
module.exports.addRoute = function(req,res){  
  console.log(req.body);
  var route = new Route(req.body);  
  route.save(function (err, result) {  
      if(err){
       res.json(err);  
      }else{
       res.json(result);
      }      
  });
}
//--------------------Returns all active routes from db----------------------
module.exports.getActiveRoutes = function(req,res){  
  Route.find({ 'isActive': true },'-path', function (err, results) {
    res.json(results);   
    console.log(results); 
  });
}
//--------------------------Get Route for given id----------------------------
//Called from mobile route selection tab to return the coordinates of chosen route
module.exports.getRoute   = function(req,res){  
   console.log("req.query.route_id")
   console.log(req.query.route_id);
  if(req.query.route_id === "all"){
    Route.find({ 'isActive': true },'-isActive', function (err, results) {
      res.json(results);   
      console.log(results); 
  });
  }else{
    Route.findOne({ '_id': req.query.route_id },'-dateCreated', function (err, results) {
      res.json(results);   
      console.log(results); 
    });    
  } 
}
module.exports.getAllRoutes = function(req,res){  
  Route.find({}, function (err, results) {
    res.json(results);   
    console.log(results); 
  });
}