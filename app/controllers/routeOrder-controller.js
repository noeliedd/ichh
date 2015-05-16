var RouteOrder = require('../models/routeOrder'); 
var Route = require('../models/route'); 
var User = require('../models/user'); 

module.exports.addRouteOrder = function(req,res){ 
    console.log(req.query);
  var routeOrder = new RouteOrder(req.query);  
  routeOrder.save(function (err, result) {  
      if(err){
       res.json(err);  
      }else{
       res.json(result);
      }      
  });
}
module.exports.getOrders = function(req,res){ 
  console.log("Story horse");
  console.log(req.query.from);
  RouteOrder.find({"date": {"$gte": new Date(req.query.from), "$lte": new Date(req.query.to)}},'-location', function (err, results) {                
    console.log(results);
    res.json(results); 
  });
}