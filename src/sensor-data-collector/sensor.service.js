export default ['$http', 'config', 'sens.sensorGroup.service',
    function ($http, config, groupService) {
        var me = this;
        angular.extend(me, {
            btnSelectDeseletClicked: true,
            sensors: [],
            phenomenas: [],
            phenomena: '',
            sensorCollectedData: [],
            featureCollection: '',
            newAlert: groupService.newAlert,
            selectDeselectAllSensors() {
                me.btnSelectDeseletClicked = !me.btnSelectDeseletClicked;
                me.sensors.forEach(sensor => sensor.checked = me.btnSelectDeseletClicked);
            },
            getAllUserSensors: function () {
                return $http.get(config.sensorApiEndpoint + '/sensors/data')
                    .then(function success(response) {
                        if (response.data == '') {
                            me.sensors = [];
                            return false;
                        }
                        else {
                            me.sensors = response.data;
                            return true;
                        }

                    })
                    .catch(function failed(error) {
                        console.error("Error!", error);
                    });
            },
            addNewPhenomena(newPhenomenaName, newPhenomenaUnit){
                var data = { name: newPhenomenaName, unit: newPhenomenaUnit};
                return $http.post(config.sensorApiEndpoint + '/phenomena/new', data)
                    .then(function success(response) {
                        me.getPhenomenas();
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
                    .then(function success(response) {
                        return response.data;
                    }).then(function (response) {
                        me.phenomena = response;
                    })
                    .catch(function failed(error) {
                        console.error("Error!", error);
                    })
            },
            getSelectedFeatureCollection: function (sensorSelected) {
                return $http.get(config.sensorApiEndpoint + '/features/load/' + sensorSelected.sensor_id)
                    .then(function success(response) {
                        return response.data;
                    }).then(function (response) {
                        me.featureCollection = response;
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
            dataRequest(sensorClicked, unitSelected) {
                return $http.get(config.sensorApiEndpoint + '/observation/collectedData', { params: { sensor: sensorClicked, unit: unitSelected } })
                    .then(function success(response) {
                        return response.data;
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
            deleteSelectedSensors() {
                var deleteAll = window.confirm("Do you really want to delete all selected sensors from the database?");
                if (deleteAll) {
                    var checked = me.sensors.filter(sensor => sensor.checked == true).map(id => id.sensor_id);
                    $http.post(config.sensorApiEndpoint + '/sensors/delete', { params: checked })
                        .then(function success(res) {
                            me.newAlert(res.data, 2000, "green");
                        })
                        .then(_ => {
                            me.getAllUserSensors();
                        })
                        .catch(function failed(error) {
                            if (angular.isDefined(error)) {
                                if (error.hasOwnProperty('errors')) {
                                    var gottenErrors = error.errors.map(msg => msg.msg)
                                    me.newAlert(gottenErrors, 2000, "red");
                                }
                            }
                        });

                }
            },
        })
    }
]