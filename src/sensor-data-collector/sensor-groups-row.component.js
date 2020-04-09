export default {
    template: require('./partials/groups-row.html'),
    bindings: {
        group: '=',

    },
    controller: ['$scope', 'sens.sensorGroup.service', 'sens.sensorUnit.service', function ($scope, groupService, unitService) {
        angular.extend($scope, {
            unitService,
            groupService,
            selectDeselectAllUnits: groupService.selectDeselectAllUnits,
            deleteSelectedUnits: groupService.deleteSelectedUnits,
            unitsTabVisible: false,
            addUnitTabVisible: false,
            unitName: '',
            description: '',
            addNewUnitTabExpanded: false,
            existingUnitListVisible: false,

            showUnits(groupClicked) {
                if ($scope.unitsTabVisible) {
                    $scope.unitsTabVisible = !$scope.unitsTabVisible;
                }
                else {
                    groupService.getGroupUnits(groupClicked).then(function (response) {
                        if (!response) {
                            window.alert("No units found for this group!")
                        }
                        else {
                            $scope.unitsTabVisible = !$scope.unitsTabVisible;
                        }

                    })
                }

            },
            getAllUsersUnits() {
                $scope.addNewUnitTabExpanded = false;
                unitService.getAllUsersUnits().then(function (response) {
                    if (!response) {
                        window.alert("There where no units found for this user!");
                    }
                    else {
                        $scope.existingUnitListVisible = !$scope.existingUnitListVisible;
                    }
                })
            },
            saveAddedUnits() {
                unitService.saveAddedUnits();
                $scope.existingUnitListVisible = !$scope.existingUnitListVisible;
            }
        });
        $scope.$on('logout', function () {
            $scope.unitsTabVisible = false;
            $scope.addUnitTabVisible = false;
            $scope.unitName = '';
            $scope.description = '';
            $scope.addNewUnitTabExpanded = false;
            $scope.existingUnitListVisible = false;
        })
    }]
};
