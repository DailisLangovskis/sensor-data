export default {
    template: require('./partials/groups-row.html'),
    bindings: {
        group: '=',

    },
    controller: ['$scope', 'sens.sensorDataCollector.service', function ($scope, sensorService) {
        angular.extend($scope, {
            sensorService,
            selectedGroupUnits: [],
            unitsTabVisible: false,
            dataRequest(groupClicked) {
                console.log("get Groups units")

            },

            showUnits(groupClicked) {
                sensorService.getGroupUnits(groupClicked).then(function (response) {
                    if (response != true) return;
                    else {
                        // $scope.selectedGroupUnits = sensorService.selectedGroupUnits;
                        // console.log($scope.selectedGroupUnits)
                        $scope.unitsTabVisible = !$scope.unitsTabVisible;
                    }
                })
            }
        });
    }]
};
