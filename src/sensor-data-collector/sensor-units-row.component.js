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

                showSensors(unitClicked) {
                    if ($scope.sensorsTabVisible) {
                        $scope.sensorsTabVisible = !$scope.sensorsTabVisible;
                    }
                    else {
                        unitService.showUnitSensors(unitClicked).then(function (response) {
                            if (!response) {
                                window.alert("No units found for this group!");
                            }
                            else {
                                $scope.sensorsTabVisible = !$scope.sensorsTabVisible;
                            }
                        })
                    }
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
                unitService.btnSelectDeseletClicked = true;
                unitService.unitsSensors = [];
                unitService.featureCollection = '';
                unitService.unitSelected = '';
                unitService.allUnits = [];
            })
        }
    ]
}