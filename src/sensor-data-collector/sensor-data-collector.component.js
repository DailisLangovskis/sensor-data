export default {
    template: require('./partials/sensor-data-collector.html'),
    controller: ['$scope', 'sens.auth.service', 'sens.sensorGroup.service', 'sens.loginRegister.service',
        function ($scope, authService, groupService, loginRegisterService) {
            angular.extend($scope, {
                loginRegisterService,
                groupService,
                selectDeselectAllGroups: groupService.selectDeselectAllGroups,
                deleteSelectedGroups: groupService.deleteSelectedGroups,
                addGroupTabVisible: false,
                groupsTabVisible: false,
                groupName: '',
                showGroups() {
                    $scope.addGroupTabVisible = false;
                    if ($scope.groupsTabVisible) {
                        $scope.groupsTabVisible = !$scope.groupsTabVisible;
                    }
                    else {
                        groupService.getGroups().then(function (response) {
                            if (!response) {
                                window.alert("No groups found for this user!")
                            }
                            else {
                                $scope.groupsTabVisible = !$scope.groupsTabVisible;
                            }

                        })
                    }
                },
                // getAllUsersUnits(){
                //     unitService.getAllUsersUnits()
                // },
                // getAllUsersSensors(){
                //     sensorService.getAllUsersSensors()
                // },
                saveGroup() {
                    groupService.saveGroups($scope.groupName).then(function (response) {
                        if (!response) {
                            $scope.addGroupTabVisible = !$scope.addGroupTabVisible;
                            $scope.groupName = '';
                        }
                    })
                },
                deleteSelectedGroups() {
                    groupService.deleteSelectedGroups().then(function (response) {
                        if (response) {
                            $scope.groupsTabVisible = false;
                        }
                    })
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
                    authService.logout();
                }
            })
        }
    ]
}