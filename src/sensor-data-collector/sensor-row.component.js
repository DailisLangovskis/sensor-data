import moment from 'moment';
export default {
    template: require('./partials/sensor-row.html'),
    bindings: {
        sensor: '=',
        unit: '=',

    },
    controller: ['$scope', 'sens.sensor.service', 'hs.layout.service', '$compile', function ($scope, sensorService, layoutService, $compile) {
        angular.extend($scope, {
            sensorService,
            phenomena: '',
            sensorType: '',
            measuredValue: '',
            measurementTime: '',
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
                $scope.measurementTime = new Date();
                $scope.addSensorTabVisible = !$scope.addSensorTabVisible;
            },
            saveData(sensorClicked, measuredValue, measurementTime, whichUnit) {
                measurementTime = moment.moment(measurementTime).format("YYYY-MM-DD HH:mm:ssZ");
                console.log(measurementTime);
                sensorService.saveData(sensorClicked, measuredValue, measurementTime, whichUnit).then(function (response) {
                    if (!response) {
                        $scope.addSensorTabVisible = !$scope.addSensorTabVisible;
                        $scope.measuredValue = '';
                        $scope.measurementTime = new Date();
                    }
                })
            },
            dataRequest(sensorClicked, unitSelected) {
                sensorService.dataRequest(sensorClicked, unitSelected).then(function (response) {
                    if (response == '') {
                        window.alert("There was no data found for this sensor in this unit!")
                    }
                    else {

                        if (document.querySelector('#chart-dialog')) {
                            var parent = document.querySelector('#chart-dialog').parentElement;
                            parent.parentElement.removeChild(parent);
                        }
                        var el = angular.element('<div sens.chart-directive></div>');
                        layoutService.dialogAreaElement.appendChild(el[0]);
                        $compile(el)($scope);
                        $scope.buildChart(sensorClicked, unitSelected, response);
                    }
                })
            },
            buildChart(sensorClicked, unitSelected, response) {
                var collectedData = response.filter(data => data.sensor_id == sensorClicked && data.unit_id == unitSelected);
                var labels = collectedData.map(data => data.time_stamp);
                console.log(labels);
                var values = collectedData.map(data => data.observed_value);
                var chartTitle = collectedData[0].phenomenon_name + " " + collectedData[0].unit;
                var ctx = document.querySelector("#sensor-data-chart").getContext('2d');
                let myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels, // Our labels
                        datasets: [{
                            fillColor: 'rgba(0,0,0,0)',
                            label: chartTitle, // Name the series
                            data: values, // Our values
                            backgroundColor: [ // Specify custom colors
                                'rgba(220, 99, 99, 0.2)'
                            ],
                            borderColor: [ // Add custom color borders
                                'rgba(220,99,99,0.7)'
                            ],
                            pointBackgroundColor: 'black'
                        }]
                    },
                    options: {
                        legend: {
                            display: false
                        },
                        responsive: true, // Instruct chart js to respond nicely.
                        maintainAspectRatio: true, // Add to prevent default behavior of full-width/height 
                        scales: {
                            xAxes: [{

                                type: "time",
                                distribution: 'series',
                                display: true,
                                time: {
                                unit: 'hour',
                                }
                            }],
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: chartTitle,
                                    ticks: {
                                        beginAtZero: false
                                    }
                                }
                            }]
                        },
                    }
                });
                return myChart;
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
            sensorService.sensorCollectedData = [];
            $scope.showChart = false;
            $scope.labels = [];
            $scope.data = [];
            $scope.series = [];
            $scope.options = {};
            $scope.datasetOverride = [];
        })
    }]
};
