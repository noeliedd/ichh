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
			controller: 'ListUsersController'
		})  
		.when('/addRoute', {
			templateUrl: 'views/addRoute.html',
			controller: 'AddRouteController'
		})  
		.when('/listRoutes', {
			templateUrl: 'views/listRoutes.html',
			controller: 'ListRoutesController'
		})  

	$locationProvider.html5Mode(true);

}]);