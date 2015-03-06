module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		var path = require('path'); res.sendFile(path.join(__dirname,'../public', 'index.html'));
	});

};