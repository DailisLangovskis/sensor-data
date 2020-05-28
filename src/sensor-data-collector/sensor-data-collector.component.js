export default {
    template: require('./partials/sensor-data-collector.html'),
    controller: ['$scope', 'sens.auth.service', 'sens.sensorGroup.service', 'sens.sensorUnit.service', 'sens.sensor.service',
        function ($scope, authService, groupService, unitService, sensorService) {
            angular.extend($scope, {
                sensorService,
                authService,
                groupService,
                selectDeselectAllGroups: groupService.selectDeselectAllGroups,
                deleteSelectedGroups: groupService.deleteSelectedGroups,
                dataRequest: sensorService.dataRequest,
                addGroupTabVisible: false,
                groupsTabVisible: false,
                activeSensorListVisible: false,
                groupName: '',
                //show users available groups
                addGroup() {
                    if ($scope.addGroupTabVisible) {
                        $scope.addGroupTabVisible = !$scope.addGroupTabVisible
                    } else {
                        $scope.groupName = '';
                        $scope.addGroupTabVisible = true;
                    }

                },
                showActiveSensorList() {
                    if ($scope.activeSensorListVisible) {
                        $scope.activeSensorListVisible = !$scope.activeSensorListVisible;
                    } else {
                        $scope.activeSensorListVisible = true;
                    }
                },
                showGroups() {
                    $scope.addGroupTabVisible = false;
                    $scope.groupName = '';
                    if ($scope.groupsTabVisible) {
                        $scope.groupsTabVisible = !$scope.groupsTabVisible;
                    }
                    else {
                        groupService.getGroups().then(function (response) {
                            if (response) {
                                window.alert("No groups found for this user!")
                            }
                            else {
                                $scope.groupsTabVisible = true;
                            }

                        })
                    }
                },
                //save a new group for logged in user
                saveGroup() {
                    groupService.saveGroup($scope.groupName).then(function (response) {
                        if (!response) {
                            $scope.addGroupTabVisible = !$scope.addGroupTabVisible;
                            $scope.groupName = '';
                            $scope.groupsTabVisible = true;
                        }
                    })
                },
                deleteSelected() {
                    var deleteAll = window.confirm("Do you really want to delete all selected items?");
                    if (deleteAll) {
                        var unitsChecked = groupService.selectedGroupUnits.filter(u => u.checked == true);
                        if (unitsChecked.length != 0) {
                            unitsChecked.forEach(unit => {
                                unitService.selectAllUnitsSensors(unit)

                            });
                        }
                        if (unitService.unitsSensors.filter(s => s.checked == true).length != 0) {
                            unitService.deleteSelectedSensors();
                        }
                        if (groupService.selectedGroupUnits.filter(u => u.checked == true).length != 0) {
                            groupService.deleteSelectedUnits();
                        }
                        groupService.deleteSelectedGroups().then(_ => {
                            groupService.newAlert("All selected items deleted!", 2000, "green")
                            $scope.groupsTabVisible = false;
                            $scope.activeSensorListVisible = false;
                            $scope.showGroups();
                            sensorService.getEachSensorLastvalue();
                        })
                    }
                },
                deleteActiveSensors() {
                    var deleteAll = window.confirm("Do you really want to delete all selected active sensors?");
                    if (deleteAll) {
                        if (sensorService.sensorsWithObs.filter(s => s.checked == true).length != 0) {
                            sensorService.deleteActiveSensors().then(_ => {
                                $scope.activeSensorListVisible = false;
                                $scope.groupsTabVisible = false;
                                $scope.showGroups();
                                $scope.showActiveSensorList();
                            });
                        }
                    }
                },
                logout() {
                    $scope.$broadcast('logout');
                    $scope.$emit('logout');
                    $scope.groupName = '';
                    groupService.groups = [],
                        groupService.selectedGroupUnits = [],
                        groupService.groupSelected = '',
                        $scope.groupsTabVisible = false;
                    $scope.addGroupTabVisible = false;
                    $scope.activeSensorListVisible = false;
                    authService.logout();
                }
            })
        }
    ]
}