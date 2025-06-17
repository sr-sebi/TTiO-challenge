angular.module('myApp.thingDetail', ['ngRoute', 'chart.js', 'myApp.core'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/things/:id', {
    templateUrl: 'app/core/thing-detail/thing-detail.html',
    controller: 'ThingDetailController'
  });
}]);