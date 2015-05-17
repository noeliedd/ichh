var Route = require('../models/route'); 
//--------------------------Add Route-------------------------------------
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

module.exports.editRoute = function(req,res){ 
  Route.update({_id:req.body._id}, {$set: { name: req.body.name, routeBeginning: req.body.routeBeginning, routeEnding: req.body.routeEnding, description: req.body.description, isActive: req.body.isActive }}, function(err,results){
      if(err){
         res.json(err);  
      }else{
         res.json(results);
      } 
  });
}
//--------------------Returns all active routes from db without the path----------------------
module.exports.getActiveRoutes = function(req,res){  
  Route.find({ 'isActive': true },'-path', function (err, results) {
      if(err){
         res.json(err);  
      }else{
         res.json(results);
      }  
  });
}

//Returns all active routes or route object matching route id
module.exports.getRoute   = function(req,res){  
  // if req.query = all return all active route objects
  if(req.query.route_id === "all"){
      Route.find({ 'isActive': true },'-isActive', function (err, results) {
          if(err){
             res.json(err);  
          }else{
             res.json(results);
          } 
      });
  }else{
    //else return object for req.route id
      Route.findOne({ '_id': req.query.route_id },'-dateCreated', function (err, results) {
        if(err){
           res.json(err);  
        }else{
           res.json(results);
        }    
      });    
  } 
}
// Returns all the routes active or inactive
module.exports.getAllRoutes = function(req,res){  
  Route.find({}, function (err, results) {
      if(err){
         res.json(err);  
      }else{
         res.json(results);
      } 
  });
}