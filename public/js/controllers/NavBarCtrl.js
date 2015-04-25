angular.module('NavBarCtrl',[])
//Controller for the shared navbar. Logout button visible here following login
.controller('NavCtrl',function($scope,$location,AuthLogoutService) {
    $scope.logout = function(){
        AuthLogoutService.logout(function(response){
            console.log(response);
            $location.url("/");
        })
    }
});