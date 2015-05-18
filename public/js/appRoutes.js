angular.module('appRoutes', []).config(function($routeProvider, $locationProvider,$httpProvider) {

	$routeProvider
		// login page
		.when('/', {
			templateUrl: 'views/login.html',
			controller: 'LoginCtrl'
		})
		.when('/home', {
			templateUrl: 'views/home.html',
      controller: 'HomeController',
        resolve: {
          loggedin: checkLoggedin
        }    
		})  
		.when('/addEditUser', {
			templateUrl: 'views/addEditUser.html',
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
		.when('/editRoute', {
			templateUrl: 'views/editRoute.html',
			controller: 'EditRouteController',
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
		.when('/viewDropDetails', {
			templateUrl: 'views/viewDropDetails.html',
			controller: 'ViewDropDetailsController',
        resolve: {
          loggedin: checkLoggedin
        }    
		})   
		.when('/viewOrders', {
			templateUrl: 'views/viewOrders.html',
			controller: 'ViewOrdersController',
        resolve: {
          loggedin: checkLoggedin
        }    
		})   
		.when('/userManual', {
			templateUrl: 'views/userManual.html',
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
            response: function(response){ 
                return response;
            },
            responseError: function(response){
                if (response.status === 401){
                    alert('Invalid Login Credentials '+ response.status);
                    $location.url('/');
                    return $q.reject(response);                  
                }else if(response.status === 502){
                    alert('Error Connecting to server '+ response.status);
                    $location.url('/');
                    return $q.reject(response);                   
                }
            }
        };
    }); 
});

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope)
{
    var deferred = $q.defer();

    $http.get('/loggedin').success(function(user)
    {
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
            alert("Login Required");
        }
    });
    
    return deferred.promise;
};