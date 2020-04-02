import moment from 'moment';
import Map from 'ol/Map';
import { toStringHDMS, createStringXY } from 'ol/coordinate';
import { Tile, Group, Image as ImageLayer } from 'ol/layer';
import { TileWMS, WMTS, OSM, XYZ } from 'ol/source';
import { transform, transformExtent } from 'ol/proj';
import View from 'ol/View';
import { WKT } from 'ol/format';
export default {
    template: require('./partials/sensor-row.html'),
    bindings: {
        sensor: '=',

    },
    controller: ['$scope', 'sens.sensorDataCollector.service', 'hs.map.service', 'hs.query.baseService', function ($scope, sensorService, HsMap, queryBaseService) {
        angular.extend($scope, {
            newMap: false,
            sensorService,
            phenomena: '',
            sensorType: '',
            location: '',
            featureGeomWKT: '',
            measuredValue: '',
            measurementTime: new Date(),
            dataTabExpanded: false,
            // search: '',
            // refSys: '',

            dataRequest(sensorClicked) {
                sensorService.getSelectedFeatureCollection(sensorClicked)
                    .then(_ => {
                        console.log(sensorService.featureCollection)
                    })
            },
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

                // const el = angular.element(document.getElementById('miniMap'));
                // if (el) $scope.createMiniMap();
                // $scope.newMap = !$scope.newMap;
            },
            addData(sensorClicked) {
                sensorService.getSelectedPhenomena(sensorClicked)
                    .then(_ => {
                        $scope.phenomena = sensorService.phenomena;
                    })
                    .catch(function (error) {
                        sensorService.newAlert(error, 2000, "red");;
                    })
                $scope.sensorType = sensorClicked.sensor_type;
                $scope.measurementTime = new Date();
                $scope.dataTabExpanded = !$scope.dataTabExpanded;
            },
            saveData(sensorClicked, phenomenaId, measuredValue, time) {
                time = moment.moment(time).format("YYYY-MM-DD HH:mm:ssZ");
                sensorService.saveData(sensorClicked, phenomenaId, measuredValue, time, $scope.featureGeomWKT).then(function (response) {
                    if (response == false) {
                        $scope.dataTabExpanded = !$scope.dataTabExpanded;
                        $scope.measuredValue = '';
                        // $scope.refSys = '';
                        // $scope.search = '';
                        $scope.location = '';
                        $scope.featureGeomWKT = '';
                        $scope.measurementTime = new Date();
                    }
                })
            }
        });
    }]
};
