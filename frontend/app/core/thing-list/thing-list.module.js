angular.module('myApp.thingList', ['ngRoute', 'myApp.core'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/things', {
    templateUrl: 'app/core/thing-list/thing-list.html',
    controller: 'ThingListController'
  });
}]);