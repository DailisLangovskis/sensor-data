export default {
    template: require('./partials/sensor-data-collector.html'),
    controller: ['$scope', 'sens.sensorDataCollector.service', 'hs.query.baseService', '$window', '$http', 'sens.auth.service', 
        function ($scope, sensorService, queryBaseService, $window, $http, authService) {
            angular.extend($scope, {
                queryBaseService,
                sensorService,
                selectDeselectAllSensors: sensorService.selectDeselectAllSensors,
                deleteSelectedSensors: sensorService.deleteSelectedSensors,
                addSensorTabVisible: false,
                sensorsTabVisible: false,
                sensorName: '',
                sensorType: '',
                phenomenaId: '',
                addSensor() {
                    $scope.addSensorTabVisible = !$scope.addSensorTabVisible
                },
                showSensors() {
                    $scope.sensorsTabVisible = !$scope.sensorsTabVisible
                },
                saveSensor() {
                    sensorService.saveSensors($scope.sensorName, $scope.sensorType, $scope.phenomenaId).then(function (response) {
                        if (response == false) {
                            $scope.addSensorTabVisible = !$scope.addSensorTabVisible;
                            $scope.sensorName = '';
                            $scope.sensorType = '';
                            $scope.phenomenaId = '';
                        }
                    })
                },
                logout() {
                    authService.clearAllToken();
                    $http.defaults.headers.common['authorization'] = '';
                }
            })         
        }
    ]
}