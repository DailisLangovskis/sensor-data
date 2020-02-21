import moment from 'moment';
import Map from 'ol/Map';
import { toStringHDMS, createStringXY } from 'ol/coordinate';
import { Tile, Group, Image as ImageLayer } from 'ol/layer';
import { TileWMS, WMTS, OSM, XYZ } from 'ol/source';
import { transform, transformExtent } from 'ol/proj';
import View from 'ol/View';
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
                console.log($scope.measurementTime);
            },
            getLocationFromMap() {
                if (!queryBaseService.last_coordinate_clicked) return
                else {
                    var coords = queryBaseService.last_coordinate_clicked;
                    var map = HsMap.map;
                    var epsg4326Coordinate = transform(coords,
                        map.getView().getProjection(), 'EPSG:4326'
                    );
                    $scope.location = createStringXY(7)(epsg4326Coordinate)
                    if ($scope.phenomena[0].phenomenon_name === "Location") {
                        $scope.measuredValue = createStringXY(7)(epsg4326Coordinate)
                    }

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
                $scope.dataTabExpanded = !$scope.dataTabExpanded;
            },
            saveData(sensorClicked, phenomenaId, measuredValue, time, referencingSystem, location) {
                time = moment.moment(time).format("YYYY-MM-DD HH:mm:ssZ");
                let loc = location.split(',');
                let lon = loc[0];
                let lat = loc[1];
                //console.log(sensorClicked, phenomenaId, measuredValue, time, referencingSystem, lon, lat)
                sensorService.saveData(sensorClicked, phenomenaId, measuredValue, time, referencingSystem, lon, lat).then(function (response) {
                   if (response == false) {
                        $scope.dataTabExpanded = !$scope.dataTabExpanded;
                        $scope.measuredValue = '';
                        $scope.refSys = '';
                        $scope.search = '';
                        $scope.location = '';
                    }
               })
            }
        });
    }]
};
