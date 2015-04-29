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
  var from =(req.query.from);
  var from1 = new Date(from);
  var to =(req.query.to);  
  var route=(req.query.routeId);
  console.log("Querxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  console.log(route);
  if(route === 'all'){
    if(to === from){
      RouteDrop.find({"date": {"$gte": new Date(from), "$lte": new Date(from1.getTime() +1000*60*1440)}}, function (err, results) {
          res.json(results);  
          console.log("Querbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
          console.log(from); 
          console.log(from1);
          console.log(results); 
      });         
    }else{
      RouteDrop.find({"date": {"$gte": new Date(from), "$lte": new Date(to)}}, function (err, results) {
          res.json(results);  
          console.log("Queryyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
          console.log(req.query.routeId);
          console.log(results); 
      });      
    }  
  }else{  
      if(to === from){
          RouteDrop.find({"date": {"$gte": new Date(from), "$lte": new Date(from1.getTime() +1000*60*1440)}, 'routeId': req.query.routeId}, function (err, results) {
            res.json(results);  
            console.log("Querbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
            console.log(from); 
            console.log(from1);
            console.log(results); 
        }); 
      }
  else{
      RouteDrop.find({"date": {"$gte": new Date(from), "$lte": new Date(to)}, 'routeId': req.query.routeId}, function (err, results) {
        res.json(results);  
        console.log("Querzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
        console.log(req.query.routeId);
        console.log(results); 
        console.log("Reached C");
    });            
  }
}
}