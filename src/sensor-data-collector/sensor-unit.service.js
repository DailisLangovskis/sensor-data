import VectorLayer from 'ol/layer/Vector';
import { Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Icon, Stroke, Fill, Circle, Text } from 'ol/style';
import { PROXY, DOMAIN } from '../../config';
export default ['$http', 'HsConfig', 'sens.sensorGroup.service', 'HsMapService', 'sens.auth.service',
    function ($http, config, groupService, HsMap, authService) {
        var me = this;
        angular.extend(me, {
            unitsSensors: [],
            newAlert: groupService.newAlert,
            unitClicked: '',
            checkedUnits: [],
            allUnits: [],
            selectAllUnitsSensors(checkedUnit) {
                if (me.unitsSensors.length != 0) {
                    me.unitsSensors.forEach(sensor => {
                        if (sensor.unit_id == checkedUnit.unit_id) {
                            sensor.checked = checkedUnit.checked;
                        }
                    });
                } else {
                    return;
                }
            },
            getUnitSensors(unitClicked) {
                me.unitClicked = unitClicked;
                return $http.get(config.sensorApiEndpoint + '/units/sensors/' + unitClicked)
                    .then(function (response) {
                        if (response.data.length != 0) {
                            me.unitsSensors = me.unitsSensors.concat(response.data.filter(data => me.unitsSensors.filter(u => u.unit_id == data.unit_id && u.sensor_id == data.sensor_id).length == 0));
                            me.unitsSensors.forEach(s => s.checked = false);
                            return false;
                        } else {
                            return true;
                        }
                    })
                    .catch(function failed(error) {
                        console.error("Error!", error);
                        return true;
                    })
            },
            getAllUnitLocations() {
                const username = authService.getUsername()
                const source = new VectorSource({
                    format: new GeoJSON(),
                    url: PROXY + DOMAIN + `/geoserver/sensor-data-collector/ows?service=WFS&` +
                            `version=1.0.0&request=GetFeature&typeName=sensor-data-collector%3Aunits_positions&` +
                            `maxFeatures=50000&outputFormat=json&CQL_FILTER=${encodeURIComponent("user_name='" + username + "'")}`
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
                me.unitLayer.set('hoveredKeys', ['unit_name', 'user_name', 'unit_id', 'longitude', 'latitude']);
                HsMap.addLayer(me.unitLayer,true);
            },
            getAllUsableUnits(groupClicked) {
                return $http.get(config.sensorApiEndpoint + '/units/data/' + groupClicked)
                    .then(function (response) {
                        if (response.data != 0) {
                            me.allUnits = response.data;
                            return false
                        } else {
                            me.allUnits = [];
                            return true
                        }
                    })
                    .catch(function failed(error) {
                        console.error("Error!", error);
                    })
            },
            saveAddedUnits(groupClicked) {
                var checked = me.allUnits.filter(unit => unit.checked == true).map(id => id.unit_id);
                return $http.post(config.sensorApiEndpoint + '/units/units_groups', { params: checked, group: groupClicked })
                    .then(function success(res) {
                        me.newAlert(res.data, 2000, "green");
                        checked = [];
                    })
                    .catch(function failed(error) {
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
                        data = [];
                        return false;
                    })
                    .catch(function failed(error) {
                        if (angular.isDefined(error)) {
                            if (error.hasOwnProperty('errors')) {
                                var gottenErrors = error.errors.map(msg => msg.msg)
                                me.newAlert(gottenErrors, 2000, "red");
                            }
                        }
                        return true;
                    });
            },
            deleteSelectedSensors() {
                var checked = new Set(me.unitsSensors.filter(sensor => sensor.checked == true).map(id => id.sensor_id));
                checked = [...checked];
                var sensorUnitArray = new Set(me.unitsSensors.filter(sensor => sensor.checked == true).map(unit_id => unit_id.unit_id));
                sensorUnitArray = [...sensorUnitArray];
                return $http.post(config.sensorApiEndpoint + '/units/delete/sensors', { params: checked, units: sensorUnitArray })
                    .then(_ => {
                        $http.post(config.sensorApiEndpoint + '/observation/delete', { params: checked, units: sensorUnitArray })
                            .then(_ => {
                                checked = [];
                                sensorUnitArray = [];
                                me.unitsSensors = me.unitsSensors.filter(unit => unit.checked != true);
                            })

                    })
                    .catch(function failed(error) {
                        if (angular.isDefined(error)) {
                            if (error.hasOwnProperty('errors')) {
                                var gottenErrors = error.errors.map(msg => msg.msg)
                                me.newAlert(gottenErrors, 2000, "red");
                            }
                        }
                    });
            }
        })
    }
]