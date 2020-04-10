import moment from 'moment';
export default {
    template: require('./partials/sensor-row.html'),
    bindings: {
        sensor: '=',
        unit: '=',

    },
    controller: ['$scope', 'sens.sensor.service', function ($scope, sensorService) {
        angular.extend($scope, {
            sensorService,
            phenomena: '',
            sensorType: '',
            measuredValue: '',
            measurementTime: '',
            addSensorTabVisible: false,

            addData(sensorClicked) {
                sensorService.getSensorPhenomena(sensorClicked)
                    .then(_ => {
                        $scope.phenomena = sensorService.phenomena;
                    })
                    .catch(function (error) {
                        sensorService.newAlert(error, 2000, "red");;
                    })
                $scope.sensorType = sensorClicked.sensor_type;
                $scope.measurementTime = new Date();
                $scope.addSensorTabVisible = !$scope.addSensorTabVisible;
            },
            saveData(sensorClicked, measuredValue, measurementTime, whichUnit) {
                measurementTime = moment.moment(measurementTime).format("YYYY-MM-DD HH:mm:ssZ");
                sensorService.saveData(sensorClicked, measuredValue, measurementTime, whichUnit).then(function (response) {
                    if (response == false) {
                        $scope.addSensorTabVisible = !$scope.addSensorTabVisible;
                        $scope.measuredValue = '';
                        $scope.measurementTime = new Date();
                    }
                })
            }
        });
        $scope.$on('logout', function () {
            $scope.phenomena = '';
            $scope.sensorType = '';
            $scope.measuredValue = '';
            $scope.measurementTime = new Date();
            $scope.addSensorTabVisible = false;
            sensorService.btnSelectDeseletClicked = true;
            sensorService.sensors = [];
            sensorService.phenomena = [];
            sensorService.phenomena = '';
        })
    }]
};
