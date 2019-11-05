export default {
    // template: require('./analysis.directive.html'),
    controller: ['$scope', 'hs.map.service', 'Core', 'config', '$timeout', '$compile', '$http', 'hs.utils.service', 'hs.layout.service',
        function ($scope, OlMap, Core, config, $timeout, $compile, $http, utils, layoutService) {
            $scope.loading = false;
        }
    ]
}