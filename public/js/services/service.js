angular.module('Service', [])
//Posts user object  to /Login on the server
.factory('AuthLoginService', function($http,$location,$rootScope){  
  return{
      login: function(user,callback){
          $http.post('/login', user)
              .success(function(user){  
                $rootScope.currentUser = user;
                callback(user);
              })
      } 
  }; 
})

//Called from the NavCtrl to logout the user
.factory('AuthLogoutService', function($http,$location,$rootScope){ 
  return{ 
    logout: function(callback){
      $http.post('/logout')
        .success(function(){  
          $rootScope.currentUser = null;
          callback();
        })
    } 
  };
})

//Called from AuthCtrl.js 'ModalInstanceCtrl'
//Posts users email to server, server then posts a reminder password to email given
.factory('PasswordReminderService', function($http){ 
  return{     
    getPassword: function(email){      
      $http.get('/api/getPassword?email='+email)
        .success(function(response){  
            console.log(response);
      })
    } 
  };
})

//Returns all users from the server, Called from UserCtrl.js 'ListUsersController.
//Used for the list users page
// .factory('GetUsers', function($http) {
//       var promise = $http.get('/api/getUsers').then(function (response) {
//          return response.data;
//       });
//       return promise;
// })

.factory('GetUsers', function($http,ShareDataService) {
  var GetUsers = {
      getUsers: function() { 
          var promise = $http.get('/api/getUsers')
          .then(function (response) {
             ShareDataService.addList(response.data);
             return response.data;
          });
          return promise;
       }
  };
  return GetUsers;
})

//Called from RouteCtrl.js 'ListRoutesController' and 'EditRouteController'
//Used to return all routes for list route and edit route page

.factory('GetAllRoutes', function($http,ShareDataService) {
  var GetAllRoutes = {
      getRoutes: function() { 
          var promise = $http.get('/api/getAllRoutes')
          .then(function (response) {
             ShareDataService.addList(response.data);
             return response.data;
          });
          return promise;
       }
  };
  return GetAllRoutes;
})

// .factory('GetAllRoutes', function($http) {
//       var promise = $http.get('/api/getAllRoutes').then(function (response) {
//           return response.data;
//       });
//       return promise;
// })

//Called in RouteDropsCtrl 'DropCriteriaCtrl', used to populate the drop down list on view drops page
//Returns all the active routes from the server
// .factory('GetActiveRoutes', function($http) {
//       var promise = $http.get('/api/getActiveRoutes').then(function (response) {
//         return response.data;
//       });
//       return promise;
// })
.factory('GetActiveRoutes', function($http,ShareDataService) {
  var GetActiveRoutes = {
      getRoute: function() { 
          var promise = $http.get('/api/getActiveRoutes')
          .then(function (response) {
             ShareDataService.addList(response.data);
             return response.data;
          });
          return promise;
       }
  };
  return GetActiveRoutes;
})
//Called from the RoteDropsCtrl.js 'DropCriteriaCtrl'
//function getRoute takes in the route id for selected route in the view drops page
//Server returns route objects including their path. Response is passed to the 'RoutesDataService' for updating google map
.factory('GetRoute', function($http,RoutesDataService) {
  var GetRoute = {
      getRoute: function(routeId) { 
          var promise = $http.get('/api/getRoute?route_id='+routeId)
          .then(function (response) {
             RoutesDataService.addList(response.data);
             return response.data;
          });
          return promise;
       }
  };
  return GetRoute;
})

//Called from the RoteDropsCtrl.js 'DropCriteriaCtrl'
//function getDrops takes in the dates and routeId selected in the view drops page
//Server returns drop objects including their coordinates. Response is passed to the 'DropsDataService' for updating google map
.factory('GetDrops', function($http,DropsDataService) {
  var GetDrops = {
      getDrops: function(fromDate, toDate,routeId) {
          var promise = $http.get('/api/getRouteDrop?from='+fromDate+'&to='+toDate+'&routeId='+routeId)
          .then(function (response) {
               DropsDataService.addList(response.data);
             return response.data;
          });
          return promise;
       }
  };
  return GetDrops;
})

//Called from the RoteOrdersCtrl.js 'ViewOrdersController'
//function getOrders takes in the dates selected in the view orders page
//Server returns order objects. 
.factory('GetOrders', function($http) {
  var GetOrders = {
      getOrders: function(fromDate,toDate) {
          var promise = $http.get('/api/getOrders?from='+fromDate+'&to='+toDate)
          .then(function (response) {
             return response.data;
          });
          return promise;
       }
  };
  return GetOrders;
})

//Called from the RoteOrdersCtrl.js 'ViewOrdersController'
//function getRoute takes in the routeId attribute of the order object
//Server returns the route object for the order routeId. 
.factory('GetOrdersRoute', function($http) {
  var GetOrdersRoute = {
      getRoute: function(routeId) { 
          var promise = $http.get('/api/getRoute?route_id='+routeId)
          .then(function (response) {
             return response.data;
          });
          return promise;
       }
  };
  return GetOrdersRoute;
})

//Called from the RoteOrdersCtrl.js 'ViewOrdersController'
//function getUser takes in the userId attribute of the order object
//Server returns the user object for the order userId.
.factory('GetUserById', function($http) {
  var GetUserById = {
      getUser: function(userId) {
          var promise = $http.get('/api/GetUserById?_id='+userId)
          .then(function (response) {
             return response.data;
          });
          return promise;
       }
  };
  return GetUserById;
})

//====================================SHARED SERVICES===========================================

//Route objects passed to this service from the GetRoute service
//This service is watched by a function in the RoteDropCtrl.js 'ViewDropsController'
//When this service updates the function in the controller updates the map with route objects
.service('RoutesDataService', function() {
  var myList = [];
  var addList = function(newObj) {
      myList = [];
      myList = newObj;
  }
  var getList = function(){
      return myList;
  }
  return {
    addList: addList,
    getList: getList
  };
})

//Drop objects passed to this service from the GetDrops service
//This service is watched by a function in the RoteDropCtrl.js 'ViewDropsController'
//When this service updates the function in the controller updates the map with drop objects
.service('DropsDataService', function() {
  var myList = [];
  var addList = function(newObj) {
      myList = [];
      myList = newObj;
  }
  var getList = function(){
      return myList;
  }
  return {
    addList: addList,
    getList: getList
  };
})

.service('ShareDataService', function() {
  var myList = [];
  var addList = function(newObj) {
      myList = [];
      myList = newObj;
  }
  var getList = function(){
      return myList;
  }
  return {
    addList: addList,
    getList: getList
  };
})
