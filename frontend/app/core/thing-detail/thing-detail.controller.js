angular.module('myApp.thingDetail')
  .controller('ThingDetailController', ['$location', '$scope', '$routeParams', 'ApiService', function($location, $scope, $routeParams, ApiService) {
    const id = $routeParams.id;
    $scope.thing = {};
    $scope.updatedThing = {};
    $scope.config = {};
    $scope.availableVariables = [];
    $scope.chartOptions = {
      responsive: true,
      maintainAspectRatio: false
    };
    $scope.selectedVariable = null;
    $scope.graphData = {
      series: [],
      values: [[]],
      timestamps: []
    };
    $scope.newTelemetry = {};

    // Get thing details and config
    ApiService.getThingById(id).then(function(response) {
      $scope.thing = response.data;
      $scope.updatedThing = angular.copy($scope.thing);
      $scope.config = angular.copy($scope.thing.config);

      if (Array.isArray($scope.thing.telemetry)) {
        const variableSet = new Set($scope.thing.telemetry.map(entry => entry.variable));
        $scope.availableVariables = Array.from(variableSet);
        $scope.selectedVariable = $scope.availableVariables[0];
        $scope.loadVariableGraph();
      }
    });

    $scope.loadVariableGraph = function () {
      if (!$scope.selectedVariable) return;

      ApiService.getThingVariableHistory(id, $scope.selectedVariable).then(function (response) {
        const data = response.data;

        $scope.graphData = {
          series: [$scope.selectedVariable],
          values: [[]],
          timestamps: []
        };

        data.forEach(point => {
          $scope.graphData.values[0].push(point.value);
          $scope.graphData.timestamps.push(new Date(point.timestamp).toLocaleString());
        });
      });
    };

    $scope.updateConfig = function() {
      const configObject = {};
      $scope.parameters.forEach(param => {
        configObject[param.key] = param.value;
      });
    
      ApiService.updateThingConfig(id, configObject).then(function(response) {
        $scope.config = response.data;
        $scope.parameters = angular.copy($scope.config.parameters || []);
    
        alert('Configuration updated successfully');
      }).catch(() => {
        alert('Error updating configuration');
      });
    };

    $scope.addTelemetry = function() {
      if (!$scope.newTelemetry.variable || !$scope.newTelemetry.value) {
        alert('Please fill in both variable and value fields.');
        return;
      }

      ApiService.addTelemetryData(id, $scope.newTelemetry).then(function() {
        alert('Telemetric data added');
        if ($scope.selectedVariable === $scope.newTelemetry.variable) {
          $scope.loadVariableGraph();
        }
        $scope.newTelemetry = {};
      });
    };

    $scope.goToMain = function() {
      $location.path('/');
    };
  }]);
