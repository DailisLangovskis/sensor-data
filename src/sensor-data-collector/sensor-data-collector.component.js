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
                phenomenaId: '',
                addSensor() {
                    $scope.addSensorTabVisible = !$scope.addSensorTabVisible
                },
                showSensors() {
                    $scope.sensorsTabVisible = !$scope.sensorsTabVisible
                },
                saveSensor(sensorName, sensorType, phenomenaId) {
                    sensorService.saveSensors(sensorName, sensorType, phenomenaId).then(function (response) {
                        if (response == false) {
                            $scope.addSensorTabVisible = !$scope.addSensorTabVisible;
                            $scope.sensorName = '';
                            $scope.sensorType = '';
                            $scope.phenomenaId = '';
                        }
                    })
                }
            })
        }
    ]
}