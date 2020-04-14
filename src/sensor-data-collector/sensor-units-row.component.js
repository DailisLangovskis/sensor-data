export default {
    template: require('./partials/units-row.html'),
    bindings: {
        unit: '=',

    },
    controller: ['$scope', 'sens.sensorUnit.service', 'sens.sensor.service',
        function ($scope, unitService, sensorService) {
            angular.extend($scope, {
                sensorService,
                unitService,
                selectDeselectAllSensors: unitService.selectDeselectAllSensors,
                addSensorTabVisible: false,
                addNewSensorTabExpanded: false,
                sensorsTabVisible: false,
                existingSensorListVisible: false,
                sensorName: '',
                sensorType: '',
                phenomenaId: '',
                addNewSensor() {
                    sensorService.getPhenomenas().then(_ => {
                        $scope.addNewSensorTabExpanded = !$scope.addNewSensorTabExpanded;
                        $scope.existingSensorListVisible = false
                    })
                },
                showSensors(unitClicked) {
                    $scope.addSensorTabVisible = false;
                    if ($scope.sensorsTabVisible) {
                        $scope.sensorsTabVisible = !$scope.sensorsTabVisible;
                    }
                    else {
                        unitService.showUnitSensors(unitClicked).then(function (response) {
                            if (!response) {
                                window.alert("No sensors found for this unit!")
                            }
                            else {
                                $scope.sensorsTabVisible = !$scope.sensorsTabVisible;
                            }
                        })
                    }
                },
                getAllUsersSensors() {
                    $scope.addNewSensorTabExpanded = false;
                    sensorService.getAllUsersSensors().then(function (response) {
                        if (!response) {
                            window.alert("There where no sensors found for this user!");
                        }
                        else {
                            $scope.existingSensorListVisible = !$scope.existingSensorListVisible;
                        }
                    })
                },
                saveSensor(sensorName, sensorType, phenomenaId, unitClicked) {
                    sensorService.saveSensors(sensorName, sensorType, phenomenaId, unitClicked).then(function (response) {
                        if (!response) {
                            $scope.addNewSensorTabExpanded = !$scope.addNewSensorTabExpanded;
                            $scope.sensorName = '';
                            $scope.sensorType = '';
                            $scope.phenomenaId = '';
                        }
                    })
                },
                saveAddedSensors(unitClicked) {
                    sensorService.saveAddedSensors(unitClicked).then(_ => {
                        $scope.existingSensorListVisible = !$scope.existingSensorListVisible;
                    })
                },
                deleteSelectedSensors(unitClicked){
                    unitService.deleteSelectedSensors(unitClicked).then(function(response){
                        if(response){
                            $scope.sensorsTabVisible = false;
                        }
                    })
                }
            });
            $scope.$on('logout', function () {
                $scope.addSensorTabVisible = false;
                $scope.sensorsTabVisible = false;
                $scope.addNewSensorTabExpanded = false;
                $scope.existingSensorListVisible = false;
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