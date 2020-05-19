import moment from 'moment';
import { toLonLat } from 'ol/proj';
export default {
    template: require('./partials/groups-row.html'),
    bindings: {
        group: '=',

    },
    controller: ['$scope', 'sens.sensorGroup.service', 'sens.sensorUnit.service', 'HsMapService', 'HsQueryBaseService', function ($scope, groupService, unitService, HsMap, queryBaseService) {
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
            existingUnitListVisible: false,
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
                            $scope.unitsTabVisible = true;
                        }

                    })
                }

            },
            addNewUnits(groupClicked){
                if($scope.addUnitTabVisible){
                    $scope.addUnitTabVisible = !$scope.addUnitTabVisible;
                    $scope.existingUnitListVisible = false; 
                }
                else {
                    $scope.getAllUsableUnits(groupClicked);
                        $scope.unitsTabVisible = false;
                        $scope.time = moment.moment(new Date()).format("YYYY-MM-DD HH:mm:ssZ");
                        $scope.addUnitTabVisible = true;
                    

                }
                     
                
            },
            getAllUsableUnits(groupClicked) {
                unitService.getAllUnitLocations(),
                unitService.getAllUsableUnits(groupClicked).then(function (response) {
                    if (response) return;
                    else {
                        $scope.existingUnitListVisible = true;
                    }
                })
            },
            saveAddedUnits(groupClicked) {
                unitService.saveAddedUnits(groupClicked).then(_ => {
                    $scope.unitsTabVisible = false;
                    $scope.showUnits(groupClicked);
                    $scope.existingUnitListVisible = false;
                })
            },
            saveUnit(unitName, description, time, groupClicked) {
                unitService.saveUnit(unitName, description, time, $scope.location, groupClicked).then(function (response) {
                    if (!response) {
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
                        $scope.showUnits(groupClicked);
                    } else {
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
            $scope.existingUnitListVisible = false;
        });
        $scope.$on('mapClicked', function(){
            $scope.getLocationFromMap();
        })

    }]
};
