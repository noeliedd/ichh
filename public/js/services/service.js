angular.module('Service', [])

.factory('GetUsers', function($resource) {
    return $resource('/api/getUsers');
})
.factory('GetRoutes', function($resource) {
    return $resource('/api/getRoutes');
});