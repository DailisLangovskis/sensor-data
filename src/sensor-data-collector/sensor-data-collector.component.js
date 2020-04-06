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
                addGroup() {
                    $scope.addGroupTabVisible = !$scope.addGroupTabVisible
                },
                showGroups() {
                    if(groupService.groups == '') return window.alert("There were no groups found!") 
                    else{
                        $scope.groupsTabVisible = !$scope.groupsTabVisible
                    }
                },
                saveGroup() {
                    groupService.saveGroups($scope.groupName).then(function (response) {
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