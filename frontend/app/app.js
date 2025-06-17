angular.module('myApp', [
  'ngRoute',
  'myApp.config',
  'myApp.core',
  'myApp.thingList',
  'myApp.thingDetail',
  'myApp.thingCard'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/things', {
      templateUrl: 'app/core/thing-list/thing-list.html',
      controller: 'ThingListController',
      controllerAs: '$ctrl'
    })
    .when('/things/:id', {
      templateUrl: 'app/core/thing-detail/thing-detail.html',
      controller: 'ThingDetailController'
    })
    .otherwise({ redirectTo: '/things' });
}]);
