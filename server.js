// modules =================================================
var express        = require('express'),
    app            = express(),
    mongoose       = require('mongoose'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    route          = require('./routes/routes'),
    logger         = require('morgan'),
    multer         = require('multer'),
    passport       = require('passport'),
    LocalStrategy  = require('passport-local').Strategy,
    cookieParser   = require('cookie-parser'),  
    session        = require('express-session')
    nodemailer     = require("nodemailer");
var path = require('path');
  app.use(express.static(path.join(process.env.PWD, 'public')));
  app.use(express.static(path.join(process.env.PWD, 'public/js')));
  app.use(express.static(path.join(process.env.PWD, 'public/js/controllers')));
  app.use(express.static(path.join(process.env.PWD, 'public/js/services')));
  app.use(express.static(path.join(process.env.PWD, 'public/libs')));
  app.use(express.static(path.join(process.env.PWD, 'public/libs/angular')));// set the static files location

  app.use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
      next();
  });
  // configuration ===========================================
  var db = require('./config/db');
  mongoose.connect(db.url);
  var port = process.env.PORT || 3000; // set our port

  // get all data/stuff of the body (POST) parameters
  //app.use(express.static(__dirname + '/public')); // set the static files location 
  app.use(bodyParser.json()); // parse application/json 
  app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
  app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

  app.use(multer());
  app.use(logger('dev'));


  app.use(methodOverride('X-HTTP-Method-Override')); 

  //app.use(express.static(process.cwd('/public')));
  
  // routes ==================================================
    require('./routes/routes')(app); // pass our application into our routes
    
  // start app ===============================================
    app.listen(port);	
    console.log('This is the port Number ' + port);
    exports = module.exports = app;	// expose app