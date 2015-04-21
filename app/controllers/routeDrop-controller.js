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