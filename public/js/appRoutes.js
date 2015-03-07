angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})
		.when('/addUser', {
			templateUrl: 'views/addUser.html',
			controller: 'UserController'
    })
		.when('/addRoute', {
			templateUrl: 'views/addRoute.html',
			controller: 'RouteController'
		})  


	$locationProvider.html5Mode(true);

}]);