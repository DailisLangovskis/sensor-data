export default ['$http',
    function ($http) {
        var me = this;
        angular.extend(me, {
            btnSelectDeseletClicked: true,
            sensors: [],
            phenomenas: [],
            phenomena: '',
            featureCollection: '',
            refSys: [],
            selectDeselectAllSensors() {
                me.btnSelectDeseletClicked = !me.btnSelectDeseletClicked;
                me.sensors.forEach(sensor => sensor.checked = me.btnSelectDeseletClicked);
            },
            getSensors: function () {
                $http.get('http://localhost:8099/api/sensor/data')
                    .then(function success(response) {
                        me.sensors = response.data;
                    })
                    .catch(function (error) {
                        console.error("Error!", error);
                    });
            },
            getPhenomenas: function () {
                $http.get('http://localhost:8099/api/phenomena/data')
                    .then(function success(response) {
                        me.phenomenas = response.data;
                    })
                    .catch(function (error) {
                        console.error("Error!", error);
                    });
            },
            getReferencingSystems: function () {
                $http.get('http://localhost:8099/api/ref-sys/data')
                    .then(function success(response) {
                        return response.data
                    }).then(function (response) {
                        me.refSys = response;
                    })
                    .catch(function (error) {
                        console.error("Error!", error);
                    });
            },
            getSelectedPhenomena: function (sensorSelected) {
                return $http.get('http://localhost:8099/api/sensor/phenomena/' + sensorSelected.sensor_id)
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
                return $http.get('http://localhost:8099/api/features/load/' + sensorSelected.sensor_id)
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
                return $http.post('http://localhost:8099/api/sensor/data', data)
                    .then(function success(res) {
                        me.newAlert(res.data, 2000, "green");
                        me.getSensors();
                        return false;
                    })
                    .catch(function (error) {
                        var gottenErrors = error.data.errors.map(msg => msg.msg)
                        me.newAlert(gottenErrors, 2000, "red");
                        return true;
                    });
            },
            saveData: function (sensorClicked, phenomenaId, measuredValue, time, referencingSystem, wktGeom){
                var data = {sensor: sensorClicked, phenomena: phenomenaId, measuredValue: measuredValue, time: time, refSys: referencingSystem, wktGeom: wktGeom}
                return $http.post('http://localhost:8099/api/observation/save', data)
                    .then(function success(res) {
                        me.newAlert(res.data, 2000, "green");
                        return false;
                    })
                    .catch(function (error) {
                        console.log(error.data.errors)
                        if(error.data.errors) {
                            var gottenErrors = error.data.errors.map(msg => msg.msg)
                            me.newAlert(gottenErrors, 2000, "red");
                        }
                        
                        return true;
                    });
            },
            deleteSelectedSensors() {
                var deleteAll = window.confirm("Do you really want to delete all selected sensors from the database?");
                if (deleteAll) {
                    var checked = me.sensors.filter(sensor => sensor.checked == true).map(id => id.sensor_id);
                    $http.post('http://localhost:8099/api/sensor/delete', { params: checked })
                        .then(function success(res) {
                            me.newAlert(res.data, 2000, "green");
                        })
                        .then(_ => {
                            me.getSensors();
                        })
                        .catch(function (error) {
                            var gottenErrors = error.data.errors.map(msg => msg.msg)
                            me.newAlert(gottenErrors, 2000, "red");
                        });

                }
            },
            newAlert(msg, timer, background) {
                document.getElementById('alert').innerHTML = '<b>' + msg + '</b>';
                document.getElementById('alert').style.backgroundColor = background;
                document.getElementById('alert').style.opacity = "0.7";
                setTimeout(function () { document.getElementById('alert').innerHTML = ''; }, timer)
            },
        })
        me.getReferencingSystems();
        me.getSensors();
        me.getPhenomenas();
    }
]