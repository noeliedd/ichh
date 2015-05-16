angular.module('NavBarCtrl',[])
//Controller for the shared navbar. Logout button visible here following login
//Uses the AuthLogoutService to post /logout with the server
.controller('NavCtrl',function($scope,$location,AuthLogoutService) {
    $scope.logout = function(){
        AuthLogoutService.logout(function(response){
            console.log(response);
            $location.url("/");
        })
    }
});