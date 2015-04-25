angular.module('RouteDropsCtrl', [])

.controller('ViewDropsController', function($scope,shareDataService) {
     var dropCoordinates =[];
     $scope.$watch(function () {
         return shareDataService.getList();
     },                  
      function(newVal, oldVal) {
          console.log("newVal");
          console.log(newVal);
          console.log(oldVal); 
          dropCoordinates =[];
          for(var i =0; i<newVal.length;i++){
            dropCoordinates.push(newVal[i].coordinates[0]);
            console.log(newVal[i].coordinates[0].k);
            console.log(newVal[i].coordinates[0].D);
          }       
         addMarkers();
         for(var j =0; j<dropCoordinates.length;j++){
            console.log(dropCoordinates[j]);
         }
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

.controller('DatepickerCtrl', function ($scope, GetDrops,shareDataService ) {
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
    
   /* if ($scope.fromDate === null || $scope.fromDate === undefined || $scope.toDate === null || $scope.toDate === undefined || $scope.fromDate > $scope.toDate){
      alert("Invalid Dates selected");
    }
    else{*/
          GetDrops.getAll($scope.fromDate,$scope.toDate).then(function(d){
          $scope.lists = shareDataService.getList();
          console.log("Initial call");
          console.log($scope.lists);
         //console.log(d);
        //alert("Ye Baby");
     });      
   // }
  }
})

.controller('ListRoutesController',function($scope,GetRoutes) {
    $scope.routes = GetRoutes.query(function() {  
      console.log($scope.routes);
  }); 
}); 