/*
The RouteCtrl is used to add new routes, edit existing routes, and
list all the routes for the admin website. 
*/
angular.module('RouteCtrl', [])
/*
The 'AddRouteController' is responsible for adding new routes to the system.
This is done from the addRoute screen of the application. 
The contoller first initializes a google map, adds event handlers for mouse clicks to add markers and
draws a route between these markers using googles polyline objects
*/
.controller('AddRouteController',['$scope','$resource', function($scope, $resource) {
  
    var marker, path, length, coords, map, poly;
    var coordsArray = [];//used to save coordinates to db
    var markerArray =[]; //used to clear map markers
    coords = new google.maps.LatLng(53.3550092,-6.248268);//coords to centre the map(ICHH location)
  
    initialize();
  
// Initialize new google map. Apply settings such as zoom distance by passing mapOptions to map 
    function initialize() {
      var styles = [{featureType: 'poi.business',elementType: 'labels',	stylers: [{ visibility: 'off' }]},{ 	draggable: false }];
      var mapOptions = {zoom: 12,center: coords,mapTypeId: google.maps.MapTypeId.ROADMAP,styles: styles};
      map = new google.maps.Map(document.getElementById('map'), mapOptions);
      var image = 'img/homePin.png';
      
// Create new googgle map marker object      
      marker = new google.maps.Marker({map: map,position: coords,icon: image});    
      
      var polyOptions = {
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2 
      };
      
//Create google polyline object and set it to map, apply settings such as polyline colour by passing polyOptions
        poly = new google.maps.Polyline(polyOptions);
        poly.setMap(map);
      
//Add Click event Liseteners to map
        google.maps.event.addListener(map, 'click', addLatLng);
        google.maps.event.addListener(map, 'click', addMarkers);
    }
  
//On click event, add a google marker to the map and store in array "markerArray"
    function addMarkers(event){       
        marker = new google.maps.Marker({
          position: event.latLng,          
          map: map
        });
        markerArray.push(marker);
    }
  
// Set the map on all markers 
    function setAllMap(map) {
      for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(map);
      }
    }

//Add click coordinates to "coordsArray"
//Add click event coordinates to polyline MVC array
    function addLatLng(event) {
        var coord = event.latLng;
        coordsArray.push(coord);
        console.log(coordsArray);
        path = poly.getPath();
        path.push(event.latLng);
      
//Get length of path
        length = google.maps.geometry.spherical.computeLength(path);
        length = $("distKm").value = Math.round(length/1000 * 100) / 100;
        document.getElementById("routeDistance").innerHTML = "Total Distance Km :" +length;
    }

//$scope.clearMap called from clear entire map button on add route screen
//Clear map of markers and polylines, Empty all arrays, set length to 0.
    $scope.clearMap = function(){
       setAllMap(null);
       markerArray=[];
       coordsArray =[];
       for(var i = 0; i = path.length; i++) {
         path.pop();
       } 
        length =0;
        document.getElementById("routeDistance").innerHTML = "Total Distance Km :" +length;           
    }
    
    
//clear only the last marker and polyline added to the map. Recalculate the polyline path distance
    $scope.clearLastMarker = function(){
      if(markerArray.length >0){
           markerArray[markerArray.length -1].setMap(null)
           markerArray.pop();  
           coordsArray.pop();
           path.pop();
           length = google.maps.geometry.spherical.computeLength(path);
           length = $("distKm").value = Math.round(length/1000 * 100) / 100;
           document.getElementById("routeDistance").innerHTML = "Total Distance Km :" +length;
       }else{
          return;
       }      
    }
    
// Uses ngResource to save the route. This includes the array of coordinates and the details
// such as route name entered by the user 
// Notify user if successful
    $scope.saveRoute = function(){
          //check that route path is longer than 1 marker      
          if(coordsArray.length > 2){        
               var AddRoute = $resource('/api/addRoute');              
                  var addRoute = new AddRoute();
                  addRoute.name = $scope.name;
                  addRoute.routeBeginning = $scope.routeBeginning;
                  addRoute.routeEnding = $scope.routeEnding;
                  addRoute.description = $scope.description;
                  addRoute.isActive = $scope.isActive;
                  addRoute.distance = length;
                  console.log(length);
                  addRoute.path = coordsArray;
                  addRoute.$save(function(response) {
                      if(response.dateCreated){
                        alert("Route Added");
                        $scope.name ='';
                        $scope.routeBeginning ='';
                        $scope.routeEnding ='';
                        $scope.description ='';
                        $scope.isActive = false;
                        $scope.isActive ='';
                      }else{
                        alert("Error occurred, route not inserted");
                        console.log(response);
                      }
                    },function(error) {
                      console.log(error);
                      alert(error.statusText);
                    });                             
          }else{
            alert("You have not added enough markers to the map");
          }      
    }
}])

// Uses the GetAllRoutes service which returns all routes from the server
//This is used on the ListRoutes page (d = response objects)
.controller('ListRoutesController',function($scope,GetAllRoutes,ShareDataService) {
    $scope.routes =[];
    GetAllRoutes.getRoutes();
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
//     $scope.routes = GetAllRoutes.then(function(d){
//            $scope.routes =d;
//     });  
})

// Uses the GetAllRoutes service which returns all routes from the server
//This is used on the EditRoute page (d = response objects)
//$scope.editRoute posts the edited route object to the server
.controller('EditRouteController', function($scope,GetAllRoutes,$http) {
      GetAllRoutes.then(function(d){
           $scope.routes =d;
      });   
  
      $scope.editRoute = function(){
          var route =$scope.selectedRoute;
          console.log(route);
          $http.post('api/editRoute', {_id:route._id, name:route.name,
                                       routeBeginning: route.routeBeginning,routeEnding: route.routeEnding,
                                       description:route.description, isActive:route.isActive })
          .success(function(data, status, headers, config) {
                if(data==1){
                  alert("Route Updated Successfully");
                }else{
                  alert("Route has not been updated");
                }              
            }).
            error(function(data, status, headers, config) {
                alert("An Error occurred please try again");
              // or server returns response with an error status.
          });
      }
})