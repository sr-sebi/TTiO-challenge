angular.module('myApp.thingDetail', ['ngRoute', 'myApp.core'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/things/:id', {
    templateUrl: 'app/core/thing-detail/thing-detail.html',
    controller: 'ThingDetailController'
  });
}]);