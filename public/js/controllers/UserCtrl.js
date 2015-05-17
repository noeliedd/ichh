var app =angular.module('UserCtrl', [])

.controller('HomeController', function($scope, $resource,$rootScope) {    
     $scope.user  = $rootScope.currentUser[0];  
  }                                 
)
/*
The 'AddUserController' is responsible for posting new user objects to the server using ng-resource.
This is done from the addEditUser screen of the application. 
*/
.controller('AddUserController',['$scope','$resource','$rootScope', function($scope, $resource,$rootScope) {

     var AddUser = $resource('/api/addUser');  
     $scope.addUser = function(){
          var addUser = new AddUser();//new instance of user object
          // add user attributes from view ng-models
          addUser.firstName = $scope.firstName;
          addUser.surname = $scope.surname;
          addUser.phoneNumber = $scope.phoneNumber;
          addUser.email = $scope.email;
          addUser.admin = $scope.adminCheck;
         
          addUser.$save(function(response) {
              if(response.firstName){
                alert("User Added");
                $scope.firstName ="";
                $scope.surname ="";
                $scope.email ="";
                $scope.phoneNumber ="";
                $scope.adminCheck = false;
              }else{
                alert("Error occurred, user not inserted");
              }
          }, function(error) {
              alert(502 +"Internal Server Error ");
          });
     }
  }                                 
])

// Used on the listUsers page
// Calls the GetUsers service that returns users from the database
//Get users returns response object to shared service which is watched here
.controller('ListUsersController',function($scope,GetUsers,ShareDataService) {

    $scope.users =[];// used to list users on view
    GetUsers.getUsers();
  
       $scope.$watchCollection(function () {
         return ShareDataService.getList();
     },                  
      function(newVal, oldVal) {
           $scope.users =[];
           if(!angular.isDefined(newVal.length)){
                $scope.users.push(newVal);
           }else{
                for(var i =0; i<newVal.length;i++){
                    $scope.users.push(newVal[i]);
                }             
           }           
      }, true);    
})
// Calls the GetUsers service that returns users from the database
//Get users returns response object to shared service which is watched here
.controller('EditUsersCtrl', function($scope,$http,ShareDataService,GetUsers) {
     GetUsers.getUsers();
     $scope.users =[];// used for the search box in the view
  
     $scope.$watchCollection(function () {
        return ShareDataService.getList();
     },                  
      function(newVal, oldVal) {
           $scope.users =[];
           if(!angular.isDefined(newVal.length)){
                $scope.users.push(newVal);
           }else{
                for(var i =0; i<newVal.length;i++){
                    $scope.users.push(newVal[i]);
                }             
           }           
      }, true); 

//Posts edited user details to the server using http
      $scope.editUser = function(){
          var user =$scope.selectedUser; //selected user from search dropdown menu

          $http.post('api/editUser', {_id:user._id, firstName:user.firstName,
                                      surname: user.surname,email: user.email,
                                      phoneNumber:user.phoneNumber, admin:user.admin })
         .success(function(data, status, headers, config) {  
            if(data==1){
              alert("User Updated Successfully");
            }else{
              alert("User has not been updated");
            }              
          })
          .error(function(data, status, headers, config) {
                alert("An Error occurred please try again");
              // or server returns response with an error status.
          });
      }
    }           
)
