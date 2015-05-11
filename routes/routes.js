module.exports = function(app) {
   var  user           = require('../app/controllers/user-controller.js'),
        route          = require('../app/controllers/route-controller.js'),
        routeDrop      = require('../app/controllers/routeDrop-controller.js'),
        routeOrder     = require('../app/controllers/routeOrder-controller.js'),       
        express        = require("express"),
        passport       = require('passport'),
        cookieParser   = require('cookie-parser'),  
        session        = require('express-session'),   
        LocalStrategy  = require('passport-local').Strategy;
  
  var User = require('../app/models/user');
  app.use(cookieParser()); 
  app.use(session({ secret: 'The Best Secret in the world', resave: true,saveUninitialized: true }));// For         Development, should not leave here     
  app.use(passport.initialize());
  app.use(passport.session());  
   
  passport.use(new LocalStrategy(function(email, password, done){
    console.log(email,password);
    User.find({
      'email': email, 
      'password': password
//       ,
//       'admin': true
    },'-password -phoneNumber', function(err, user) {
      if (err) {
        return done(err);
      }
 
      else if (!user.length) {
        console.log("Ther is no user found");
        return done(null, false);
      }else{
        console.log("user.name");
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        console.log(user);
        return done(null, user);     
      }
    });
  }));

  passport.serializeUser(function(user, done) {
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    console.log("00000000000000000000000000000000000000000000000000000000000");
    done(null, user);
  });

  var auth = function(req, res, next)
  {
    if (!req.isAuthenticated())
      res.sendStatus(401);
    else
      next();
  };

//---------------------- authentication routes---------------------------
  app.get('/loggedin', function(req, res){    
    console.log("555555555555555555555555555555555555555555555");
    console.log(req.session.passport.user);
    console.log(req.user);
    res.send(req.isAuthenticated() ? req.user : '0');
  });

  app.post('/login', passport.authenticate('local'), function(req, res){
    console.log(req.user);
    res.send(req.user);
  });

  app.post('/logout', function(req, res){
    console.log("Hello logout");
    req.logOut();
    res.sendStatus(200);
  });   

//--------------------server routes -------------------------------
//-----------------Mobile REST API Calls---------------------------
  app.post("/api/addRouteDrop", routeDrop.addRouteDrop);
  app.post("/api/addRouteOrder", routeOrder.addRouteOrder);

//-----------------Mobile & Web REST API Calls----------------------  
  app.get("/api/getActiveRoutes", route.getActiveRoutes);
  app.get("/api/getRoute", route.getRoute);
  app.get("/api/getPassword", user.getPassword);
  
// ---------------Angular frontend Website REST API--------------------
  app.post("/api/addUser", user.addUser);
  app.post("/api/editUser", user.editUser);  
  app.get('/api/getUsers', user.getUsers);
  app.post("/api/addRoute", route.addRoute);
  app.post("/api/editRoute", route.editRoute);
  app.get("/api/getAllRoutes", route.getAllRoutes);
  app.get("/api/getRouteDrop", routeDrop.getRouteDrop);

  // route to handle all angular requests
  app.get('*', function(req, res) {
    var path = require('path'); res.sendFile(path.join(__dirname,'../public', 'index.html'));
  });

};