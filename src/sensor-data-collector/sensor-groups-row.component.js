import moment from 'moment';
import {toLonLat} from 'ol/proj';
export default {
    template: require('./partials/groups-row.html'),
    bindings: {
        group: '=',

    },
    controller: ['$scope', 'sens.sensorGroup.service', 'sens.sensorUnit.service', 'hs.map.service', 'hs.query.baseService', function ($scope, groupService, unitService, HsMap, queryBaseService) {
        angular.extend($scope, {
            location: '',
            time: new Date(),
            unitService,
            groupService,
            selectDeselectAllUnits: groupService.selectDeselectAllUnits,
            unitsTabVisible: false,
            addUnitTabVisible: false,
            unitName: '',
            description: '',
            addNewUnitTabExpanded: false,
            existingUnitListVisible: false,
            getAllUnitLocations:unitService.getAllUnitLocations,

            getLocationFromMap() {
                var queryFeature = queryBaseService.queryLayer.getSource().getFeatures();
                var coords = queryFeature[0].getGeometry().flatCoordinates;
                $scope.location = toLonLat(coords);
            },
            showUnits(groupClicked) {
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
            getAllUsersUnits() {
                $scope.time = new Date();
                $scope.addNewUnitTabExpanded = false;
                unitService.getAllUsersUnits().then(function (response) {
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
                time = moment.moment(time).format("YYYY-MM-DD HH:mm:ssZ");
                unitService.saveUnit(unitName, description, time, $scope.location, groupClicked).then(function (response) {
                    if (!response) {
                        $scope.addNewUnitTabExpanded = !$scope.addNewUnitTabExpanded;
                        $scope.location = '';
                        $scope.unitName = '';
                        $scope.description = '';
                        $scope.time = new Date();
                    }

                })
            },
            deleteSelectedUnits(groupClicked){
                groupService.deleteSelectedUnits(groupClicked).then(function(response){
                    if(response){
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
        })
    }]
};
