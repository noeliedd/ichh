angular.module('RouteDropsCtrl', [])

//Controller initialises a google map with no markers set
// Watches a shared data service, updates an array everytime the shared service changes and applies the markers to the map
.controller('ViewDropsController', function($scope,DropsDataService) {
     var dropCoordinates =[];
     $scope.$watch(function () {
         return DropsDataService.getList();
     },                  
      function(newVal, oldVal) {
          dropCoordinates =[];
          for(var i =0; i<newVal.length;i++){
              dropCoordinates.push(newVal[i].coordinates[0]);
          }       
           addMarkers();
      }, true);
    
    var marker,coords, map, oms, iw;
    var googleMap = google.maps;
    var markerArray =[];
    coords = new google.maps.LatLng(53.3550092,-6.248268);
    initialize();
  
    function initialize() {
        var mapOptions = {zoom: 12,center: coords,mapTypeId: google.maps.MapTypeId.ROADMAP};
        map = new google.maps.Map(document.getElementById('dropsMap'), mapOptions);
        iw = new googleMap.InfoWindow();
        oms = new OverlappingMarkerSpiderfier(map);      
 
        var image = 'img/homePin.png';
        marker = new google.maps.Marker({map: map,position: coords,icon: image});    
        var polyOptions = {
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2 
        };      
    }
    function addMarkers(){ 
        oms.clearMarkers();
        setAllMap(null);
        markerArray=[];
        for(var i =0; i<dropCoordinates.length;i++){
            var latLng = new google.maps.LatLng(dropCoordinates[i].k,dropCoordinates[i].D);
            marker = new google.maps.Marker({
            position: latLng,
            map: map
            });     
            oms.addMarker(marker);
            markerArray.push(marker);
        }    
    }
    function setAllMap(map) {
      for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(map);
      }
    }  
  }                                  
)

//angular ui controller to get dates. Dates submitted are passed to the GetDrops Service
//The Get Drops service returns the drops for the given dates which is passed to shared data service
.controller('DropCriteriaCtrl', function ($scope, GetDrops,GetActiveRoutes,DropsDataService ) {
//     $scope.routes = GetActiveRoutes;
//     $scope.selectedRoute = $scope.routes[0];
      $scope.$watch('selectedRoute', function(newVal){
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        console.log(newVal);
    })
    GetActiveRoutes.then(function(d){
         $scope.routes =d;
         console.log($scope.routes);
  })
  $scope.today = function() {
    $scope.fromDate = null;
    $scope.toDate = null;
  };
  $scope.today();
  $scope.clear = function () {
    $scope.fromDate = null;
  };
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
  $scope.format = $scope.formats[1];
  
  $scope.submitQuery = function(){
    console.log($scope.selectedRoute);
    
   /* if ($scope.fromDate === null || $scope.fromDate === undefined || $scope.toDate === null || $scope.toDate === undefined || $scope.fromDate > $scope.toDate){
      alert("Invalid Dates selected");
    }
    else{*/
    console.log($scope.selectedRoute);
      console.log(angular.isDefined($scope.selectedRoute));
      if(!angular.isDefined($scope.selectedRoute)||$scope.selectedRoute ===null){
        console.log("Gone in here" );
          GetDrops.getDrops($scope.fromDate,$scope.toDate,"all").then(function(d){
          $scope.lists = DropsDataService.getList();
          console.log("Initial call");
          console.log($scope.lists);
         //console.log(d);
        //alert("Ye Baby");
       });   
      }else{
          GetDrops.getDrops($scope.fromDate,$scope.toDate,$scope.selectedRoute._id).then(function(d){
          $scope.lists = DropsDataService.getList();
          console.log("Initial call");
          console.log($scope.lists);     
         });  
      }
   
   // }
  }
})
.controller('ListRoutesController',function($scope,GetActiveRoutes) {
    $scope.routes = GetActiveRoutes.query(function() {  
      console.log($scope.routes);
  }); 
}); 