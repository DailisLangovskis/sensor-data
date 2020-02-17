export default ['$http',
    function ($http) {
        var me = this;
        angular.extend(me, {
            btnSelectDeseletClicked: true,
            sensorNames: [],
            phenomenas: [],
            selectDeselectAllSensors() {
                me.btnSelectDeseletClicked = !me.btnSelectDeseletClicked;
                me.sensorNames.forEach(sensor => sensor.checked = me.btnSelectDeseletClicked);
            },
            deleteSelectedSensors() {
                var deleteAll = window.confirm("Do you really want to delete all existing sensors from the database?");
                if (deleteAll) {
                    var checked = me.sensorNames.filter(sensor => sensor.checked == true);
                    checked = checked.map(sensorID => sensorID.sensor_id);
                    console.log(checked);
                    $http.delete('http://localhost:8099/api/sensor/delete', checked)
                        .then(function success() {
                            alert("All selected sensors have been deleted!")
                        })
                        .catch(function error() {
                            console.error("Error!");
                        });

                }
                else {

                }
            },
            getSensors: function () {
                $http.get('http://localhost:8099/api/sensor/data')
                    .then(function success(response) {
                        me.sensorNames = response.data;
                    })
                    .catch(function error() {
                        console.error("Error!");
                    });
            },
            getPhenomenas: function () {
                $http.get('http://localhost:8099/api/phenomena/data')
                    .then(function success(response) {
                        me.phenomenas = response.data;
                    })
                    .catch(function error() {
                        console.error("Error!");
                    });
            },
            saveSensors: function (sensorName, sensorType, phenomena) {
                if (me.sensorNames.some(name => name === sensorName)) alert("This sensor already exists!")
                else {
                    var data = { name: sensorName, type: sensorType, phenomena: phenomena };
                    $http.post('http://localhost:8099/api/sensor/data', data)
                        .then(function success() {
                            me.getSensors();
                            console.log("Success!");
                        })
                        .catch(function error() {
                            console.log("Error!");
                        });
                }
            }
        })
        me.getSensors();
        me.getPhenomenas();
    }
]