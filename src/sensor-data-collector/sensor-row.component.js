export default {
    template: require('./partials/sensor-row.html'),
    bindings: {
        sensor: '=',

    },
    controller: ['$scope', 'sens.sensorDataCollector.service', function ($scope, sensorService) {
        angular.extend($scope, {
            phenomena: '',
            sensorType: '',
            measuredValue: '',
            measurementTime: '',
            dataTabExpanded: false,
            dataRequest(sensorClicked) {
                console.log($scope.time);
            },
            addData(sensorClicked) {
                sensorService.getSelectedPhenomena(sensorClicked)
                    .then(_ => {
                        $scope.phenomena = sensorService.phenomena;
                    })
                    .catch(function (error) {
                        console.error("Error!", error);
                    })
                $scope.sensorType = sensorClicked.sensor_type;
                $scope.dataTabExpanded = !$scope.dataTabExpanded;
            },
            saveData(measuredValue) {
                $scope.dataTabExpanded = !$scope.dataTabExpanded;
                $scope.measuredValue = '';
            }
        });
    }]
};
