export default {
    template: require('./partials/sensor-data-collector.html'),
    controller: ['$scope', 'hs.map.service', 'Core', 'config', '$timeout', '$compile', '$http', 'hs.utils.service', 'hs.layout.service',
        function ($scope, OlMap, Core, config, $timeout, $compile, $http, utils, layoutService) {
            angular.extend($scope, {
                addSensorTabVisible: false,
                sensorName: '',
                sensorType: '',
                phenomenon: '',
                phenomenonUnit: '',
                sensorList: [],
                addSensor() {
                    $scope.addSensorTabVisible = !$scope.addSensorTabVisible
                },
                saveSensor(sensorName, sensorType, phenomenon, phenomenonUnit) {
                    if ($scope.sensorList.some(sensor => sensor === sensorName)) {
                        alert("Sensor names cannot be the same")
                        return;
                    } else {
                        var data = [sensorName, sensorType, phenomenon, phenomenonUnit];
                        $http.post('/api/sensor', data).then(function success(){
                            console.log("Success!");
                        }), function error(){
                            console.log("Error!");
                        };
                        $scope.sensorList.push(sensorName);
                        console.log(sensorName, sensorType, phenomenon, phenomenonUnit);
                        console.log($scope.sensorList)
                        $scope.addSensorTabVisible = !$scope.addSensorTabVisible;
                        $scope.sensorName = '';
                        $scope.sensorType = '';
                        $scope.phenomenon = '';
                        $scope.phenomenonUnit = '';
                    }

                }
            })
        }
    ]
}