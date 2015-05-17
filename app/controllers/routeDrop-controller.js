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

//Returns route drops for request query
module.exports.getRouteDrop = function(req,res){  
  
  var from =(req.query.from);
  var from1 = new Date(from);
  var to =(req.query.to);  
  var route=(req.query.routeId);
//if req.query.routeId  = all get routeDrop objects for all active routes
    if(route === 'all'){
      //If the query to & from date is the same add 24 hrs to the from date and get result
        if(to === from){
          RouteDrop.find({"date": {"$gte": new Date(from), "$lte": new Date(from1.getTime() +1000*60*1440)}}, function (err, results) {
              if(err){
                res.json(err);
              }else{
                res.json(results); 
              }   
          });         
        }else{
          //else return drops between from & to date
          RouteDrop.find({"date": {"$gte": new Date(from), "$lte": new Date(to)}}, function (err, results) {
              res.json(results); 
          });      
        }  
    }else{  
      //same as above only for specified route id
          if(to === from){
              RouteDrop.find({"date": {"$gte": new Date(from), "$lte": new Date(from1.getTime() +1000*60*1440)}, 'routeId': req.query.routeId}, function (err, results) {
                  if(err){
                    res.json(err);
                  }else{
                    res.json(results); 
                  }   
              }); 
          }else{
            RouteDrop.find({"date": {"$gte": new Date(from), "$lte": new Date(to)}, 'routeId': req.query.routeId}, function (err, results) {
                if(err){
                  res.json(err);
                }else{
                  res.json(results); 
                } 
            });            
      }
    }
}