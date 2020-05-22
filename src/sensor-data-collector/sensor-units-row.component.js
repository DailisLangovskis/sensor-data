export default {
    template: require('./partials/units-row.html'),
    bindings: {
        unit: '=',
        group: '=',

    },
    controller: ['$scope', 'sens.sensorUnit.service', 'sens.sensor.service',
        function ($scope, unitService, sensorService) {
            angular.extend($scope, {
                sensorService,
                unitService,
                addSensorTabVisible: false,
                sensorsTabVisible: false,
                existingSensorListVisible: false,
                addNewPhenomenaTabExpanded: false,
                sensorName: '',
                sensorType: '',
                phenomenaId: '',
                newPhenomenaName: '',
                newPhenomenaUnit: '',
                addNewSensor(unitClicked) {
                    if ($scope.addSensorTabVisible) {
                        $scope.addSensorTabVisible = !$scope.addSensorTabVisible;
                        $scope.existingSensorListVisible = false;
                    }
                    else {
                        sensorService.getPhenomenas().then(_ => {
                            $scope.getAllUsableSensors(unitClicked);
                            $scope.sensorsTabVisible = false
                            $scope.addSensorTabVisible = true;
                        })
                    }

                },
                addNewPhenomena(newPhenomenaName, newPhenomenaUnit) {
                    sensorService.addNewPhenomena(newPhenomenaName, newPhenomenaUnit).then(function (response) {
                        if (!response) {
                            $scope.addNewPhenomenaTabExpanded = !$scope.addNewPhenomenaTabExpanded;
                            $scope.newPhenomenaName = '';
                            $scope.newPhenomenaUnit = '';
                        }
                    })
                },
                getUnitSensors(unitClicked) {
                    $scope.addSensorTabVisible = false;
                    $scope.existingSensorListVisible = false;
                    if ($scope.sensorsTabVisible) {
                        $scope.sensorsTabVisible = !$scope.sensorsTabVisible;
                    } else {
                        unitService.getUnitSensors(unitClicked).then(function (response) {
                            if (response) {
                                window.alert("There where no sensors found in this unit!")
                            }
                            else {
                                $scope.sensorsTabVisible = true;
                            }
                        })
                    }
                },
                getAllUsableSensors(unitClicked) {
                    sensorService.getAllUsableSensors(unitClicked).then(function (response) {
                        if (response) return;
                        else {
                            $scope.existingSensorListVisible = true;
                        }
                    })
                },
                saveSensor(sensorName, sensorType, phenomenaId, unitClicked) {
                    sensorService.saveSensors(sensorName, sensorType, phenomenaId, unitClicked).then(function (response) {
                        if (!response) {
                            $scope.sensorName = '';
                            $scope.sensorType = '';
                            $scope.phenomenaId = '';
                        }
                    })
                },
                saveAddedSensors(unitClicked) {
                    sensorService.saveAddedSensors(unitClicked).then(_ => {
                        $scope.sensorsTabVisible = false;
                        $scope.getUnitSensors(unitClicked);
                    })
                },
                checkUnit(checkedUnit) {
                    checkedUnit.checked =! checkedUnit.checked;
                    unitService.selectAllUnitsSensors(checkedUnit);
                },
            });
            $scope.$on('logout', function () {
                $scope.addSensorTabVisible = false;
                $scope.sensorsTabVisible = false;
                $scope.existingSensorListVisible = false;
                $scope.addNewPhenomenaTabExpanded = false;
                $scope.sensorName = '';
                $scope.sensorType = '';
                $scope.phenomenaId = '';
                $scope.newPhenomenaName = '';
                $scope.newPhenomenaUnit = '';
                unitService.unitsSensors = [];
                unitService.unitSelected = '';
                unitService.allUnits = [];
                unitService.checkedUnits = [];
            })
        }
    ]
}