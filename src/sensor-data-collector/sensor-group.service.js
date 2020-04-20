export default ['$http', 'config',
    function ($http, config) {
        var me = this;
        angular.extend(me, {
            btnSelectDeselectClicked: false,
            groups: [],
            selectedGroupUnits: [],
            groupSelected: '',

            selectDeselectAllGroups() {
                me.btnSelectDeselectClicked = !me.btnSelectDeselectClicked;
                me.groups.forEach(group => group.checked = me.btnSelectDeselectClicked);
            },
            selectDeselectAllUnits(groupClicked) {
                me.btnSelectDeselectClicked = !me.btnSelectDeselectClicked;
                me.selectedGroupUnits.forEach(unit => {
                    if (unit.group_id == groupClicked) {
                        unit.checked = me.btnSelectDeselectClicked
                    }
                });
            },

            getGroupUnits(groupSelected) {
                me.groupSelected = groupSelected;
                return $http.get(config.sensorApiEndpoint + '/groups/units/' + groupSelected)
                    .then(function success(response) {
                        return response.data;
                    }).then(function (response) {
                        if (response == '') {
                            return false;
                        } else {
                            me.selectedGroupUnits = me.selectedGroupUnits.concat(response.filter(data => me.selectedGroupUnits.filter(gu => gu.group_id == data.group_id && gu.unit_id == data.unit_id).length == 0));
                            return true;
                        }
                    })
                    .catch(function (error) {
                        console.error("Error!", error);
                    })
            },
            getGroups() {
                return $http.get(config.sensorApiEndpoint + '/groups/data')
                    .then(function success(response) {
                        if (response.data == '') {
                            me.groups = [];
                            return false;
                        }
                        else {
                            me.groups = response.data;
                            return true;
                        }

                    })
                    .catch(function (error) {
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
            deleteSelectedGroups() {
                var deleteAll = window.confirm("Do you really want to delete all selected groups from the database?");
                if (deleteAll) {
                    var checked = me.groups.filter(group => group.checked == true).map(id => id.group_id);
                    return $http.post(config.sensorApiEndpoint + '/groups/delete', { params: checked })
                        .then(function success(res) {
                            me.newAlert(res.data, 2000, "green");
                        })
                        .then(_ => {
                            me.groups = me.groups.filter(group => group.checked != true);
                            if (me.groups == '') {
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
            },
            deleteSelectedUnits(groupSelected) {
                var deleteAll = window.confirm("Do you really want to delete all selected units from the group?");
                if (deleteAll) {
                    var checked = me.selectedGroupUnits.filter(unit => unit.checked == true).map(id => id.unit_id);
                    return $http.post(config.sensorApiEndpoint + '/groups/delete/units', { params: checked, group: groupSelected })
                        .then(function success(res) {
                            me.newAlert(res.data, 2000, "green");
                        })
                        .then(_ => {
                            me.selectedGroupUnits = me.selectedGroupUnits.filter(unit => unit.checked != true);
                            if (me.selectedGroupUnits.filter(u => u.group_id != groupSelected)) {
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