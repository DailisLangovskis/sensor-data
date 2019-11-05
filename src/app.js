'use strict';
import 'toolbar.module';
import 'print.module';
import 'query.module';
import 'search.module';
import 'add-layers.module';
import 'measure.module';
import 'permalink.module';
import 'info.module';
import 'datasource-selector.module';
import 'sidebar.module';
import 'sensors.module';
import 'draw.module';
import { ImageWMS, ImageArcGISRest } from 'ol/source';
import View from 'ol/View';
import { transform, transformExtent } from 'ol/proj';
import { Tile, Group, Image as ImageLayer } from 'ol/layer';
import { TileWMS, WMTS, OSM, XYZ } from 'ol/source';
import { Style, Icon, Stroke, Fill, Circle, Text } from 'ol/style';
import Feature from 'ol/Feature';
//import datasourceList from './datasource-list';
import VectorLayer from 'ol/layer/Vector';
import { Vector as VectorSource } from 'ol/source';
import { Polygon, LineString, GeometryType, Point } from 'ol/geom';
//import './analysis/analysis.module';
//import meteoLayers from './meteo-layers.js';
import genLabelStyle from './unnecessary/gen-label-style';
//import vegetationLayers from './vegetation-layers-';

var module = angular.module('hs', [
    'hs.sidebar',
    'hs.draw',
    'hs.info',
    'hs.toolbar',
    'hs.layermanager',
    'hs.query',
    'hs.search', 'hs.print', 'hs.permalink',
    'hs.geolocation',
    'hs.datasource_selector',
    'hs.save-map',
    'hs.measure',
    'hs.addLayers',
    'hs.sensors',
]);

module.directive('hs', ['config', 'Core', function (config, Core) {
    return {
        template: Core.hslayersNgTemplate,
        link: function (scope, element) {
            Core.fullScreenMap(element);
        }
    };
}]);

function getHostname() {
    var url = window.location.href
    var urlArr = url.split("/");
    var domain = urlArr[2];
    return urlArr[0] + "//" + domain;
};

module.value('config', {
    proxyPrefix: "/proxy/",
    default_layers: [
        new Tile({
            source: new OSM(),
            title: "Base layer",
            base: true,
            removable: false
        }),
        new VectorLayer({
            title: 'Test',
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 128, 123, 0.2)'
                }),
                stroke: new Stroke({
                    color: '#e49905',
                    width: 2
                }),
                image: new Icon({
                    src: require('images/mrkr-bookmark.png'),
                    crossOrigin: 'anonymous',
                    anchor: [0.5, 1]
                })
            }),
            source: new VectorSource({
                features: [new Feature({
                    geometry: new Point(transform([16.8290202, 49.0751890], 'EPSG:4326', 'EPSG:3857')),
                    name: 'This is a point!',
                })]
            }),
            declutter: true
        })
    ],
    project_name: 'erra/map',
    default_view: new View({
        center: transform([23.3885193, 56.4769034], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
        zoom: 13,
        units: "m"
    }),
    advanced_form: true,
    hostname: {
        "default": {
            "title": "Default",
            "type": "default",
            "editable": false,
            "url": getHostname()
        }
    },
    panelWidths: {
        sensors: 600
    },
    panelsEnabled: {
        language: false
    },
    'catalogue_url': "/php/metadata/csw",
    status_manager_url: '/wwwlibs/statusmanager2/index.php',
    senslog: {
        url: 'http://foodie.lesprojekt.cz:8080',
        user_id: 6, //Needed for senslogOT
        group: 'kynsperk', //Needed for MapLogOT
        user: 'kynsperk' //Needed for MapLogOT
    }
   
});

module.controller('Main', ['$scope', 'Core', '$compile', 'hs.layout.service',
    function ($scope, Core, $compile, layoutService) {
        $scope.Core = Core;
        $scope.panelVisible = layoutService.panelVisible;
        layoutService.sidebarRight = false;
        //layoutService.sidebarToggleable = false;
        Core.singleDatasources = true;
        layoutService.sidebarButtons = true;
        layoutService.setDefaultPanel('layermanager');
        $scope.$on("scope_loaded", function (event, args) {
            if (args == 'Sidebar') {
                var el = angular.element('<fie.analysis hs.draggable ng-if="Core.exists(\'fie.analysis\')" ng-show="panelVisible(\'analysis\', this)"></fie.analysis>')[0];
                document.querySelector('#panelplace').appendChild(el);
                $compile(el)($scope);

                var toolbar_button = angular.element('<div fie.analysis.sidebar-btn></div>')[0];
                document.querySelector('.sidebar-list').appendChild(toolbar_button);
                $compile(toolbar_button)(event.targetScope);
            }
        })
    }
]);

