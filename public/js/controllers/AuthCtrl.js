angular.module('AuthCtrl',[])

//Passes user object to AuthLoginService
.controller('LoginCtrl',function($scope,$http,$location,AuthLoginService) {
    $scope.login = function(user) {  
      AuthLoginService.login(user,function(returnedUser){
        $location.url("/home")
      })
  }; 
})

//Opens the password reminder modal on the login page
//When Modal opened the 'ModalInstanceCtrl' is loaded
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

//Handle the buttons on the opened modal
//Passes the inputted email to the PasswordReminder service to post to server
.controller('ModalInstanceCtrl', function ($scope, $modalInstance,PasswordReminderService) {
  $scope.submit = function () {
    PasswordReminderService.getPassword($scope.email);
    $modalInstance.close($scope.selected);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});