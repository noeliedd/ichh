var RouteOrder = require('../models/routeOrder'); 
var Route = require('../models/route'); 
var User = require('../models/user'); 

module.exports.addRouteOrder = function(req,res){ 
  var routeOrder = new RouteOrder(req.query);  
  routeOrder.save(function (err, result) {  
      if(err){
       res.json(err);  
      }else{
       res.json(result);
      }      
  });
}

//returns order objects matching fro and to date received
module.exports.getOrders = function(req,res){ 
  RouteOrder.find({"date": {"$gte": new Date(req.query.from), "$lte": new Date(req.query.to)}},'-location', function (err, results) {                
    if(err){
      res.json(err);
    }else{
      res.json(results); 
    }  
  });
}