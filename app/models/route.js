var mongoose = require('mongoose');
var schema = require("../schemas/dbSchema.js");   

  module.exports = mongoose.model('route', schema.route);