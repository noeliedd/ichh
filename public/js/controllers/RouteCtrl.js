angular.module('RouteCtrl', [])

.controller('AddRouteController',['$scope','$resource', function($scope, $resource) {
    var marker, path, length, coords, map, poly;
    var coordsArray = [];//used to save coordinates to db
    var markerArray =[]; //used to clear map markers
    coords = new google.maps.LatLng(53.3550092,-6.248268);
    initialize();

    function initialize() {
        var mapOptions = {zoom: 12,center: coords,mapTypeId: google.maps.MapTypeId.ROADMAP};
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        var image = 'img/homePin.png';
        marker = new google.maps.Marker({map: map,position: coords,icon: image});    
        var polyOptions = {
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2 
        };
 //Create polyline and set map to it
        poly = new google.maps.Polyline(polyOptions);
        poly.setMap(map);
        //Add Liseteners to map
        google.maps.event.addListener(map, 'click', addLatLng);
        google.maps.event.addListener(map, 'click', addMarkers);
    }
//Add marker on click event and store in array "markerArray"
    function addMarkers(event){ 
        //var image = 'images/marker.png';      
        marker = new google.maps.Marker({
        position: event.latLng,
          //icon: image,
        map: map
      });
        console.log(event.latLng);//////////////////Debug
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
//Clear map of markers and polylines, Empty all arrays, set length to 0.
    $scope.clearMap = function(){
       setAllMap(null);
       markerArray=[];
       coordsArray =[];
       for(i = 0; i = path.length; i++) {
         path.pop();
       } 
        length =0;
        document.getElementById("routeDistance").innerHTML = "Total Distance Km :" +length;           
    }
//clear the last marker and polyline added to the map
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
    $scope.saveRoute = function(){
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
                }else{
                      alert("Error occurred, route not inserted");
                      console.log(response);
                }
                },function(error) {
                    console.log(error);
                    alert(error.statusText);
                   });                             
      }else{
        console.log("This is the end");
        //checks coords array length
      }      
    }
  }                                  
])
.controller('ListRoutesController',function($scope,GetAllRoutes) {
    $scope.routes = GetAllRoutes.then(function(d){
           $scope.routes =d;
    });  
})
