export default {
    template: require('./partials/units-row.html'),
    bindings: {
        unit: '=',

    },
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
            })
        }
    ]
}