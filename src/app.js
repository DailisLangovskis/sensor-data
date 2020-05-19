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
import 'draw.module';
import View from 'ol/View';
import { transform, transformExtent } from 'ol/proj';
import { OSM } from 'ol/source';
import { Tile } from 'ol/layer';
import { REST_API_URL } from '../config';
import './sensor-data-collector/sensor-data-collector.module';

//Hslayers main module components
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
    'sens.sensorDataCollectorModule'
]);

module.directive('hs', function (HsCore, HsLayoutService) {
    'ngInject';
    return {
        template: HsCore.hslayersNgTemplate,
        link: function (scope, element) {
            HsLayoutService.fullScreenMap(element, HsCore);
        }
    };
});

function getHostname() {
    var url = window.location.href
    var urlArr = url.split("/");
    var domain = urlArr[2];
    return urlArr[0] + "//" + domain;
};

module.value('HsConfig', {
    proxyPrefix: "/proxy/",
    default_layers: [
        new Tile({
            source: new OSM(),
            title: "Open Street layer",
            base: true,
            visible: true,
            removable: false,
            editor: { editable: false },
        }),
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
        'sensor-data-collector': 500
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
    },
    allowAddExternalDatasets: true,
    sensorApiEndpoint: REST_API_URL
});
module.controller('Main', function ($scope, HsCore, $compile, HsLayoutService, HsQueryBaseService, HsSidebarService, gettext) {
    'ngInject';
    HsQueryBaseService.nonQueryablePanels.push('sensor-data-collector');
    $scope.Core = HsCore;
    $scope.panelVisible = HsLayoutService.panelVisible;
    HsLayoutService.sidebarRight = false;

    HsLayoutService.sidebarButtons = true;

    $scope.$on("scope_loaded", function (event, args) {
        if (args == 'Sidebar') {
            var el = angular.element('<sens.index hs.draggable ng-if="Core.exists(\'sens.sensorDataCollectorModule\')" ng-show="panelVisible(\'sensor-data-collector\', this)"></sens.index>')[0];
            HsLayoutService.panelListElement.appendChild(el);
            $compile(el)($scope);
        }
    });
    HsSidebarService.buttons.push({ panel: 'sensor-data-collector', module: 'sens.sensorDataCollectorModule', order: -1, title: gettext('Sensor data collector'), description: gettext('Collect sensor data'), icon: 'icon-analytics-piechart' });
}
);

