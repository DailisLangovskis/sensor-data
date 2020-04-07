export default {
    template: require('./partials/units-row.html'),
    bindings: {
        unit: '=',

    },
    controller: ['$scope', 'sens.sensorUnit.service',
        function ($scope, unitService) {
            angular.extend($scope, {
                unitService,
                selectDeselectAllSensors: unitService.selectDeselectAllSensors,
                deleteSelectedSensors: unitService.deleteSelectedSensors,
                addSensorTabVisible: false,
                sensorsTabVisible: false,
                sensorName: '',
                sensorType: '',
                phenomenaId: '',
                addSensor() {
                    $scope.addSensorTabVisible = !$scope.addSensorTabVisible
                },
                showSensors(unitClicked) {
                    unitService.showUnitSensors(unitClicked).then(function (response) {
                        if (response != true) return;
                        else {
                            $scope.sensorsTabVisible = !$scope.sensorsTabVisible;
                        }
                    })
                },
                saveSensor() {
                    unitService.saveSensors($scope.sensorName, $scope.sensorType, $scope.phenomenaId).then(function (response) {
                        if (response == false) {
                            $scope.addSensorTabVisible = !$scope.addSensorTabVisible;
                            $scope.sensorName = '';
                            $scope.sensorType = '';
                            $scope.phenomenaId = '';
                        }
                    })
                },
            });
            $scope.$on('logout', function () {
                $scope.addSensorTabVisible = false;
                $scope.sensorsTabVisible = false;
                $scope.sensorName = '';
                $scope.sensorType = '';
                $scope.phenomenaId = '';
                unitService.btnSelectDeseletClicked= true;
                unitService.unitsSensors= [];
                unitService.featureCollection= '';
            })
        }
    ]
}