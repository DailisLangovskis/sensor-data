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
                showUnitSensors(unitClicked) {
                    $scope.addSensorTabVisible = false;
                    if ($scope.sensorsTabVisible) {
                        $scope.sensorsTabVisible = !$scope.sensorsTabVisible;
                    } else {
                        unitService.showUnitSensors(unitClicked).then(function (response) {
                            if (!response) {
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
                        if(response) return;
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
                        $scope.showUnitSensors(unitClicked);
                        $scope.existingSensorListVisible = false;
                    })
                },
                deleteSelectedSensors(unitClicked) {
                    unitService.deleteSelectedSensors(unitClicked).then(function (response) {
                        if (!response) {
                            $scope.sensorsTabVisible = false;
                            $scope.showUnitSensors(unitClicked);
                        } else{
                            $scope.sensorsTabVisible = false;
                        }
                    })
                }
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
                unitService.btnSelectDeseletClicked = true;
                unitService.unitsSensors = [];
                unitService.featureCollection = '';
                unitService.unitSelected = '';
                unitService.allUnits = [];
            })
        }
    ]
}