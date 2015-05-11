var RouteOrder = require('../models/routeOrder'); 

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