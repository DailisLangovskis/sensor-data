export default ['$http', 'HsConfig', 'sens.sensorGroup.service', '$compile', '$rootScope', 'HsLayoutService',
    function ($http, config, groupService, $compile, $rootScope, HsLayoutService) {
        var me = this;
        var get = setInterval(function () { if (me.sensorsWithObs.length != 0) me.getEachSensorLastvalue(); }, 30000);
        angular.extend(me, {
            sensorsWithObs: [],
            sensors: [],
            phenomenas: [],
            phenomena: '',
            sensorCollectedData: [],
            chartSensorId: '',
            chartUnitId: '',
            newAlert: groupService.newAlert,
            getAllUsableSensors(unitClicked) {
                return $http.get(config.sensorApiEndpoint + '/sensors/data/' + unitClicked)
                    .then(function success(response) {
                        if (response.data.length != 0) {
                            me.sensors = response.data;
                            return false;
                        } else {
                            me.sensors = [];
                            return true;
                        }

                    })
                    .catch(function failed(error) {
                        console.error("Error!", error);
                    });
            },
            getEachSensorLastvalue() {
                return $http.get(config.sensorApiEndpoint + '/sensors/activeSensors')
                    .then(function success(response) {
                        if (response.data.length != 0) {
                            me.sensorsWithObs = [];
                            response.data.forEach(data => {
                                $http.get(config.sensorApiEndpoint + '/observation/collectedData/lastObs', { params: { sensor: data.sensor_id, unit: data.unit_id } })
                                    .then(function success(response) {
                                        if (response.data.length != 0) {
                                            if (me.sensorsWithObs.length == 0) {
                                                me.sensorsWithObs = me.sensorsWithObs.concat(response.data);
                                            } else {
                                                me.sensorsWithObs = me.sensorsWithObs.filter(data => response.data.filter(sensor => sensor.sensor_id == data.sensor_id && sensor.unit_id == data.unit_id).length == 0);
                                                me.sensorsWithObs = me.sensorsWithObs.concat(response.data);
                                            }


                                        }
                                    })
                                    .catch(function failed(error) {
                                        console.error("Error!", error);
                                    });
                            });
                            if (me.sensorsWithObs.length != 0) return false;
                            else return true;
                        } else {
                            me.sensorsWithObs = [];
                            return true;
                        }
                    })
            },
            addNewPhenomena(newPhenomenaName, newPhenomenaUnit) {
                var data = { name: newPhenomenaName, unit: newPhenomenaUnit };
                return $http.post(config.sensorApiEndpoint + '/phenomena/new', data)
                    .then(function success(response) {
                        me.getPhenomenas();
                        return false;
                    })
                    .catch(function failed(error) {
                        if (angular.isDefined(error)) {
                            if (error.hasOwnProperty('errors')) {
                                var gottenErrors = error.errors.map(msg => msg.msg)
                                me.newAlert(gottenErrors, 5000, "red");
                            }
                        }
                        return true;
                    });
            },
            getPhenomenas: function () {
                return $http.get(config.sensorApiEndpoint + '/phenomena/data')
                    .then(function success(response) {
                        if (response.data == '') {
                            me.phenomenas = [];
                        } else {
                            me.phenomenas = response.data;
                        }


                    })
                    .catch(function failed(error) {
                        console.error("Error!", error);
                    });
            },
            getSensorPhenomena: function (sensorSelected) {
                return $http.get(config.sensorApiEndpoint + '/sensors/phenomena/' + sensorSelected.sensor_id)
                    .then(function (response) {
                        me.phenomena = response.data;
                    })
                    .catch(function failed(error) {
                        console.error("Error!", error);
                    })
            },
            saveAddedSensors(unitClicked) {
                var checked = me.sensors.filter(sensor => sensor.checked == true).map(id => id.sensor_id);
                return $http.post(config.sensorApiEndpoint + '/sensors/sensors_units', { params: checked, unit: unitClicked })
                    .then(function success(res) {
                        me.newAlert(res.data, 2000, "green");
                        me.getEachSensorLastvalue();
                    })
                    .catch(function failed(error) {
                        if (angular.isDefined(error)) {
                            if (error.hasOwnProperty('errors')) {
                                var gottenErrors = error.errors.map(msg => msg.msg)
                                me.newAlert(gottenErrors, 5000, "red");
                            }
                        }
                    });
            },
            saveSensors: function (sensorName, sensorType, phenomenaId, unitClicked) {
                var data = { name: sensorName, type: sensorType, phenomenaId: phenomenaId, unit: unitClicked };
                return $http.post(config.sensorApiEndpoint + '/sensors/data', data)
                    .then(function success(res) {
                        me.newAlert(res.data, 2000, "green");
                        return false;
                    })
                    .catch(function failed(error) {
                        if (angular.isDefined(error)) {
                            if (error.hasOwnProperty('errors')) {
                                var gottenErrors = error.errors.map(msg => msg.msg)
                                me.newAlert(gottenErrors, 2000, "red");
                            }
                        }
                        return true;
                    });
            },
            saveData: function (sensorClicked, measuredValue, time, unitId) {
                var data = { sensor: sensorClicked, measuredValue: measuredValue, time: time, unitId: unitId }
                return $http.post(config.sensorApiEndpoint + '/observation/save', data)
                    .then(function success(res) {
                        me.newAlert(res.data, 2000, "green");
                        me.getEachSensorLastvalue();
                        return false;
                    })
                    .catch(function failed(error) {
                        if (angular.isDefined(error)) {
                            if (error.hasOwnProperty('errors')) {
                                var gottenErrors = error.errors.map(msg => msg.msg)
                                me.newAlert(gottenErrors, 2000, "red");
                            }
                        }
                        return true;
                    });
            },
            dataRequest(interval, sensorClicked, unitSelected) {
                if (angular.isUndefined(sensorClicked) && angular.isUndefined(unitSelected)) {
                    sensorClicked = me.chartSensorId;
                    unitSelected = me.chartUnitId;
                }
                return $http.get(config.sensorApiEndpoint + '/observation/collectedData', { params: { sensor: sensorClicked, unit: unitSelected, interval } })
                    .then(function success(response) {
                        if (response.data.length != 0) {
                            me.sensorCollectedData = response.data;
                            const scope = $rootScope.$new();
                            if (document.querySelector('#chart-dialog')) {
                                var parent = document.querySelector('#chart-dialog').parentElement;
                                parent.parentElement.removeChild(parent);
                            }
                            var el = angular.element('<div sens.chart-directive></div>');
                            HsLayoutService.dialogAreaElement.appendChild(el[0]);
                            $compile(el)(scope);
                            me.buildChart(sensorClicked, unitSelected, me.sensorCollectedData);
                        } else {
                            window.alert("There was no data found for this sensor in this unit!")
                        }
                    })
                    .catch(function failed(error) {
                        if (angular.isDefined(error)) {
                            if (error.hasOwnProperty('errors')) {
                                var gottenErrors = error.errors.map(msg => msg.msg)
                                me.newAlert(gottenErrors, 2000, "red");
                            }
                        }
                        return true;
                    });
            },
            buildChart(sensorClicked, unitSelected, data) {
                var collectedData = data.filter(data => data.sensor_id == sensorClicked && data.unit_id == unitSelected);
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
                                        max: 2,
                                        min: 0.5
                                    }
                                }
                            }
                        }
                    },
                });
                return myChart;
            },
            deleteActiveSensors() {
                var checkedSensors = new Set(me.sensorsWithObs.filter(sensor => sensor.checked == true).map(id => id.sensor_id));
                checkedSensors = [...checkedSensors];
                var sensorUnitsArray = new Set(me.sensorsWithObs.filter(sensor => sensor.checked == true).map(unit => unit.unit_id));
                sensorUnitsArray = [...sensorUnitsArray];
                return $http.post(config.sensorApiEndpoint + '/sensors/delete', { params: checkedSensors, units: sensorUnitsArray })
                    .then(function success(res) {
                        me.newAlert(res.data, 2000, "green");
                        me.sensorsWithObs = me.sensorsWithObs.filter(s => s.checked != true);
                        checkedSensors = [];
                        sensorUnitsArray = [];
                    })
                    .catch(function failed(error) {
                        if (angular.isDefined(error)) {
                            if (error.hasOwnProperty('errors')) {
                                var gottenErrors = error.errors.map(msg => msg.msg)
                                me.newAlert(gottenErrors, 2000, "red");
                            }
                        }
                    });
            },
        })
        me.getEachSensorLastvalue();
    }
]