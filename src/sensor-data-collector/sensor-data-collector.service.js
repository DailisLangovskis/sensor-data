import { check } from "express-validator";
import { mapValuesLimit } from "async";

export default ['$http',
    function ($http) {
        var me = this;
        angular.extend(me, {
            btnSelectDeseletClicked: true,
            sensors: [],
            phenomenas: [],
            phenomena: '',
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
            getSelectedPhenomena: function (sensorSelected) {
                return $http.get('http://localhost:8099/api/sensor/phenomena/' + sensorSelected.sensor_id)
                    .then(function success(response) {
                        return response.data;
                    }).then(function (response) {
                        me.phenomena = response.map(name => name.phenomenon_name);
                    })
                    .catch(function (error) {
                        console.error("Error!", error);
                    })
            },
            saveSensors: function (sensorName, sensorType, phenomenaId) {
                if (me.sensors.some(name => name.sensor_name === sensorName)) alert("This sensor already exists!")
                else {
                    var data = { name: sensorName, type: sensorType, phenomenaId: phenomenaId };
                    $http.post('http://localhost:8099/api/sensor/data', data)
                        .then(function success() {
                            me.getSensors();
                        })
                        .catch(function (error) {
                            console.log("Error!", error);
                        });
                }
            },
            deleteSelectedSensors() {
                var deleteAll = window.confirm("Do you really want to delete all selected sensors from the database?");
                if (deleteAll) {
                    var checked = me.sensors.filter(sensor => sensor.checked == true).map(id => id.sensor_id);
                    $http.post('http://localhost:8099/api/sensor/delete', { params: checked })
                        .then(function success() {
                            alert("All selected sensors have been deleted!")
                            me.getSensors();
                        })
                        .catch(function (error) {
                            console.error("Error!", error);
                        });

                }
                else {

                }
            },
        })
        me.getSensors();
        me.getPhenomenas();
    }
]