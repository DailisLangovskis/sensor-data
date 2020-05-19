import moment from 'moment';
import { toLonLat } from 'ol/proj';
export default {
    template: require('./partials/groups-row.html'),
    bindings: {
        group: '=',

    },
    controller: ['$scope', 'sens.sensorGroup.service', 'sens.sensorUnit.service', 'hs.map.service', 'hs.query.baseService', function ($scope, groupService, unitService, HsMap, queryBaseService) {
        angular.extend($scope, {
            location: '',
            time: moment.moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ"),
            unitService,
            groupService,
            selectDeselectAllUnits: groupService.selectDeselectAllUnits,
            unitsTabVisible: false,
            addUnitTabVisible: false,
            unitName: '',
            description: '',
            addNewUnitTabExpanded: false,
            existingUnitListVisible: false,
            getAllUnitLocations: unitService.getAllUnitLocations,


            getLocationFromMap() {
                var queryFeature = queryBaseService.queryLayer.getSource().getFeatures();
                var coords = queryFeature[0].getGeometry().flatCoordinates;
                $scope.location = toLonLat(coords);
            },
            showUnits(groupClicked) {
                $scope.unitName = '';
                $scope.description = '';
                $scope.location = '';
                $scope.time = moment.moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ");
                $scope.addUnitTabVisible = false
                if ($scope.unitsTabVisible) {
                    $scope.unitsTabVisible = !$scope.unitsTabVisible;
                }
                else {
                    groupService.getGroupUnits(groupClicked).then(function (response) {
                        if (!response) {
                            window.alert("No units found for this group!")
                        }
                        else {
                            $scope.unitsTabVisible = !$scope.unitsTabVisible;
                        }

                    })
                }

            },
            addUnitForm(){
                $scope.addNewUnitTabExpanded = !$scope.addNewUnitTabExpanded; 
                $scope.existingUnitListVisible = false;
                $scope.time = moment.moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ");
            },
            getAllUserUnits() {
                $scope.unitName = '';
                $scope.description = '';
                $scope.location = '';
                $scope.time = moment.moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ");
                $scope.addNewUnitTabExpanded = false;
                unitService.getAllUserUnits().then(function (response) {
                    if (!response) {
                        window.alert("There where no units found for this user!");
                    }
                    else {
                        $scope.existingUnitListVisible = !$scope.existingUnitListVisible;
                    }
                })
            },
            saveAddedUnits(groupClicked) {
                unitService.saveAddedUnits(groupClicked).then(_ => {
                    $scope.existingUnitListVisible = !$scope.existingUnitListVisible;
                })
            },
            saveUnit(unitName, description, time, groupClicked) {
                unitService.saveUnit(unitName, description, time, $scope.location, groupClicked).then(function (response) {
                    if (!response) {
                        $scope.addNewUnitTabExpanded = !$scope.addNewUnitTabExpanded;
                        $scope.location = '';
                        $scope.unitName = '';
                        $scope.description = '';
                        $scope.time = moment.moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ")
                    }

                })
            },
            deleteSelectedUnits(groupClicked) {
                groupService.deleteSelectedUnits(groupClicked).then(function (response) {
                    if (response) {
                        $scope.unitsTabVisible = false;
                    }
                })
            }
        });
        $scope.$on('logout', function () {
            $scope.location = '';
            $scope.unitsTabVisible = false;
            $scope.addUnitTabVisible = false;
            $scope.unitName = '';
            $scope.description = '';
            $scope.addNewUnitTabExpanded = false;
            $scope.existingUnitListVisible = false;
        });
        $scope.$on('mapClicked', function(){
            $scope.getLocationFromMap();
        })

    }]
};
