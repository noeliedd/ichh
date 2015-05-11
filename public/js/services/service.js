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
      var promise = $http.get('http://ichh-202592.euw1-2.nitrousbox.com/api/getUsers').then(function (response) {
         console.log(response);
        return response.data;
      });
      return promise;
})
.factory('PasswordReminderService', function($http){ 
  return{     
    getPassword: function(email){      
      $http.get('http://ichh-202592.euw1-2.nitrousbox.com/api/getPassword?email='+email)
        .success(function(response){  
            console.log(response);
      })
    } 
  };
})
.factory('GetAllRoutes', function($http) {
      var promise = $http.get('http://ichh-202592.euw1-2.nitrousbox.com/api/getAllRoutes').then(function (response) {
         console.log(response);
        return response.data;
      });
      return promise;
})

.factory('GetActiveRoutes', function($http) {
      var promise = $http.get('http://ichh-202592.euw1-2.nitrousbox.com/api/getActiveRoutes').then(function (response) {
         console.log(response);
        return response.data;
      });
      return promise;
})

.factory('GetRoute', function($http,RoutesDataService) {
  console.log(" Routes A");
  var GetRoute = {
      getRoute: function(routeId) {
          console.log("Routes B");
          console.log(routeId);
          var promise = $http.get('/api/getRoute?route_id='+routeId).then(function (response) {
             console.log(response.data);
             console.log("Route baby");  
            for(var i =0; i< response.data.length;i++){
              console.log(response.data[i]);
            }
             RoutesDataService.addList(response.data);
             return response.data;
          });
          return promise;
       }
  };
  return GetRoute;
})

.factory('GetDrops', function($http,DropsDataService) {
  console.log(" Debug Reached A");
  var GetDrops = {
      getDrops: function(fromDate, toDate,routeId) {
          console.log("Reached B");
          console.log(fromDate,toDate,routeId);
          var promise = $http.get('/api/getRouteDrop?from='+fromDate+'&to='+toDate+'&routeId='+routeId).then(function (response) {
             console.log(response.data);
             console.log("Hello baby");  
            for(var i =0; i< response.data.length;i++){
              console.log(response.data[i]);
            }
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
      console.log("Im ahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
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

});