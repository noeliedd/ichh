angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})
		.when('/addUser', {
			templateUrl: 'views/addUser.html',
			controller: 'AddUserController'
    })
		.when('/listUsers', {
			templateUrl: 'views/listUsers.html',
			controller: 'ListUserController'
		})  
		.when('/addRoute', {
			templateUrl: 'views/addRoute.html',
			controller: 'RouteController'
		})  

	$locationProvider.html5Mode(true);

}]);