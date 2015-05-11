var app = angular.module('UserCtrl', [])

.controller('AddUserController',['$scope','$resource','$rootScope', function($scope, $resource,$rootScope) {
    console.log("hear I am");
    console.log($rootScope.currentUser);
     var AddUser = $resource('/api/addUser');  
     $scope.addUser = function(){
          var addUser = new AddUser();
          addUser.firstName = $scope.firstName;
          addUser.surname = $scope.surname;
          addUser.phoneNumber = $scope.phoneNumber;
          addUser.email = $scope.email;
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
        $scope.phoneNumber ="";
        $scope.adminCheck = false;
      }
  }                                 
])
.controller('ListUsersController',function($scope,GetUsers) {
    $scope.predicate = 'firstName';
    $scope.users = GetUsers.then(function(d){
           $scope.users =d;
    });  
})
.controller('EditUsersCtrl', function($scope,GetUsers,$http) {
      GetUsers.then(function(d){
           $scope.users =d;
      });   
      $scope.editUser = function(){
        var user =$scope.selectedUser;
        console.log(user);
        $http.post('api/editUser', {_id:user._id, firstName:user.firstName, surname: user.surname,email: user.email,phoneNumber:user.phoneNumber, admin:user.admin }).
          success(function(data, status, headers, config) {
              console.log(data);
              if(data==1){
                alert("User Updated Successfully");
              }else{
                alert("User has not been updated");
              }              
          }).
          error(function(data, status, headers, config) {
              alert("An Error occurred please try again");
            // or server returns response with an error status.
        });
      }
    }           
)
