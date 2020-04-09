export default ['$http', 'config','sens.auth.service','sens.sensorGroup.service',
    function ($http, config, authService, groupService) {
        var me = this;
        angular.extend(me, {
            btnSelectDeseletClicked: true,
            unitsSensors: [],
            featureCollection: '',
            newAlert:groupService.newAlert,
            unitSelected: '',
            allUnits: [],
            selectDeselectAllSensors() {
                me.btnSelectDeseletClicked = !me.btnSelectDeseletClicked;
                me.unitsSensors.forEach(sensor => sensor.checked = me.btnSelectDeseletClicked);
            },
            showUnitSensors(unitSelected){
                me.unitSelected = unitSelected;
                return $http.get(config.sensorApiEndpoint + '/units/sensors/' + unitSelected)
                .then(function success(response) {
                    return response.data;
                }).then(function (response) {
                    if(response == '') {
                    window.alert("No sensors found for this group!")
                    return false
                    }else {
                        me.unitsSensors = response;
                        return true
                    }
                })
                .catch(function (error) {
                    console.error("Error!", error);
                })
            },
            getAllUsersUnits(){
                return $http.get(config.sensorApiEndpoint + '/units/data')
                .then(function success(response) {
                    return response.data;
                }).then(function (response) {
                    if(response == '') {
                    me.allUnits = '';
                    return false
                    }else {
                        me.allUnits = response;
                        return true
                    }
                })
                .catch(function (error) {
                    console.error("Error!", error);
                })
            },
            saveAddedUnits(){
                var checked = me.allUnits.filter(unit => unit.checked == true).map(id => id.id);
                console.log(checked);
            },
            deleteSelectedSensors(selectedUnit){
                var deleteAll = window.confirm("Do you really want to delete all selected sensors from the database?");
                if (deleteAll) {
                    var checked = me.unitsSensors.filter(sensor => sensor.checked == true).map(id => id.sensor_id);
                    $http.post(config.sensorApiEndpoint + '/units/delete/sensors', { params: checked, unit: selectedUnit})
                        .then(function success(res) {
                            me.newAlert(res.data, 2000, "green");
                        })
                        .then(_ => {
                            me.showUnitSensors(me.unitSelected);
                        })
                        .catch(function (error) {
                            if(angular.isDefined(error)){
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