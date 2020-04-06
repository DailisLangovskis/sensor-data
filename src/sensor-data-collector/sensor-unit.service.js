export default ['$http', 'config','sens.auth.service','sens.sensorGroup.service',
    function ($http, config, authService, groupService) {
        var me = this;
        angular.extend(me, {
            btnSelectDeseletClicked: true,
            unitsSensors: [],
            featureCollection: '',
            newAlert:groupService.newAlert,

            selectDeselectAllSensors() {
                me.btnSelectDeseletClicked = !me.btnSelectDeseletClicked;
                me.unitsSensors.forEach(sensor => sensor.checked = me.btnSelectDeseletClicked);
            },
            showUnitSensors(unitSelected){
                return $http.get(config.sensorApiEndpoint + '/units/sensors/' + unitSelected.id)
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
        })
    }
]