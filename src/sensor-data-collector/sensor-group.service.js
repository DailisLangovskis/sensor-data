export default ['$http', 'config','sens.auth.service',
    function ($http, config, authService) {
        var me = this;
        angular.extend(me, {
            btnSelectDeseletClicked: true,
            groups: [],
            selectedGroupUnits: [],
            
            init(){
                if(authService.loggedIn) me.getGroups();
            },
            selectDeselectAllGroups() {
                me.btnSelectDeseletClicked = !me.btnSelectDeseletClicked;
                me.groups.forEach(group => group.checked = me.btnSelectDeseletClicked);
            },
            selectDeselectAllUnits() {
                me.btnSelectDeseletClicked = !me.btnSelectDeseletClicked;
                me.selectedGroupUnits.forEach(unit => unit.checked = me.btnSelectDeseletClicked);
            },

            getGroupUnits: function(groupSelected){
                return $http.get(config.sensorApiEndpoint + '/groups/units/' + groupSelected.id)
                .then(function success(response) {
                    return response.data;
                }).then(function (response) {
                    if(response == '') {
                    window.alert("No units found for this group!")
                    return false
                    }else {
                        me.selectedGroupUnits = response;
                        return true
                    }
                })
                .catch(function (error) {
                    console.error("Error!", error);
                })
            },
            getGroups(){
                $http.get(config.sensorApiEndpoint + '/groups/data')
                    .then(function success(response) {
                        me.groups = response.data;
                    })
                    .catch(function (error) {
                        console.error("Error!", error);
                    });
            },
            saveGroups: function (groupName) {
                var data = { name: groupName};
                return $http.post(config.sensorApiEndpoint + '/groups/data', data)
                    .then(function success(res) {
                        me.newAlert(res.data, 2000, "green");
                        me.getGroups();
                        return false;
                    })
                    .catch(function (error) {
                        if(angular.isDefined(error)){
                            if (error.hasOwnProperty('errors')) {
                                var gottenErrors = error.errors.map(msg => msg.msg)
                                me.newAlert(gottenErrors, 2000, "red");
                            }
                        }           
                        return true;
                    });
            },
            newAlert(msg, timer, background) {
                document.getElementById('alert').innerHTML = '<b>' + msg + '</b>';
                document.getElementById('alert').style.backgroundColor = background;
                document.getElementById('alert').style.opacity = "0.7";
                setTimeout(function () { document.getElementById('alert').innerHTML = ''; }, timer)
            },
        })
        me.init();
    }
]