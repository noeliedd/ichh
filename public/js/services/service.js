angular.module('Service', [])
//Posts user details to /Login on the server
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
.factory('GetUsers', function($http) {
      var promise = $http.get('/api/getUsers').then(function (response) {
         console.log(response);
        return response.data;
      });
      return promise;
})
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
.factory('GetAllRoutes', function($http) {
      var promise = $http.get('/api/getAllRoutes').then(function (response) {
         console.log(response);
        return response.data;
      });
      return promise;
})

.factory('GetActiveRoutes', function($http) {
      var promise = $http.get('/api/getActiveRoutes').then(function (response) {
         console.log(response);
        return response.data;
      });
      return promise;
})

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
.service('RoutesDataService', function() {
  var myList = [];
  var addList = function(newObj) {
      myList = [];
      console.log("Im Hereeeeeeeeeeeeeeeeeeeeeee");
      console.log(newObj);
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
});