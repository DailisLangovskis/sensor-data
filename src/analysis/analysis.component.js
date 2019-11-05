export default {
    template: require('./analysis.directive.html'),
    controller: ['$scope', 'hs.map.service', 'Core', 'config', 'fie.analysis.service', '$timeout', '$compile', '$http', 'hs.utils.service', 'hs.layout.service',
        function ($scope, OlMap, Core, config, service, $timeout, $compile, $http, utils, layoutService) {
            $scope.loading = false;

            angular.extend($scope, {
                Core,
                service,
                currentAnalysisName: null,
                analysisList: [
                    { name: 'meteogram_agro_hd', title: '7 day agro meteogram' },
                    { name: 'meteogram_14day', title: '14 day agro meteogram' },
                    { name: 'pictoprintDayUvRain', title: 'Forecast pictograms' },
                    { name: 'meteogram_soiltraffic', title: 'Soil trafficability' },
                    { name: 'meteogram_agroSowing', title: 'Spray window' },
                    { name: 'meteogram_agroSpraying', title: 'Spray window' },
                ],
                chooseAnalysis(name, title) {
                    $scope.currentAnalysisTitle = title;
                    $scope.currentAnalysisName = name;
                    $scope.analysisMenuExpanded = false;
                }
            })

            $scope.$on('query.dataUpdated', utils.debounce((event, data) => {
                if (layoutService.mainpanel == 'analysis') {
                    if (document.querySelector('#info-dialog')) {
                        var parent = document.querySelector('#info-dialog').parentElement;
                        parent.parentElement.removeChild(parent);
                    }
                    var el = angular.element('<div hs.info-directive></div>');
                    const cord = data.coordinates[0].epsg4326Coordinate;
                    service.getGeonameAtCoordinate(cord)
                        .then(placeName => {
                            service.getMeteoblueImage(cord,
                                $scope.currentAnalysisName,
                                placeName
                            ).then(imgUrl => {
                                el[0].setAttribute('image', imgUrl);
                                document.querySelector("#hs-dialog-area").appendChild(el[0]);
                                $compile(el)($scope);
                            })
                        })
                }
            }, 500))

            $scope.$emit('scope_loaded', "analysis");
        }
    ]
}