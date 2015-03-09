angular.module('RouteCtrl', [])
  
.controller('RouteController',['$scope','$resource', function($scope, $resource) {
    //variables
    var marker;
    var path;
    var length;
    var coords;
    var map;
    var poly; 
    var coordsArray = [];//for future saving of routes to database
    var markerArray =[]; //used to clear map markers

      coords = new google.maps.LatLng(53.3550092,-6.248268);
      initialize();

    function initialize() {
      var mapOptions = {zoom: 14,center: coords,mapTypeId: google.maps.MapTypeId.ROADMAP};
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
  }
]);