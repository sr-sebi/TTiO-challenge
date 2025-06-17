angular.module('myApp.core')
  .factory('ApiService', ['$http', function($http) {
    const baseUrl = 'http://localhost:4000/api';

    return {
      getThings: function() {
        return $http.get(`${baseUrl}/things`);
      },
      getThingById: function(id) {
        return $http.get(`${baseUrl}/things/${id}`);
      },
      getThingVariableHistory: function(thingId, variable) {
        return $http.get(`${baseUrl}/things/${thingId}/${variable}`);
      },
      addTelemetryData: function(id, telemetryData) {
        return $http.post(`${baseUrl}/things/${id}/telemetry`, telemetryData);
      },
      updateThingConfig: function(id, newConfig) {
        return $http.patch(`${baseUrl}/things/${id}`, newConfig);
      },
    };
  }]);
