angular.module('myApp.thingList')
  .controller('ThingListController', ['$scope', 'ApiService', 'SocketService', function($scope, ApiService, SocketService) {
    $scope.things = [];

    ApiService.getThings().then(function(response) {
      $scope.things = response.data;
    });

    SocketService.connect();

    SocketService.on('thingUpdated', function(updatedThing) {
      $scope.$apply(() => {
        $scope.things = updatedThing;
      });
    });

    $scope.$on('$destroy', function() {
      SocketService.disconnect();
    });
  }]);
