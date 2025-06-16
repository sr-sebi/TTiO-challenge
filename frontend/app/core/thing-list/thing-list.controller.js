angular.module('myApp.thingList')
  .controller('ThingListController', ['$scope', 'ApiService', function($scope, ApiService) {
    $scope.things = [];

    ApiService.getThings().then(function(response) {
      $scope.things = response.data;
    });

    const socket = io('http://localhost:4000');

    socket.on('thingUpdated', function(updatedThing) {
      $scope.$apply(function() {
        $scope.things = updatedThing
      });
    });

    socket.on('connect', function() {
      console.log('Conectado al servidor socket, id:', socket.id);
    });

    socket.on('disconnect', function() {
      console.log('Desconectado del servidor socket');
    });

    $scope.$on('$destroy', function() {
      socket.disconnect();
    });
  }]);
