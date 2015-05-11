angular.module('RouteDropsCtrl', [])

//Controller initialises a google map with no markers set
// Watches a shared data service, updates an array everytime the shared service changes and applies the markers and routes to the map
.controller('ViewDropsController', function($scope,DropsDataService,RoutesDataService) {
     var dropCoordinates =[];
     var dropDetails =[];
     var routeCoordinates =[];
     var polylines=[]; //Used to store polylines objects in order to clear the map 
     $scope.totalMet = 0;
     $scope.totalFed = 0;
     $scope.totalClothed = 0;
  
     $scope.$watch(function () {
         return DropsDataService.getList();
     },                  
      function(newVal, oldVal) {
          dropCoordinates =[];
          dropDetails =[];
          for(var i =0; i<newVal.length;i++){
              dropCoordinates.push(newVal[i]);
              dropDetails.push(newVal[i].totalMale + newVal[i].totalFemale);
          }       
          addMarkers();
      }, true);
  
     $scope.$watchCollection(function () {
         return RoutesDataService.getList();
     },                  
      function(newVal, oldVal) {
           routeCoordinates =[];
           if(!angular.isDefined(newVal.length)){
                routeCoordinates.push(newVal);
           }else{
                for(var i =0; i<newVal.length;i++){
                    routeCoordinates.push(newVal[i]);
                }             
           }       
           addRoutePath();
      }, true);    
  
    var marker,coords, map, oms, iw, arrowSymbol,polyOptions,poly,path;
    var googleMap = google.maps;
    var markerArray =[];
    coords = new google.maps.LatLng(53.3550092,-6.248268);
    initialize();
  
    function initialize() {
        var mapOptions = {zoom: 12,center: coords,mapTypeId: google.maps.MapTypeId.ROADMAP};
        map = new google.maps.Map(document.getElementById('dropsMap'), mapOptions);
        iw = new googleMap.InfoWindow();
        oms = new OverlappingMarkerSpiderfier(map,{keepSpiderfied : true});      
 
        var image = 'img/homePin.png';
        marker = new google.maps.Marker({map: map,position: coords,icon: image});     
    }
    function addMarkers(){ 
        $scope.totalMet = 0;
        $scope.totalFed = 0;
        $scope.totalClothed = 0;
      
        oms.clearMarkers();
        setAllMap(null);
        markerArray=[];
        for(var i =0; i<dropCoordinates.length;i++){
            var latLng = new google.maps.LatLng(dropCoordinates[i].coordinates[0].A,dropCoordinates[i].coordinates[0].F);
            var totalMet = dropCoordinates[i].totalMale + dropCoordinates[i].totalFemale;
            var fed = dropCoordinates[i].totalMaleFed + dropCoordinates[i].totalFemaleFed;
            var clothed = dropCoordinates[i].totalMaleClothed + dropCoordinates[i].totalFemaleClothed;
            $scope.totalMet = $scope.totalMet + totalMet;
            $scope.totalFed = $scope.totalFed + fed;
            $scope.totalClothed = $scope.totalClothed + clothed;
            marker = new google.maps.Marker({position: latLng,map: map,});     
            oms.addMarker(marker);
            markerArray.push(marker);
            marker.desc = '<b>Total Met: ' +totalMet.toString()+'<br />Fed: '+fed.toString()+'<br />Clothed: '+
              clothed.toString()+'</b>';
            console.log(dropCoordinates);
        }    
    }
//Global event Listener added to oms instance  
        iw = new googleMap.InfoWindow();
        oms.addListener('click', function(marker, event) {
        iw.setContent(marker.desc);
        iw.open(map, marker);
      });

    function setAllMap(map) {
        for (var i = 0; i < markerArray.length; i++) {
            markerArray[i].setMap(map);
        }
    }   
  
    function addRoutePath(){   
//-----First for loop clears the map of all polylines before adding new one 
      if (polylines){
        for (var p=0; p<polylines.length; p++){
            console.log("nulifying");
            polylines[p].setMap(null);
        }
      }
      console.log("routeCoordinaterouteCoordinaterouteCoordinate");
      console.log(routeCoordinates);
//-------routeCoordinates is an array of route objects,each route includes an array of coordinates(path).
//-------Outer for loop iterates through each route object, Inner iterates through the routes path.
//-------Each path coordinate converted to google LatLng object and pushed to array named routes.
        for(var i=0;i<routeCoordinates.length;i++){  
            var routes =[];

            for(var j=0; j<routeCoordinates[i].path.length;j++){
              console.log(routeCoordinates[i].path[j].A);
              var lat = routeCoordinates[i].path[j].A;
              var lng = routeCoordinates[i].path[j].F;
              var coord = new google.maps.LatLng(lat,lng); 
              routes.push(coord);    
            }  
          console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
          console.log(routes[0]);
          //------Each path coordinate converted to google LatLng object and pushed to array named route.
          //------GoogleMap polyline object is created with its path set to the routes array
          //------Each polyline object is then pushed to an array polylines. This is used to track the polylines on the map in order to clear later
            arrowSymbol = {path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,strokeColor: '#FF0000',strokeOpacity: 1.0};
            poly = new google.maps.Polyline({path: routes,strokeColor: '#FF0000',strokeOpacity: 1.0,strokeWeight: 2,icons: [{                      
              icon: arrowSymbol,
              offset: '100%',
              repeat:'55px',
            }]});   
            poly.setMap(map);  
            polylines.push(poly);
            routes =[];             
        }
    }   
  }                                  
)
//angular ui controller to get dates. Dates submitted are passed to the GetDrops and GetRoutes Services
//These Services returns the routes selected and the drops for the given dates 
.controller('DropCriteriaCtrl', function ($scope, GetDrops,GetRoute,GetActiveRoutes,DropsDataService,RoutesDataService ) {
    GetActiveRoutes.then(function(d){
         $scope.routes =d;
    })
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

    $scope.submitQuery = function(){    
     if ($scope.fromDate > $scope.toDate){
        alert("From date cannot be greater than to date");
     }else{
        if(!angular.isDefined($scope.selectedRoute)||$scope.selectedRoute ===null){
            GetRoute.getRoute("all").then(function(d){
                $scope.lists = RoutesDataService.getList();

                GetDrops.getDrops($scope.fromDate,$scope.toDate,"all").then(function(d){
                    $scope.lists = DropsDataService.getList();
                }); 
             });      
         }else{
            GetRoute.getRoute($scope.selectedRoute._id).then(function(d){
                $scope.lists = RoutesDataService.getList();          

                GetDrops.getDrops($scope.fromDate,$scope.toDate,$scope.selectedRoute._id).then(function(d){
                $scope.lists = DropsDataService.getList();
                });  
             }); 
         }   
     }
  }
})
