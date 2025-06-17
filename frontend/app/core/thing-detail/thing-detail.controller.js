angular.module('myApp.thingDetail')
  .controller('ThingDetailController', ['$location', '$scope', '$routeParams', 'ApiService', function($location, $scope, $routeParams, ApiService) {
    const id = $routeParams.id;

    $scope.thing = {};
    $scope.parameters = [];
    $scope.variables = [];
    $scope.newTelemetry = {};
    $scope.selectedVariable = null;
    $scope.graphData = { series: [], values: [[]], timestamps: [] };
    $scope.chartOptions = { responsive: true, maintainAspectRatio: false };

    $scope.newParameter = { key: '', value: '' };
    $scope.newVariable = { name: '' };

    ApiService.getThingById(id).then(function(response) {
      $scope.thing = response.data;

      if ($scope.thing.config) {
        $scope.parameters = angular.copy($scope.thing.config.parameters || []);
        $scope.variables = angular.copy($scope.thing.config.variables || []);
      }

      if (Array.isArray($scope.thing.telemetry)) {
        const variableSet = new Set($scope.thing.telemetry.map(entry => entry.variable));
        $scope.availableVariablesForGraph = Array.from(variableSet);
        $scope.selectedVariable = $scope.availableVariablesForGraph[0];
        $scope.loadVariableGraph();
      }

      if (Array.isArray($scope.thing.config.variables)) {
        const variableSet = new Set($scope.thing.config.variables.map(v => v.name));
        $scope.availableVariables = Array.from(variableSet);
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

    $scope.addParameter = function() {
      if (!$scope.newParameter.key || !$scope.newParameter.value) {
        alert('Please enter both key and value for the new parameter.');
        return;
      }
      
      const exists = $scope.parameters.some(p => p.key === $scope.newParameter.key);
      if (exists) {
        alert('This parameter key already exists.');
        $scope.newParameter = { key: '', value: '' };
        return;
      }

      ApiService.addConfigParameter(id, $scope.newParameter).then(function(respone) {
        $scope.parameters.push(respone.data);
        $scope.newParameter = { key: '', value: '' };
        alert('Parameter added');
      }).catch(() => alert('Error adding parameter'));
    };

    $scope.addVariable = function() {
      if (!$scope.newVariable.name) {
        alert('Please enter a name for the new variable.');
        return;
      }
      const exists = $scope.variables.some(v => v.name === $scope.newVariable.name);
      if (exists) {
        alert('This variable already exists.');
        return;
      }

      ApiService.addTelemetryVariable(id, $scope.newVariable).then(function(response) {
        $scope.variables.push(response.data);
        $scope.availableVariables.push($scope.newVariable.name);

        $scope.newVariable = { name: '' };
        alert('Variable added');
      }).catch(() => alert('Error adding variable'));
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

        if (!$scope.availableVariablesForGraph.includes($scope.newTelemetry.variable)) {
          $scope.availableVariablesForGraph.push($scope.newTelemetry.variable);
        }

        $scope.newTelemetry = {};
      }).catch(() => alert('Error adding telemetric data'));
    };

    $scope.goToMain = function() {
      $location.path('/');
    };
  }]);
