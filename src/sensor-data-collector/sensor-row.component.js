import moment from 'moment';
export default {
    template: require('./partials/sensor-row.html'),
    bindings: {
        sensor: '=',
        unit: '='

    },
    controller: ['$scope', 'sens.sensor.service', function ($scope, sensorService) {
        angular.extend($scope, {
            sensorService,
            dataRequest: sensorService.dataRequest,
            phenomena: '',
            sensorType: '',
            measuredValue: '',
            measurementTime: moment.moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ"),
            addSensorTabVisible: false,
            showChart: false,
            labels: [],
            data: [],
            series: [],
            options: {},
            datasetOverride: [],
            addData(sensorClicked) {
                sensorService.getSensorPhenomena(sensorClicked)
                    .then(_ => {
                        $scope.phenomena = sensorService.phenomena;
                    })
                    .catch(function (error) {
                        sensorService.newAlert(error, 2000, "red");;
                    })
                $scope.sensorType = sensorClicked.sensor_type;
                $scope.measurementTime = moment.moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ");
                $scope.addSensorTabVisible = !$scope.addSensorTabVisible;
            },
            saveData(sensorClicked, measuredValue, measurementTime, whichUnit) {
                sensorService.saveData(sensorClicked, measuredValue, measurementTime, whichUnit).then(function (response) {
                    if (!response) {
                        $scope.addSensorTabVisible = !$scope.addSensorTabVisible;
                        $scope.measuredValue = '';
                        $scope.measurementTime = moment.moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ");
                    }
                })
            },
        });
        $scope.$on('logout', function () {
            $scope.phenomena = '';
            $scope.sensorType = '';
            $scope.measuredValue = '';
            $scope.measurementTime = moment.moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ");
            $scope.addSensorTabVisible = false;
            sensorService.sensors = [];
            sensorService.phenomena = [];
            sensorService.phenomena = '';
            sensorService.sensorCollectedData = [];
            sensorService.sensorsWithObs = [];
            $scope.showChart = false;
            $scope.labels = [];
            $scope.data = [];
            $scope.series = [];
            $scope.options = {};
            $scope.datasetOverride = [];
        })
    }]
};
