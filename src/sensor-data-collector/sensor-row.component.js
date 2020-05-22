import moment from 'moment';
export default {
    template: require('./partials/sensor-row.html'),
    bindings: {
        sensor: '=',
        unit: '='

    },
    controller: ['$scope', 'sens.sensor.service', 'HsLayoutService', '$compile', function ($scope, sensorService, layoutService, $compile) {
        angular.extend($scope, {
            sensorService,
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
            checkSensor(checkedSensor) {
                checkedSensor.checked =! checkedSensor.checked;
            },
            buildChart(sensorClicked, unitSelected, response) {
                var collectedData = response.filter(data => data.sensor_id == sensorClicked && data.unit_id == unitSelected);
                var labels = collectedData.map(data => data.time_stamp);
                var values = collectedData.map(data => data.observed_value);
                var chartTitle = collectedData[0].phenomenon_name + " " + collectedData[0].unit;
                var ctx = document.querySelector("#sensor-data-chart").getContext('2d');
                let myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels, // Our labels
                        datasets: [{
                            label: chartTitle, // Name the series
                            lineTension: 0.1,
                            pointRadius: 2,
                            pointHowerRadius: 5,
                            borderCapStyle: 'butt',
                            borderDashOffset: 0.0,
                            fillColor: 'rgba(0,0,0,0)',
                            data: values, // Our values
                            backgroundColor: [ // Specify custom colors
                                'rgba(220, 99, 99, 0.2)'
                            ],
                            borderColor: [ // Add custom color borders
                                'rgba(220,99,99,0.7)'
                            ],
                            pointBackgroundColor: 'green'
                        }]
                    },
                    options: {
                        legend: {
                            display: true
                        },
                        responsive: true, // Instruct chart js to respond nicely.
                        maintainAspectRatio: true, // Add to prevent default behavior of full-width/height 
                        scales: {
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: "Date"
                                },
                                ticks: {
                                    maxRotation: 0
                                },
                                distribution: 'linear',
                                type: "time",
                                time: {
                                    unit: 'second',
                                    displayFormats: {
                                        second: 'hh:mm:ss',
                                        minute: 'hh:mm',
                                        hour: 'hhA',
                                        day: 'MM-DD-YYYY',
                                        month: 'MM-YYYY',
                                        quarter: 'YYYY-[Q]Q',
                                        year: 'YYYY'
                                    },
                                },

                            }],
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: chartTitle,
                                },
                                ticks: {
                                    beginAtZero: true,
                                }
                            }]
                        },
                        plugins: {
                            zoom: {
                                pan: {
                                    enabled: true,
                                    mode: "x",
                                    speed: 100,
                                    threshold: 100
                                },
                                // Container for zoom options
                                zoom: {
                                    enabled: true,
                                    drag: false,
                                    mode: "x",
                                    limits: {
                                        max: 10,
                                        min: 0.5
                                    }
                                }
                            }
                        }
                    },
                });
                return myChart;
            }
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
            $scope.showChart = false;
            $scope.labels = [];
            $scope.data = [];
            $scope.series = [];
            $scope.options = {};
            $scope.datasetOverride = [];
        })
    }]
};
