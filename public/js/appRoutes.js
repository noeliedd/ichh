angular.module('appRoutes', []).config(function($routeProvider, $locationProvider,$httpProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/login.html',
			controller: 'LoginCtrl'
		})
		.when('/home', {
			templateUrl: 'views/home.html',
        resolve: {
          loggedin: checkLoggedin
        }    
		})  
		.when('/addUser', {
			templateUrl: 'views/addUser.html',
			controller: 'AddUserController',
        resolve: {
          loggedin: checkLoggedin
        }
    })
		.when('/listUsers', {
			templateUrl: 'views/listUsers.html',
			controller: 'ListUsersController',
        resolve: {
          loggedin: checkLoggedin
        }    
		})  
		.when('/addRoute', {
			templateUrl: 'views/addRoute.html',
			controller: 'AddRouteController',
        resolve: {
          loggedin: checkLoggedin
        }     
		})  
		.when('/listRoutes', {
			templateUrl: 'views/listRoutes.html',
			controller: 'ListRoutesController',
        resolve: {
          loggedin: checkLoggedin
        }    
		})  
		.when('/viewDrops', {
			templateUrl: 'views/viewDrops.html',
			controller: 'ViewDropsController',
        resolve: {
          loggedin: checkLoggedin
        }    
		})  
    .otherwise({
    redirectTo: '/'
    });
  
	$locationProvider.html5Mode(true);
   $httpProvider.interceptors
   .push(function($q, $location)
    {
        return {
            response: function(response)
            { 
                return response;
            },
            responseError: function(response)
            {
                if (response.status === 401)
                    $location.url('/');
                    return $q.reject(response);
            }
        };
    }); 
});

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope)
{
    var deferred = $q.defer();
    console.log("checked login A");
    $http.get('/loggedin').success(function(user)
    {
        console.log("checked login B");
        console.log(user);
        $rootScope.currentUser = user;
        $rootScope.errorMessage = null;
        // User is Authenticated
        if (user !== '0')
            deferred.resolve();
        // User is Not Authenticated
        else
        {  console.log("Not logged in");
            $rootScope.errorMessage = 'You need to log in.';
            deferred.reject();
            $location.url('/');
        }
    });
    
    return deferred.promise;
};