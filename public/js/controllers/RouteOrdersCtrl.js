angular.module('RouteOrdersCtrl', [])

// Handles the view orders page
.controller('ViewOrdersController', function($scope, GetOrders,GetOrdersRoute,GetUserById) {
  
//Handles the DatePicker in the view------------------------------  
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
//----------------------  DATEPICKER END---------------------------------------------
  
     $scope.orders =[]; //stores order objects and new attributes added
       
          $scope.queryOrders = function(){
              if(!angular.isDefined($scope.fromDate) ||!angular.isDefined($scope.toDate)){
                 alert("Invalid Date Selection, date missing");               
              }else if($scope.fromDate> $scope.toDate){
                alert("Invalid Date Selection, from date cannot be greater than to date");
              }else{
                //If valid input use GetOrders service to return order objects for dates and save in $scope.orders
                GetOrders.getOrders($scope.fromDate,$scope.toDate).then(function(d){    
                    $scope.orders = d;       
                    //for each result object
                    for(var i in d) {
                      (function(i) {
                        //Pass the order object route id to GetOrdersRoutes to get the route name and add attributes to each order object on $scope.orders
                        GetOrdersRoute.getRoute($scope.orders[i].routeId).then(function(r) {
                          $scope.orders[i].routeName = r.name;
                        });
                      })(i);
                    }
                    //Same process as above for the user name. loop thru drop objects, send userId to GetUserById service and  attribute.
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
