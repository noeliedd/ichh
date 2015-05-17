angular.module('RouteDropsCtrl', [])

//Controller initialises a google map with no markers set.
// Watches two shared data services, updates an array everytime the shared service changes and applies the,
// markers(drops) and polylines(routes) to the map
.controller('ViewDropsController', function($scope,DropsDataService,RoutesDataService) {
  
     var dropCoordinates =[]; //stores the drop objects,objects coordinates used to add markers to map
     var routeCoordinates =[]; // stores route objects, each route added as polyline object
     var polylines=[]; //Used to store polylines objects in order to clear the map 
     var markerArray =[]; //dropCoordinates are converted to google LatLng Literals and stored in this array 
  
//variables for the query result table  
     $scope.totalMet = 0;
     $scope.totalFed = 0;
     $scope.totalClothed = 0;
  
//watches the DropsDataService for returned route drop objects from server  
//pushes new objects to dropCoordinates array 
     $scope.$watch(function () {
         return DropsDataService.getList();
     },                  
      function(newVal, oldVal) {
          dropCoordinates =[];
          for(var i =0; i<newVal.length;i++){
              dropCoordinates.push(newVal[i]);
          }       
          addMarkers();
      }, true);

//watches the RoutesDataService for returned route objects from server 
// pushes new objects to routeCoordinates array
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

//Google map variables
    var marker,coords, map, oms, iw, arrowSymbol,polyOptions,poly,path;
    var googleMap = google.maps;
  
    coords = new google.maps.LatLng(53.3550092,-6.248268);// map centered here
    initialize();

//Initialize map using mapOptions i.e. where to center the map  
// Uses the google map spiderfier to handle markers in the same location
//found at https://github.com/jawj/OverlappingMarkerSpiderfier
    function initialize() {
        var mapOptions = {zoom: 12,center: coords,mapTypeId: google.maps.MapTypeId.ROADMAP};
        map = new google.maps.Map(document.getElementById('dropsMap'), mapOptions);
        iw = new googleMap.InfoWindow();
        oms = new OverlappingMarkerSpiderfier(map,{keepSpiderfied : true});//set the spiderfier to map   
        var image = 'img/homePin.png';
        marker = new google.maps.Marker({map: map,position: coords,icon: image});     
    }
  
//addMarkers function called from watch function that watches the DropsDataService
//first clears all existing markers and spiderfier markers and then adds new drop object coordinates  
    function addMarkers(){     
        //variables for the query result table, required to reset table after every query
        $scope.totalMet = 0;
        $scope.totalFed = 0;
        $scope.totalClothed = 0;   
      
        oms.clearMarkers();
        setAllMap(null);
        markerArray=[];           

      
        for(var i =0; i<dropCoordinates.length;i++){

            (function(i) {
              //only display drops from the active routes 
              for(var j =0; j< routeCoordinates.length;j++){
                if(dropCoordinates[i].routeId === routeCoordinates[j]._id){
                      //convert coordinates to LatLng object Literals
                    var latLng = new google.maps.LatLng(dropCoordinates[i].coordinates[0].A,dropCoordinates[i].coordinates[0].F);
                    //calculate figures i.e. total Met and Fed
                    var totalMet = dropCoordinates[i].totalMale + dropCoordinates[i].totalFemale;
                    var fed = dropCoordinates[i].totalMaleFed + dropCoordinates[i].totalFemaleFed;
                    var clothed = dropCoordinates[i].totalMaleClothed + dropCoordinates[i].totalFemaleClothed;
                    // Update the $scope to diaplay these values on the view
                    $scope.totalMet = $scope.totalMet + totalMet;
                    $scope.totalFed = $scope.totalFed + fed;
                    $scope.totalClothed = $scope.totalClothed + clothed;
                    //create a new marker object for each drop coordinate
                    marker = new google.maps.Marker({position: latLng,map: map,});  
                    //add marker to spiderfier
                    oms.addMarker(marker);
                    markerArray.push(marker);
                    //Attach a description to each drop marker object. This includes total met, fed, clothed for each individual drop
                    marker.desc = '<b>Total Met: ' +totalMet.toString()+'<br />Fed: '+fed.toString()+'<br />Clothed: '+
                      clothed.toString()+'</b>';              
                }
              }
            })(i); 
        }    
    }  

// create google info window object. 
        iw = new googleMap.InfoWindow();
  
//Global event Listener added to oms instance. When marker clicked the infowindow will open with drop description    
        oms.addListener('click', function(marker, event) {
        iw.setContent(marker.desc);
        iw.open(map, marker);
      });

//passed null to clear map of markers  
    function setAllMap(map) {
        for (var i = 0; i < markerArray.length; i++) {
            markerArray[i].setMap(map);
        }
    }   

//Used to add the route objects path to the map. Clears map first
    function addRoutePath(){   
      if (polylines){
        for (var p=0; p<polylines.length; p++){
            polylines[p].setMap(null);
        }
      }      

//Outer for loop iterates through each route object in routeCoordinates, Inner iterates through the routes path.
//Each path coordinate converted to google LatLng object and pushed to array named routes.
      for(var i=0;i<routeCoordinates.length;i++){  
          var routes =[];
          for(var j=0; j<routeCoordinates[i].path.length;j++){
            console.log(routeCoordinates[i].path[j].A);
            var lat = routeCoordinates[i].path[j].A;
            var lng = routeCoordinates[i].path[j].F;
            var coord = new google.maps.LatLng(lat,lng); 
            routes.push(coord);    
          }  

//Each path coordinate converted to google LatLng object and pushed to array named route.
//GoogleMap polyline object is created with its path set to the routes array
//Each polyline object is then pushed to an array polylines. This is used to track the polylines on the map in order to clear later
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
//These Services return response objects to the shared service used in the 'ViewDropsController' 
.controller('DropCriteriaCtrl', function ($scope, GetDrops,GetRoute,GetActiveRoutes,DropsDataService,RoutesDataService,ShareDataService ) {
      //Service that returns all active routes and updates sharedDataService
       GetActiveRoutes.getRoute();
       $scope.routes =[]; // Used for the dropdown menu on the viewDrops page in view
  
      
       $scope.$watchCollection(function () {
         return ShareDataService.getList();
     },                  
      function(newVal, oldVal) {
           $scope.routes =[];
           if(!angular.isDefined(newVal.length)){
                $scope.routes.push(newVal);
           }else{
                for(var i =0; i<newVal.length;i++){
                    $scope.routes.push(newVal[i]);
                }             
           }           
      }, true);  
  
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

//Passes the selected dates and route id selected in view
    $scope.submitQuery = function(){    
       if ($scope.fromDate > $scope.toDate){
          alert("From date cannot be greater than to date");
       }else{
         //if no route selected get all routes and drops for selected dates 
          if(!angular.isDefined($scope.selectedRoute)||$scope.selectedRoute ===null){
              GetRoute.getRoute("all").then(function(d){
                $scope.lists = RoutesDataService.getList();

                  GetDrops.getDrops($scope.fromDate,$scope.toDate,"all").then(function(d){
                    $scope.lists = DropsDataService.getList();
                  }); 
               });      
           }else{
         //else send the dates & selected route id and get the drops just for that route
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

//Used for the viewDropDetails page 
.controller('ViewDropDetailsController', function($scope,GetDropsData,GetActiveRoutes,DetailsDataService) {
  
       GetActiveRoutes.getRoute();//updates shared service
       $scope.routes =[];//used for the dropdown route menu on the view
       $scope.drops =[]; //used to store drop objects with new attributes from route objetcs i.e. route name

  
       $scope.$watchCollection(function () {
         return DetailsDataService.getList();
     },                  
      function(newVal, oldVal) {
           $scope.routes =[];
           if(!angular.isDefined(newVal.length)){
                $scope.routes.push(newVal);
           }else{
                for(var i =0; i<newVal.length;i++){
                    $scope.routes.push(newVal[i]);
                }             
           }           
      }, true);    
  
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
     
          $scope.queryDropDetails = function(){
            
              if(!angular.isDefined($scope.fromDate) ||!angular.isDefined($scope.toDate)){
                 alert("Invalid Date Selection, date missing");               
              }else if($scope.fromDate> $scope.toDate){
                alert("Invalid Date Selection, from date cannot be greater than to date");
              }else{
                  // if no route selected get all drops for all routes matching dates
                  if(!angular.isDefined($scope.selectedRoute)||$scope.selectedRoute ===null){
                          GetDropsData.getDrops($scope.fromDate,$scope.toDate,"all").then(function(d){
                              //set equal to array for dropdown menu
                              $scope.drops = $scope.routes;
                              //Loop through array of drops(route objects)
                              for(var i =0; i< $scope.drops.length;i++){
                                  var totalMet =0;
                                  var totalMale=0;
                                  var totalFemale=0;                            
                                  var totalFed=0;
                                  var totalClothed=0;
                                 //Inner loops through the returned drop objects
                                 (function(i) {
                                  for(var j =0; j< d.length;j++){
                                    //if the route id in $scope.drops is equal to a drop objects route id
                                    // then add all the values for the drop i.e. totalMale/female
                                    if($scope.drops[i]._id === d[j].routeId){
                                        console.log("True");
                                        totalMet = totalMet + d[j].totalMale + d[j].totalFemale;
                                        totalMale = totalMale + d[j].totalMale;
                                        totalFemale = totalFemale + d[j].totalFemale;
                                        totalFed = totalFed + d[j].totalMaleFed + d[j].totalFemaleFed;
                                        totalClothed = totalClothed + d[j].totalMaleClothed + d[j].totalFemaleClothed;

                                        //Add a new attribute to each object in drops and set to value calculated above
                                        $scope.drops[i].totalMet = totalMet;  
                                        $scope.drops[i].totalMale = totalMale;  
                                        $scope.drops[i].totalFemale = totalFemale; 
                                        $scope.drops[i].totalFed = totalFed; 
                                        $scope.drops[i].totalClothed = totalClothed;                                 
                                    }else{
                                      //If the ids dont match set the values to the default i.e. 0
                                      // This helps fill the fields in the table in the view
                                      $scope.drops[i].totalMet = totalMet;  
                                      $scope.drops[i].totalMale = totalMale;  
                                      $scope.drops[i].totalFemale = totalFemale; 
                                      $scope.drops[i].totalFed = totalFed; 
                                      $scope.drops[i].totalClothed = totalClothed;                                
                                    }
                                  }
                                })(i);   
                              }    
                          });                      
                   }else{
                         //If selected route is defined then send the id with the dates to the GetDrops service
                         $scope.drops =[];//empty cloned route array
                         GetDropsData.getDrops($scope.fromDate,$scope.toDate,$scope.selectedRoute._id).then(function(d){
                             //push the selected route onto the array
                             $scope.drops.push($scope.selectedRoute);
                             var totalMet =0;
                             var totalMale=0;
                             var totalFemale=0;                            
                             var totalFed=0;
                             var totalClothed=0;             
                           
                             //loop through returned drop objects
                             for(var i =0; i< d.length;i++){
                               // if the selected route id is equal to any drop objects routeId
                               // calculate the attributes 
                               if($scope.drops[0]._id === d[i].routeId){                              
                                    totalMet = totalMet + d[i].totalMale + d[i].totalFemale;
                                    totalMale = totalMale + d[i].totalMale;
                                    totalFemale = totalFemale + d[i].totalFemale;
                                    totalFed = totalFed + d[i].totalMaleFed + d[i].totalFemaleFed;
                                    totalClothed = totalClothed + d[i].totalMaleClothed + d[i].totalFemaleClothed;

                                    //create new attributes for the selected route object and set equal values
                                    $scope.drops[0].totalMet = totalMet;  
                                    $scope.drops[0].totalMale = totalMale;  
                                    $scope.drops[0].totalFemale = totalFemale; 
                                    $scope.drops[0].totalFed = totalFed; 
                                    $scope.drops[0].totalClothed = totalClothed;                                 
                                  }else{
                                    //If they dont match set the attributes to 0 to fill the result table
                                    $scope.drops[0].totalMet = totalMet;  
                                    $scope.drops[0].totalMale = totalMale;  
                                    $scope.drops[0].totalFemale = totalFemale; 
                                    $scope.drops[0].totalFed = totalFed; 
                                    $scope.drops[0].totalClothed = totalClothed;                                
                                  }
                             }
                                    //If no drop objects are returned for the selection set the table view to default 0
                                    $scope.drops[0].totalMet = totalMet;  
                                    $scope.drops[0].totalMale = totalMale;  
                                    $scope.drops[0].totalFemale = totalFemale; 
                                    $scope.drops[0].totalFed = totalFed; 
                                    $scope.drops[0].totalClothed = totalClothed;                           
                          });                  
                   }          
              }
          };        
})
