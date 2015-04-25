var RouteDrop = require('../models/routeDrop'); 

module.exports.addRouteDrop = function(req,res){  
  var routeDrop = new RouteDrop(req.body);  
  routeDrop.save(function (err, result) {  
      if(err){
       res.json(err);  
      }else{
       res.json(result);
      }      
  });
}
module.exports.getRouteDrop = function(req,res){  
  console.log("Reached C");
  var from =(req.query.from);
  var to =(req.query.to);
  
  RouteDrop.find({"date": {"$gte": new Date(from), "$lte": new Date(to)}}, function (err, results) {
    res.json(results);  
    console.log("Queryyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
    console.log(results); 
  });
}
