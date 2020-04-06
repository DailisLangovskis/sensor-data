export default {
    template: require('./partials/sensor-data-collector.html'),
    controller: ['$scope', 'sens.auth.service', 'sens.sensorDataCollector.service', 'sens.loginRegister.service',
        function ($scope, authService, sensorService, loginRegisterService) {
            angular.extend($scope, {
                loginRegisterService,
                sensorService,
                selectDeselectAllGroups: sensorService.selectDeselectAllGroups,
                deleteSelectedGroups: sensorService.deleteSelectedGroups,
                addGroupTabVisible: false,
                groupsTabVisible: false,
                groupName: '',
                addGroup() {
                    $scope.addGroupTabVisible = !$scope.addGroupTabVisible
                },
                showGroups() {
                    $scope.groupsTabVisible = !$scope.groupsTabVisible
                },
                saveGroup() {
                    sensorService.saveGroups($scope.groupName).then(function (response) {
                        if (response == false) {
                            $scope.addGroupTabVisible = !$scope.addGroupTabVisible;
                            $scope.groupName = '';
                        }
                    })
                },
                logout: authService.logout
            })
        }
    ]
}