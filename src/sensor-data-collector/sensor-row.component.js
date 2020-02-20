import moment from 'moment';
import Map from 'ol/Map';
import { Tile, Group, Image as ImageLayer } from 'ol/layer';
import { TileWMS, WMTS, OSM, XYZ } from 'ol/source';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
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
            measuredValue: '',
            measurementTime: new Date(),
            dataTabExpanded: false,
            search: '',
            refSys: '',
            createMiniMap() {
                var map = new Map({
                    target: 'miniMap',
                    layers: [
                        new Tile({
                            source: new OSM()
                        })
                    ],
                    view: new View({
                        center: [0, 0],
                        zoom: 2,
                    })
                });
            },
            dataRequest(sensorClicked) {
                console.log($scope.time);
            },
            getLocationFromMap() {
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
                        console.error("Error!", error);
                    })
                $scope.sensorType = sensorClicked.sensor_type;
                $scope.dataTabExpanded = !$scope.dataTabExpanded;
            },
            saveData(measuredValue, time, referencingSystem) {
                time = moment.moment(time).format("YYYY-MM-DD HH:mm:ssZ");
                console.log(time);
                $scope.dataTabExpanded = !$scope.dataTabExpanded;
                $scope.measuredValue = '';
                $scope.refSys = '';
                $scope.search = '';
            }
        });
    }]
};
