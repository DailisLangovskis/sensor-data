export default ['$http', 'HsConfig',
    function ($http, config) {
        var me = this;
        angular.extend(me, {
            btnSelectDeselectClicked: false,
            groups: [],
            selectedGroupUnits: [],
            selectDeselectAllGroups() {
                me.btnSelectDeselectClicked = !me.btnSelectDeselectClicked;
                me.groups.forEach(function (group) {
                    group.checked = me.btnSelectDeselectClicked;
                    me.selectAllUnits(group);
                })
            },
            selectAllUnits(group) {
                if (me.selectedGroupUnits == 0) return;
                else {
                    me.selectedGroupUnits.forEach(unit => {
                        if (unit.group_id == group.group_id) {
                            unit.checked = group.checked;
                        }
                    });
                }
            },
            getGroupUnits(groupClicked) {
                return $http.get(config.sensorApiEndpoint + '/groups/units/' + groupClicked)
                    .then(function success(response) {
                        if (response.data.length != 0) {
                            me.selectedGroupUnits = me.selectedGroupUnits.concat(response.data.filter(data => me.selectedGroupUnits.filter(gu => gu.group_id == data.group_id && gu.unit_id == data.unit_id).length == 0));
                            me.selectedGroupUnits.forEach(u => u.checked = false);
                            return false;
                        } else {
                            return true;
                        }
                    })
                    .catch(function failed(error) {
                        console.error("Error!", error);
                    })
            },
            getGroups() {
                return $http.get(config.sensorApiEndpoint + '/groups/data')
                    .then(function success(response) {
                        if (response.data.length != 0) {
                            me.groups = response.data;
                            me.groups.forEach(g => g.checked = false);
                            return false;
                        } else {
                            me.groups = [];
                            return true;
                        }


                    })
                    .catch(function failed(error) {
                        console.error("Error!", error);
                    });
            },
            saveGroup: function (groupName) {
                var data = { name: groupName };
                return $http.post(config.sensorApiEndpoint + '/groups/data', data)
                    .then(function success(res) {
                        me.newAlert(res.data, 2000, "green");
                        me.getGroups();
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
            deleteSelectedGroups() {
                var checked = me.groups.filter(group => group.checked == true).map(id => id.group_id);
                return $http.post(config.sensorApiEndpoint + '/groups/delete', { params: checked })
                    .then(_ => {
                        me.groups = me.groups.filter(group => group.checked != true);
                        checked = [];
                    })
                    .catch(function failed(error) {
                        if (angular.isDefined(error)) {
                            if (error.hasOwnProperty('errors')) {
                                var gottenErrors = error.errors.map(msg => msg.msg)
                                me.newAlert(gottenErrors, 2000, "red");
                            }
                        }
                    });
            },
            deleteSelectedUnits() {
                var checked = new Set(me.selectedGroupUnits.filter(unit => unit.checked == true).map(id => id.unit_id));
                checked = [...checked];
                var unitsGroupArray = new Set(me.selectedGroupUnits.filter(unit => unit.checked == true).map(group_id => group_id.group_id));
                unitsGroupArray = [...unitsGroupArray];
                return $http.post(config.sensorApiEndpoint + '/groups/delete/units', { params: checked, groups: unitsGroupArray })
                    .then(_ => {
                        me.selectedGroupUnits = me.selectedGroupUnits.filter(unit => unit.checked != true);
                        checked = [];
                        unitsGroupArray = [];
                    })
                    .catch(function failed(error) {
                        if (angular.isDefined(error)) {
                            if (error.hasOwnProperty('errors')) {
                                var gottenErrors = error.errors.map(msg => msg.msg)
                                me.newAlert(gottenErrors, 2000, "red");
                            }
                        }
                    });
            },
            //custom alert box
            newAlert(msg, timer, background) {
                document.getElementById('alert').innerHTML = '<b>' + msg + '</b>';
                document.getElementById('alert').style.backgroundColor = background;
                document.getElementById('alert').style.opacity = "0.7";
                setTimeout(function () { document.getElementById('alert').innerHTML = ''; }, timer)
            },
        })
    }
]