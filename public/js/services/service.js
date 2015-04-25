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
//Retrieves all users from server using ngResource
.factory('GetRoutes', function($resource) {
    return $resource('/api/getRoutes');
})
//GetDrops
.factory('GetDrops', function($http,shareDataService) {
  console.log(" Debug Reached A");
  var GetDrops = {
      getAll: function(fromDate, toDate) {
          console.log("Reached B");
          console.log(fromDate,toDate);
          var promise = $http.get('/api/getRouteDrop?from='+fromDate+'&to='+toDate).then(function (response) {
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
  return GetDrops;
})
.service('shareDataService', function() {
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