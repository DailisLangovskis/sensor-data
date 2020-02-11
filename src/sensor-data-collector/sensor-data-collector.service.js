export default ['$http',
    function ($http) {
        var me = this;
        angular.extend(me, {
            sensorNames: [],
            getSensors: function () {
                $http.get('http://localhost:8099/api/sensor/data')
                    .then(function success(response) {
                        me.sensorNames = response.data.map(name => name.sensor_name)
                        console.log(me.sensorNames)
                    })
                    .catch(function error() {
                        console.error("Error!");
                    });
            },
            saveSensors: function (sensorName, sensorType, phenomenon, phenomenonUnit) {
                var data = { name: sensorName, type: sensorType, phenomenon: { phenomenon: phenomenon, unit: phenomenonUnit } };
                $http.post('http://localhost:8099/api/sensor/data', data)
                    .then(function success() {
                        console.log("Success!");
                    })
                    .catch(function error() {
                        console.log("Error!");
                    });
            }
        })
    }
]