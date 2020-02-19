import moment, { now } from 'moment';
export default {
    template: require('./partials/sensor-row.html'),
    bindings: {
        sensor: '=',

    },
    controller: ['$scope', 'sens.sensorDataCollector.service', function ($scope, sensorService) {
        angular.extend($scope, {
            sensorService,
            phenomena: '',
            sensorType: '',
            measuredValue: '',
            measurementTime: new Date(),
            dataTabExpanded: false,
            search: '',
            refSys: '',
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
            saveData(measuredValue, time,referencingSystem) {
                time = moment.moment(time).format("YYYY-MM-DD HH:mm:ssZ");
                console.log(time);
                $scope.dataTabExpanded = !$scope.dataTabExpanded;
                $scope.measuredValue = '';
                $scope.refSys = '';
                $scope.search = '';
            }
        });
    }]
};
