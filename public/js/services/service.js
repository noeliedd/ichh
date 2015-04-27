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
//Retrieves all users from server using ngResource
.factory('GetUsers', function($resource) {
    return $resource('/api/getUsers');
})
.factory('GetActiveRoutes', function($http) {
      var promise = $http.get('http://ichh-202592.euw1-2.nitrousbox.com/api/getActiveRoutes').then(function (response) {
         console.log(response);
        return response.data;
      });
      return promise;
})
.factory('GetRouteCoords', function($http,DropsDataService) {
  var GetRouteCoords = {
      getRouteCoord: function(id) {
          console.log(id);
          var promise = $http.get('/api/getRouteCoord?-id='+id).then(function (response) {
             console.log(response.data);
             console.log("Hello baby");  
            for(var i =0; i< response.data.length;i++){
              console.log(response.data[i]);
            }
             shareDataService.addList(response.data);
             return response.data;
          });
          return promise;
       }
  };
  return GetRouteCoords;
})
//GetDrops
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
.service('DropsDataService', function() {
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

});