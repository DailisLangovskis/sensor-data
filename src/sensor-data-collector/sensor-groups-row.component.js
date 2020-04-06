export default {
    template: require('./partials/groups-row.html'),
    bindings: {
        group: '=',

    },
    controller: ['$scope', 'sens.sensorGroup.service', function ($scope, groupService) {
        angular.extend($scope, {
            groupService,
            selectDeselectAllUnits:groupService.selectDeselectAllUnits,
            unitsTabVisible: false,

            showUnits(groupClicked) {
                groupService.getGroupUnits(groupClicked).then(function (response) {
                    if (response != true) return;
                    else {
                        $scope.unitsTabVisible = !$scope.unitsTabVisible;
                    }
                })
            }
        });
    }]
};
