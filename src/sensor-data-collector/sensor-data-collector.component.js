export default {
    template: require('./partials/sensor-data-collector.html'),
    controller: ['$scope', 'sens.sensorDataCollector.service',
        function ($scope, sensorService) {
            angular.extend($scope, {
                sensorService,
                selectDeselectAllSensors: sensorService.selectDeselectAllSensors,
                deleteSelectedSensors: sensorService.deleteSelectedSensors,
                addSensorTabVisible: false,
                sensorsTabVisible: false,
                sensorName: '',
                sensorType: '',
                phenomena: '',
                addSensor() {
                    $scope.addSensorTabVisible = !$scope.addSensorTabVisible
                },
                showSensors() {
                    $scope.sensorsTabVisible = !$scope.sensorsTabVisible
                },
                saveSensor(sensorName, sensorType, phenomena) {
                    sensorService.saveSensors(sensorName, sensorType, phenomena);
                    $scope.addSensorTabVisible = !$scope.addSensorTabVisible;
                    $scope.sensorName = '';
                    $scope.sensorType = '';
                    $scope.phenomena = '';
                }
            })
        }
    ]
}