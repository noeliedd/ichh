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
  
  var User = require('../app/models/user');//Used for passport authentication routes
  
  app.use(cookieParser()); //Parses passport cookies
  app.use(session({ secret: 'The Best Secret in the world', resave: true,saveUninitialized: true }));// For Development, should not leave here     
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
        return done(null, false);
      }else{
        return done(null, user);     
      }
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  var auth = function(req, res, next){
    if (!req.isAuthenticated())
      res.sendStatus(401);
    else
      next();
  };

//---------------------- authentication routes---------------------------
  app.get('/loggedin', function(req, res){    
    res.send(req.isAuthenticated() ? req.user : '0');
  });

  app.post('/login', passport.authenticate('local'), function(req, res){
    res.send(req.user);
  });

  app.post('/logout', function(req, res){
    req.logOut();
    res.sendStatus(200);
  });   

//--------------------server routes -------------------------------
//-----------------Mobile REST API Calls---------------------------
  app.post("/api/addRouteDrop", routeDrop.addRouteDrop);//passed route drop from mobile app
  app.post("/api/addRouteOrder", routeOrder.addRouteOrder); //passed order from the mobile app

//-----------------Mobile & Web REST API Calls----------------------  
  app.get("/api/getActiveRoutes", route.getActiveRoutes);//returns all active routes in database
  app.get("/api/getRoute", route.getRoute); //returns route object for route id passed
  app.get("/api/getPassword", user.getPassword);// looks up db for given email and sends password if found
  
// ---------------Angular frontend Website REST API--------------------
  app.post("/api/addUser", user.addUser);
  app.post("/api/editUser", user.editUser);  
  app.get('/api/getUsers', user.getUsers);
  app.get('/api/getUserById', user.getUserById);  
  app.post("/api/addRoute", route.addRoute);
  app.post("/api/editRoute", route.editRoute);
  app.get("/api/getAllRoutes", route.getAllRoutes);
  app.get("/api/getRouteDrop", routeDrop.getRouteDrop); //
  app.get("/api/getOrders", routeOrder.getOrders);

  // route to handle all angular requests
  app.get('*', function(req, res) {
    var path = require('path'); res.sendFile(path.join(__dirname,'../public', 'index.html'));
  });

};