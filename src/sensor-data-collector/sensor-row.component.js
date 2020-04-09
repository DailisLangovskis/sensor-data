import moment from 'moment';
import { toStringHDMS, createStringXY } from 'ol/coordinate';
import { transform, transformExtent } from 'ol/proj';
import { WKT } from 'ol/format';
export default {
    template: require('./partials/sensor-row.html'),
    bindings: {
        sensor: '=',

    },
    controller: ['$scope', 'sens.sensor.service', 'hs.map.service', 'hs.query.baseService', function ($scope, sensorService, HsMap, queryBaseService) {
        angular.extend($scope, {
            sensorService,
            phenomena: '',
            sensorType: '',
            location: '',
            featureGeomWKT: '',
            measuredValue: '',
            measurementTime: new Date(),
            addSensorTabVisible: false,

            getLocationFromMap() {
                var queryFeature = queryBaseService.queryLayer.getSource().getFeatures();
                var formatWKT = new WKT();
                $scope.featureGeomWKT = formatWKT.writeFeature(queryFeature[0]).toString();
                var coords = queryFeature[0].getGeometry().flatCoordinates;
                var map = HsMap.map;
                var epsg4326Coordinate = transform(coords,
                    map.getView().getProjection(), 'EPSG:4326'
                );
                $scope.location = createStringXY(7)(epsg4326Coordinate)
                if ($scope.phenomena[0].phenomenon_name === "Location") {
                    $scope.measuredValue = 1;
                }
            },
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
            saveData(sensorClicked, phenomenaId, measuredValue, time) {
                time = moment.moment(time).format("YYYY-MM-DD HH:mm:ssZ");
                sensorService.saveData(sensorClicked, phenomenaId, measuredValue, time, $scope.featureGeomWKT).then(function (response) {
                    if (response == false) {
                        $scope.addSensorTabVisible = !$scope.addSensorTabVisible;
                        $scope.measuredValue = '';
                        $scope.location = '';
                        $scope.featureGeomWKT = '';
                        $scope.measurementTime = new Date();
                    }
                })
            }
        });
        $scope.$on('logout', function () {
            $scope.phenomena = '';
                $scope.sensorType = '';
                $scope.location = '';
                $scope.featureGeomWKT = '';
                $scope.measuredValue = '';
                $scope.measurementTime = new Date();
                $scope.addSensorTabVisible = false;
                sensorService.btnSelectDeseletClicked = true;
                sensorService.sensors = [];
                sensorService.phenomena = [];
                sensorService.phenomena = '';
                sensorService.featureCollection = '';
        })
    }]
};
