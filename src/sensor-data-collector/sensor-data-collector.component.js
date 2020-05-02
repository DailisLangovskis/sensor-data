export default {
    template: require('./partials/sensor-data-collector.html'),
    controller: ['$scope', 'sens.auth.service', 'sens.sensorGroup.service',
        function ($scope, authService, groupService) {
            angular.extend($scope, {
                authService,
                groupService,
                selectDeselectAllGroups: groupService.selectDeselectAllGroups,
                deleteSelectedGroups: groupService.deleteSelectedGroups,
                addGroupTabVisible: false,
                groupsTabVisible: false,
                groupName: '',
                //show users available groups
                showGroups() {
                    $scope.addGroupTabVisible = false;
                    $scope.groupName = '';
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
                //save a new group for logged in user
                saveGroup() {
                    groupService.saveGroup($scope.groupName).then(function (response) {
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