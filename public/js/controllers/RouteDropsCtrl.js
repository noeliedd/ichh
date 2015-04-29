angular.module('RouteDropsCtrl', [])

//Controller initialises a google map with no markers set
// Watches a shared data service, updates an array everytime the shared service changes and applies the markers to the map
.controller('ViewDropsController', function($scope,DropsDataService,RoutesDataService) {
     var dropCoordinates =[];
     var routeCoordinates =[];
     var lines=[];
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
  
     $scope.$watchCollection(function () {
         return RoutesDataService.getList();
     },                  
      function(newVal, oldVal) {
           console.log("\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\");
           console.log(newVal); 
           routeCoordinates =[];
       if(!angular.isDefined(newVal.length)){
            routeCoordinates.push(newVal);
          }else{
             console.log(newVal.length);

            for(var i =0; i<newVal.length;i++){
                routeCoordinates.push(newVal[i]);
                console.log("This is what I need to know");
                console.log(newVal[i].path);
                console.log(newVal); 
            }             
          }       
           console.log("This is a new value");  
           console.log(routeCoordinates.length);
           console.log(routeCoordinates[0]);
           console.log(routeCoordinates);
           addRoutePath();
      }, true);    
  
    var marker,coords, map, oms, iw, arrowSymbol,polyOptions,poly,path;
    var googleMap = google.maps;
    var markerArray =[];
    coords = new google.maps.LatLng(53.3550092,-6.248268);
    console.log(coords);
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
            console.log("dropCoordinates[i gggggggggggggggggggggggggggggggggggg");
            console.log(dropCoordinates[i]);
            var latLng = new google.maps.LatLng(dropCoordinates[i].k,dropCoordinates[i].D);
            marker = new google.maps.Marker({position: latLng,map: map});     
            oms.addMarker(marker);
            markerArray.push(marker);
        }    
    }
    function setAllMap(map) {
        for (var i = 0; i < markerArray.length; i++) {
            markerArray[i].setMap(map);
      }
    }   
  
        function addRoutePath(){   
                 if (lines){
                     console.log("656546465461616516546466516516161651651651651651515path.length");
                     console.log(lines.length);
                     for (var p=0; p<lines.length; p++){
                       console.log("nulifying");
                        lines[p].setMap(null);
                     }
                 }
           var routeNames=[];
       console.log("Merry Christmas");           
          for(var i=0;i<routeCoordinates.length;i++){  
            console.log(routeCoordinates);
            var routes =[];
              routeNames.push(routeCoordinates[i].name);
              console.log("routeCoordinates[i].path.length");
              console.log(routeCoordinates[i].path.length);
            for(var j=0; j<routeCoordinates[i].path.length;j++){
                console.log("Hello Hello Hello");
                console.log(i);
                //console.log(routeCoordinates[i].path[j]);
               var lat = routeCoordinates[i].path[j].k;
               var lng = routeCoordinates[i].path[j].D;
               var coord = new google.maps.LatLng(lat,lng); 
                
                //console.log(coord);
                routes.push(coord);       
                
             }  
              console.log("routes.length"); 
              console.log(i);
              //console.log(routeNames[i]);
              console.log(routes.length);              
              console.log(routes);
              arrowSymbol = {path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,strokeColor: '#FF0000',strokeOpacity: 1.0};
              

              poly = new google.maps.Polyline({path: routes,strokeColor: '#FF0000',strokeOpacity: 1.0,strokeWeight: 2,icons: [{                      
                        icon: arrowSymbol,
                        offset: '100%',
                        repeat:'55px',
                    }]});   
              poly.setMap(map);  
              lines.push(poly);
//               //path = poly.getPath();
              
//               for(var x=0; x<routes.length;x++){
//                 poly.setMap(map);   
//                 //path.push(routes[x]);   
//                 lines.push(poly);
//               }
              console.log("Lines lines lines lines @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@;");
              console.log(lines);
              x=0;
              routes =[];
              console.log(routes);                  
          }
      }   
  }                                  
)
//angular ui controller to get dates. Dates submitted are passed to the GetDrops Service
//The Get Drops service returns the drops for the given dates which is passed to shared data service
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
      console.log($scope.selectedRoute);
    
   /* if ($scope.fromDate === null || $scope.fromDate === undefined || $scope.toDate === null || $scope.toDate === undefined || $scope.fromDate > $scope.toDate){
      alert("Invalid Dates selected");
    }
    else{*/
    console.log($scope.selectedRoute);
      console.log(angular.isDefined($scope.selectedRoute));
      if(!angular.isDefined($scope.selectedRoute)||$scope.selectedRoute ===null){
        console.log("Gone in here" );
          GetRoute.getRoute("all").then(function(d){
          $scope.lists = RoutesDataService.getList();
          console.log("Routes Initial call");
          console.log($scope.lists);
         //console.log(d);
        //alert("Ye Baby");
          GetDrops.getDrops($scope.fromDate,$scope.toDate,"all").then(function(d){
          $scope.lists = DropsDataService.getList();
          console.log("Initial call");
          console.log($scope.lists);
         //console.log(d);
        //alert("Ye Baby");
       }); 
       });        
  
      }else{
          GetRoute.getRoute($scope.selectedRoute._id).then(function(d){
          $scope.lists = RoutesDataService.getList();
          console.log("Routes Initial call");
          console.log($scope.lists);
            
          GetDrops.getDrops($scope.fromDate,$scope.toDate,$scope.selectedRoute._id).then(function(d){
          $scope.lists = DropsDataService.getList();
          console.log("Initial Wishal call");
          console.log($scope.lists);     
         });  
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