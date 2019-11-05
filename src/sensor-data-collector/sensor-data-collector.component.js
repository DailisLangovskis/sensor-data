export default {
    template: require('./partials/sensor-data-collector.directive.html'),
    controller: ['$scope', 'hs.map.service', 'Core', 'config', '$timeout', '$compile', '$http', 'hs.utils.service', 'hs.layout.service',
        function ($scope, OlMap, Core, config, $timeout, $compile, $http, utils, layoutService) {
        }
    ]
}