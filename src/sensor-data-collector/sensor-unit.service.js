import VectorLayer from 'ol/layer/Vector';
import { Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Icon, Stroke, Fill, Circle, Text } from 'ol/style';
import authService from './auth.service';
export default ['$http', 'config', 'sens.sensorGroup.service', 'hs.map.service', 'sens.auth.service',
    function ($http, config, groupService, OlMap, authService) {
        var me = this;
        angular.extend(me, {
            btnSelectDeseletClicked: false,
            unitsSensors: [],
            featureCollection: '',
            newAlert: groupService.newAlert,
            unitSelected: '',
            allUnits: [],
            selectDeselectAllSensors(unitClicked) {
                me.btnSelectDeseletClicked = !me.btnSelectDeseletClicked;
                me.unitsSensors.forEach(sensor => {
                    if (sensor.unit_id == unitClicked) {
                        sensor.checked = me.btnSelectDeseletClicked
                    }
                });
            },
            showUnitSensors(unitSelected) {
                me.unitSelected = unitSelected;
                return $http.get(config.sensorApiEndpoint + '/units/sensors/' + unitSelected)
                    .then(function success(response) {
                        return response.data;
                    }).then(function (response) {
                        if (response == '') {
                            return false
                        } else {
                            me.unitsSensors = me.unitsSensors.concat(response.filter(data => me.unitsSensors.filter(u => u.unit_id == data.unit_id && u.sensor_id == data.sensor_id).length == 0));
                            return true
                        }
                    })
                    .catch(function (error) {
                        console.error("Error!", error);
                    })
            },
            getAllUnitLocations() {
                const source = new VectorSource({
                    format: new GeoJSON(),
                    url: function () {
                        return "http://localhost/geoserver/sensor-data-collector/ows?service=WFS&" +
                            "version=1.0.0&request=GetFeature&typeName=sensor-data-collector%3Aunits_positions&" +
                            "maxFeatures=50000&outputFormat=json"
                            //&PROPERTYNAME=user_name&CQL_FILTER=user_name=%27username%27
                    },
                })
                me.unitLayer = new VectorLayer({
                    title: 'Unit positions layer',
                    source: source,
                    style: new Style({
                        image: new Circle({
                            radius: 10,
                            fill: new Fill({
                                color: '#ff0000'
                            })
                        })
                    }),
                    show_in_manager: true,
                    visible: true
                });
                OlMap.loaded().then(map => {
                    map.addLayer(me.unitLayer)
                });
            },
            getAllUsersUnits() {
                return $http.get(config.sensorApiEndpoint + '/units/data')
                    .then(function success(response) {
                        return response.data;
                    }).then(function (response) {
                        if (response == '') {
                            me.allUnits = [];
                            return false
                        } else {
                            me.allUnits = response;
                            return true
                        }
                    })
                    .catch(function (error) {
                        console.error("Error!", error);
                    })
            },
            saveAddedUnits(groupClicked) {
                var checked = me.allUnits.filter(unit => unit.checked == true).map(id => id.unit_id);
                return $http.post(config.sensorApiEndpoint + '/units/units_groups', { params: checked, group: groupClicked })
                    .then(function success(res) {
                        me.newAlert(res.data, 2000, "green");
                    })
                    .catch(function (error) {
                        if (angular.isDefined(error)) {
                            if (error.hasOwnProperty('errors')) {
                                var gottenErrors = error.errors.map(msg => msg.msg)
                                me.newAlert(gottenErrors, 5000, "red");
                            }
                        }
                    });
            },
            saveUnit(unitName, description, time, location, groupClicked) {
                var data = { name: unitName, description: description, time: time, location: location, group: groupClicked };
                return $http.post(config.sensorApiEndpoint + '/units/new', data)
                    .then(function success(res) {
                        me.newAlert(res.data, 2000, "green");
                        return false;
                    })
                    .catch(function (error) {
                        if (angular.isDefined(error)) {
                            if (error.hasOwnProperty('errors')) {
                                var gottenErrors = error.errors.map(msg => msg.msg)
                                me.newAlert(gottenErrors, 2000, "red");
                            }
                        }
                        return true;
                    });
            },
            deleteSelectedSensors(selectedUnit) {
                var deleteAll = window.confirm("Do you really want to delete all selected sensors from the database?");
                if (deleteAll) {
                    var checked = me.unitsSensors.filter(sensor => sensor.checked == true).map(id => id.sensor_id);
                    return $http.post(config.sensorApiEndpoint + '/units/delete/sensors', { params: checked, unit: selectedUnit })
                        .then(function success(res) {
                            me.newAlert(res.data, 2000, "green");
                        })
                        .then(_ => {
                            me.unitsSensors = me.unitsSensors.filter(unit => unit.checked != true);
                            if (me.unitsSensors.filter(s => s.unit_id != selectedUnit)) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        })
                        .catch(function (error) {
                            if (angular.isDefined(error)) {
                                if (error.hasOwnProperty('errors')) {
                                    var gottenErrors = error.errors.map(msg => msg.msg)
                                    me.newAlert(gottenErrors, 2000, "red");
                                }
                            }
                        });

                }
            }
        })
    }
]