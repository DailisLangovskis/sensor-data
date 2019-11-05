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
import datasourceList from './datasource-list';
import VectorLayer from 'ol/layer/Vector';
import { Vector as VectorSource } from 'ol/source';
import './analysis/analysis.module';
import meteoLayers from './meteo-layers.js';
import genLabelStyle from './gen-label-style';
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
    'fie.analysis'
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

var labelStyle = genLabelStyle;

var bookmarkStyle = [new Style({
    fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)'
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
}), labelStyle];

var aoiStyle = [new Style({
    fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new Stroke({
        color: '#4e7eda',
        width: 2
    }),
    image: new Icon({
        src: require('images/mrkr-interest.png'),
        crossOrigin: 'anonymous',
        anchor: [0.5, 1]
    })
}), labelStyle];

module.value('config', {
    proxyPrefix: "/proxy/",
    default_layers: [
        new Tile({
            source: new OSM(),
            title: "Base layer",
            base: true,
            removable: false
        }),
        new Tile({
            title: "Optiskā satelītkarte / Optical satellite basemap",
            source: new XYZ({
                attributions: '&copy; <a href="http://www.baltsat.lv/">Baltic Satellite Service</a>, <a href="https://www.esa.int/">European Space Agency - ESA</a>'
                ,
                url: '/proxy/https://api.forestradar.com/tiles-v1/zs-MaTDe4YUcXOuuMMgYyUj/optical/{z}/{x}/{y}.png',
                tms: false,
                maxZoom: 14
            }),
            visible: true,
            opacity: 1
        }),
        new Tile({
            title: "Ielu karte / Street map:",
            source: new XYZ({
                attributions: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                ,
                url: '/proxy/https://api.mapbox.com/styles/v1/recon517/ck0uew4wrgigc1dl7pkvnfmvi/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicmVjb241MTciLCJhIjoiY2l4cXBpbzZtMDAzNDMybDY2YnAzdjlndSJ9.MRq_ohDyD2x5t5DdlAwytA',
                tms: false,
                crossOrigin: true,

            }),
            visible: true,
            opacity: 1
        }),
        new Tile({
            title: "Augsnes apakštips un sastāvs / Soil class:",
            source: new XYZ({
                attributions: '&copy; <a href="https://geolatvija.lv/geo/p/317">Zemkopības ministrija</a>'
                ,
                url: '/proxy/https://api.mapbox.com/styles/v1/recon517/ck0v9ehr90phy1cqzu3hzkmmc/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicmVjb241MTciLCJhIjoiY2l4cXBpbzZtMDAzNDMybDY2YnAzdjlndSJ9.MRq_ohDyD2x5t5DdlAwytA',
                tms: false,
            }),
            visible: true,
            opacity: 0.7
        }),
        new Tile({
            title: "Zemes vērtējums / Land value:",
            source: new XYZ({
                attributions: '&copy; <a href="https://geolatvija.lv/geo/p/317">Zemkopības ministrija</a>'
                ,
                url: '/proxy/https://api.mapbox.com/styles/v1/recon517/ck0vs82zx2pw51cmz4yjh73kn/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicmVjb241MTciLCJhIjoiY2l4cXBpbzZtMDAzNDMybDY2YnAzdjlndSJ9.MRq_ohDyD2x5t5DdlAwytA',
                tms: false,
            }),
            visible: true,
            opacity: 0.7
        }),
        new Tile({
            title: "Ūdenstilpes un ūdensteces / Water bodies and rivers:",
            source: new XYZ({
                attributions: '&copy; <a href="https://opendata.lgia.gov.lv/zf_wp/index.php/2018/08/03/topografiska-karte-meroga-150-000-2-izdevums/">LĢIA</a>'
                ,
                url: '/proxy/https://api.mapbox.com/styles/v1/recon517/ck0sz2nv11nu91cqp4w4mdxrk/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicmVjb241MTciLCJhIjoiY2l4cXBpbzZtMDAzNDMybDY2YnAzdjlndSJ9.MRq_ohDyD2x5t5DdlAwytA',
                tms: false,
            }),
            visible: true,
            opacity: 1
        }),
        new Tile({
            title: 'ZS "Vilciņi" robeža / ZS "Vilciņi" border:',
            source: new XYZ({
                url: '/proxy/https://api.mapbox.com/styles/v1/recon517/ck0udcjhj6zb61cqlcvtdirmq/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicmVjb241MTciLCJhIjoiY2l4cXBpbzZtMDAzNDMybDY2YnAzdjlndSJ9.MRq_ohDyD2x5t5DdlAwytA',
                tms: false,
            }),
            visible: true,
            opacity: 0.7
        }),

    ]
        .concat(meteoLayers)
        .concat([
            new VectorLayer({
                title: 'Bookmarks',
                synchronize: true,
                editor: {
                    editable: true,
                    defaultAttributes: {
                        name: 'New bookmark',
                        description: 'none'
                    }
                },
                source: new VectorSource({}),
                style: function (feature) {
                    labelStyle.getText().setText(feature.get('name'));
                    return bookmarkStyle;
                },
                //declutter: true
            }),
            new VectorLayer({
                title: 'Areas of interest',
                synchronize: true,
                editor: {
                    editable: true,
                    defaultAttributes: {
                        name: 'New area',
                        description: 'none'
                    }
                },
                source: new VectorSource({}),
                style: function (feature) {
                    labelStyle.getText().setText(feature.get('name'));
                    return aoiStyle;
                },
                //declutter: true
            })
        ]),
    project_name: 'erra/map',
    default_view: new View({
        center: transform([23.3885193, 56.4769034], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
        zoom: 13,
        units: "m"
    }),
    advanced_form: true,
    datasources: datasourceList,
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
    //,datasource_selector: {allow_add: false}
});

module.controller('Main', ['$scope', 'Core', '$compile', 'hs.layout.service',
    function ($scope, Core, $compile, layoutService) {
        $scope.Core = Core;
        layoutService.sidebarRight = false;
        //layoutService.sidebarToggleable = false;
        Core.singleDatasources = true;
        layoutService.sidebarButtons = true;
        $scope.Core.setDefaultPanel('layermanager');
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

