angular.module('Service', [])

.factory('GetUsers', function($resource) {
    return $resource('/api/getUsers');
});