angular.module('UserCtrl', [])

.controller('AddUserController',['$scope','$resource', function($scope, $resource) {
  	$scope.header = 'Add User';	
     var AddUser = $resource('/api/addUser');
     $scope.addUser = function(){
        console.log($scope.adminCheck);
        var addUser = new AddUser();
          addUser.firstName = $scope.firstName;
          addUser.surname = $scope.surname;
          addUser.phoneNumber = $scope.phoneNumber;
          addUser.email = $scope.email;
          addUser.password = $scope.password;
          addUser.admin = $scope.adminCheck;
          addUser.$save(function(result){
          console.log(result);
            if(result.isUndefinedOrNull){
              alert("User succesfully inserted into database");
            }else{
              alert("Error Occurred Inserting into database");            
            }
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
.controller('ListUserController',function($scope,GetUsers) {
    $scope.predicate = 'firstName';
    $scope.users = GetUsers.query(function() {
      
  });  
});