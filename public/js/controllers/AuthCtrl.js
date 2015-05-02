angular.module('AuthCtrl',[])
  
.controller('LoginCtrl',function($scope,$rootScope,$http,$location,AuthLoginService) {
    $scope.login = function(user) {  
      console.log(user);
      AuthLoginService.login(user,function(returnedUser){
        console.log(returnedUser);
        $location.url("/home")
      })
  }; 
})
.controller('ModalCtrl', function ($scope, $modal) {
  $scope.open = function (size) {
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {        
      }
    });
  };
})
.controller('ModalInstanceCtrl', function ($scope, $modalInstance,PasswordReminderService) {
  $scope.submit = function () {
    PasswordReminderService.getPassword($scope.email);
    $modalInstance.close($scope.selected);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});