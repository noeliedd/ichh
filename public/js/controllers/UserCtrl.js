angular.module('UserCtrl', [])

.controller('AddUserController',['$scope','$resource', function($scope, $resource) {
     var AddUser = $resource('/api/addUser');  
     $scope.addUser = function(){
          var addUser = new AddUser();
          addUser.firstName = $scope.firstName;
          addUser.surname = $scope.surname;
          addUser.phoneNumber = $scope.phoneNumber;
          addUser.email = $scope.email;
          addUser.password = $scope.password;
          addUser.admin = $scope.adminCheck;
          addUser.$save(function(response) {
            if(response.firstName){
              alert("User Added");
            }else{
              alert("Error occurred, user not inserted");
            }
        }, function(error) {
            alert(502 +"Internal Server Error ");
        });         
        $scope.firstName ="";
        $scope.surname ="";
        $scope.email ="";
        $scope.password ="";
        $scope.phoneNumber ="";
        $scope.adminCheck = false;
      };  
  }                                 
])
.controller('ListUsersController',function($scope,GetUsers) {
    $scope.predicate = 'firstName';
    $scope.users = GetUsers.query(function() {      
  });  
});