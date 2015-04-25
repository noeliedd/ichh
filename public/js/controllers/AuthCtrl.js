angular.module('AuthCtrl',[])

.controller('LoginCtrl',function($scope,$http,$location,AuthLoginService) {
    $scope.login = function(user) {  
      console.log(user);
      AuthLoginService.login(user,function(returnedUser){
        console.log(returnedUser);
        $location.url("/home")
      })
  }; 
});
