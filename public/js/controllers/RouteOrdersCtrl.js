angular.module('RouteOrdersCtrl', [])

.controller('ViewOrdersController', function($scope, GetOrders,GetOrdersRoute,GetUserById) {
      $scope.openFrom = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.openedFrom = true;
    };
    $scope.openTo = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.openedTo = true;
    };  
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
  
     $scope.orders =[];
     $scope.names =[];
          $scope.queryOrders = function(){
            if(!angular.isDefined($scope.fromDate) ||!angular.isDefined($scope.toDate)){
               alert("Invalid Date Selection, date missing");               
            }else if($scope.fromDate> $scope.toDate){
              alert("Invalid Date Selection, from date cannot be greater than to date");
            }else{
              GetOrders.getOrders($scope.fromDate,$scope.toDate).then(function(d){    
                $scope.orders = d;                  
                for(var i in d) {
                  (function(i) {
                    GetOrdersRoute.getRoute($scope.orders[i].routeId).then(function(r) {
                      $scope.orders[i].routeName = r.name;
                    });
                  })(i);
                }
                for( i in d) {
                  (function(i) {
                    GetUserById.getUser($scope.orders[i].userId).then(function(r) {
                      $scope.orders[i].userName = r.firstName+' '+r.surname;                          
                    });
                  })(i);
                }                  
              });                
            }
 
            };             
       
})
