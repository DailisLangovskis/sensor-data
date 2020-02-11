export default {
    template: require('./partials/sensor-data-collector.html'),
    controller: ['$scope', 'sens.sensorDataCollector.service',
        function ($scope, sensorService) {
                sensorService,
                angular.extend($scope, {
                    addSensorTabVisible: false,
                    sensorName: '',
                    sensorType: '',
                    phenomenon: '',
                    phenomenonUnit: '',
                    sensorList: sensorService.sensorNames,
                    addSensor() {
                        $scope.addSensorTabVisible = !$scope.addSensorTabVisible
                    },
                    saveSensor(sensorName, sensorType, phenomenon, phenomenonUnit) {
                        sensorService.saveSensors(sensorName, sensorType, phenomenon, phenomenonUnit);
                        $scope.addSensorTabVisible = !$scope.addSensorTabVisible;
                        $scope.sensorName = '';
                        $scope.sensorType = '';
                        $scope.phenomenon = '';
                        $scope.phenomenonUnit = '';
                    }
                })
        }
    ]
}