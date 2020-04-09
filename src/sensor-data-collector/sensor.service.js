export default ['$http', 'config','sens.auth.service', 'sens.sensorGroup.service',
    function ($http, config, authService, groupService) {
        var me = this;
        angular.extend(me, {
            btnSelectDeseletClicked: true,
            sensors: [],
            phenomenas: [],
            phenomena: '',
            featureCollection: '',
            newAlert:groupService.newAlert,
            selectDeselectAllSensors() {
                me.btnSelectDeseletClicked = !me.btnSelectDeseletClicked;
                me.sensors.forEach(sensor => sensor.checked = me.btnSelectDeseletClicked);
            },
            getSensors: function () {
                return $http.get(config.sensorApiEndpoint + '/sensors/data')
                    .then(function success(response) {
                        if(response.data == ''){
                            me.sensors = '';
                            return false;
                        }
                        else{
                            me.sensors = response.data;
                            return true;
                        }
                        
                    })
                    .catch(function (error) {
                        console.error("Error!", error);
                    });
            },
            getPhenomenas: function () {
                $http.get(config.sensorApiEndpoint + '/phenomena/data')
                    .then(function success(response) {
                        me.phenomenas = response.data;
                    })
                    .catch(function (error) {
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
                    .catch(function (error) {
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
                    .catch(function (error) {
                        console.error("Error!", error);
                    })
            },
            saveSensors: function (sensorName, sensorType, phenomenaId) {
                var data = { name: sensorName, type: sensorType, phenomenaId: phenomenaId };
                return $http.post(config.sensorApiEndpoint + '/sensors/data', data)
                    .then(function success(res) {
                        me.newAlert(res.data, 2000, "green");
                        me.getSensors();
                        return false;
                    })
                    .catch(function (error) {
                        if(angular.isDefined(error)){
                            if (error.hasOwnProperty('errors')) {
                                var gottenErrors = error.errors.map(msg => msg.msg)
                                me.newAlert(gottenErrors, 2000, "red");
                            }
                        }           
                        return true;
                    });
            },
            saveData: function (sensorClicked, phenomenaId, measuredValue, time, wktGeom) {
                var data = { sensor: sensorClicked, phenomena: phenomenaId, measuredValue: measuredValue, time: time, wktGeom: wktGeom }
                return $http.post(config.sensorApiEndpoint + '/observation/save', data)
                    .then(function success(res) {
                        me.newAlert(res.data, 2000, "green");
                        return false;
                    })
                    .catch(function (error) {
                        if(angular.isDefined(error)){
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
                            me.getSensors();
                        })
                        .catch(function (error) {
                            if(angular.isDefined(error)){
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