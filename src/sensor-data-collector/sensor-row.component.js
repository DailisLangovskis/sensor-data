export default {
    template: require('./partials/sensor-row.html'),
    bindings: {
        sensor: '=',

    },
    controller: ['$scope', function ($scope) {
        angular.extend($scope, {
            measurement: '',
            measuredValue: '',
            dataTabExpanded: false,
            dataRequest() {

            },
            addData() {
                $scope.dataTabExpanded = !$scope.dataTabExpanded;
            },
            saveData(measurement, measuredValue) {
                console.log(measurement, measuredValue);
                $scope.dataTabExpanded = !$scope.dataTabExpanded;
                $scope.measurement = '';
                $scope.measuredValue = '';
            }
        });
    }]
};
