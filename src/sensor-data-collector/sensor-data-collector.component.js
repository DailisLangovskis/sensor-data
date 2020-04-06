
export default {
    template: require('./partials/sensor-data-collector.html'),
    controller: ['$scope', 'sens.auth.service', 'sens.sensorDataCollector.service', 'sens.loginRegister.service',
        function ($scope, authService, sensorService, loginRegisterService) {
            angular.extend($scope, {
                loginRegisterService,
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
                logout:authService.logout           
            })
        }
    ]
}