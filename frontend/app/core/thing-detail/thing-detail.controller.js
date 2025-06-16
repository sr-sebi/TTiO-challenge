angular.module('myApp.thingDetail')
  .controller('ThingDetailController', ['$scope', '$routeParams', 'ApiService', function($scope, $routeParams, ApiService) {
    const id = $routeParams.id;
    $scope.thing = {};
    $scope.telemetry = [];
    $scope.updatedThing = {};

    ApiService.getThingById(id).then(function(response) {
      $scope.thing = response.data;
      $scope.updatedThing = angular.copy($scope.thing);
    });

    ApiService.getThingTelemetry(id).then(function(response) {
      $scope.telemetry = response.data;
    });

    $scope.updateThing = function() {
      ApiService.updateThing(id, $scope.updatedThing).then(function(response) {
        $scope.thing = response.data;
        alert('Thing updated successfully.');
      });
    };

    $scope.addTelemetry = function() {
      if (!$scope.newTelemetry.variable || !$scope.newTelemetry.value) {
        alert('Por favor, rellena variable y valor.');
        return;
      }
      ApiService.addTelemetryData(id, $scope.newTelemetry).then(function() {
        alert('Dato telemétrico añadido');
        $scope.newTelemetry = {};
        // Recargar historial
        ApiService.getThingTelemetry(id).then(function(response) {
          $scope.telemetry = response.data;
        });
      });
    };
  }]);