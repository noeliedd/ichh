angular.module('UserCtrl', [])
  
.controller('UserController',['$scope','$resource', function($scope, $resource) {
    var AddUser = $resource('/api/addUser');
     $scope.array =[];
     $scope.addUser = function(){
        var addUser = new AddUser();
        addUser.firstName = $scope.firstName;
        addUser.surname = $scope.surname;
        addUser.phoneNumber = $scope.phoneNumber;
        addUser.email = $scope.email;
        addUser.password = $scope.password;
        
       console.log(addUser);
        //addUser.role = $scope.role;
        addUser.$save(function(result){
          console.log(result);
        });
        
      $scope.array.push({firstName : $scope.firstName, surname : $scope.surname, email : $scope.email, password: $scope.password, phoneNumber: $scope.phoneNumber});    
        $scope.firstName ="";
        $scope.surname ="";
        $scope.email ="";
        $scope.password ="";
        $scope.phoneNumber ="";
        //$scope.role ="";
      };  
  }
]);