export default ['$http', 'sens.auth.service', 'HsConfig',
    function ($http, authService, config) {
        var me = this;
        angular.extend(me, {
            //New user register request
            registerUser: function (name, lastname, email, username, password) {
                var user = { name: name, lastname: lastname, email: email, username: username, password: password };
                return $http.post(config.sensorApiEndpoint + '/registerUser', user)
                    .then(function success(res) {
                        me.userAlert(res.data, 2000, "green");
                        return false;
                    })
                    .catch(function failed(error) {
                        if (angular.isDefined(error)) {
                            if (error.hasOwnProperty('errors')) {
                                var gottenErrors = error.errors.map(msg => msg.msg)
                                me.userAlert(gottenErrors, 2000, "red");
                            }
                        }
                        return true;
                    });
            },
            //Login request
            login: function (username, password) {
                var user = { username: username, password: password };
                return $http.post(config.sensorApiEndpoint + '/auth', user)
                    .then(function success(res) {
                        authService.setToken(res.data.accessToken);
                        authService.setUsername(res.data.username);
                        authService.setRefreshToken(res.data.refreshToken);
                        me.loggedInUser = user.username;
                        me.userAlert(res.data.msg, 2000, "green");

                    })
                    .then(function () {
                        return false;
                    })
                    .catch(function failed(error) {
                        if (angular.isDefined(error)) {
                            if (error.hasOwnProperty('errors')) {
                                var gottenErrors = error.errors.map(msg => msg.msg)
                                me.userAlert(gottenErrors, 2000, "red");
                            }
                        }
                        return true;
                    });
            },
            //Custom alert message
            userAlert(msg, timer, background) {
                document.getElementById('alert-user').innerHTML = '<b>' + msg + '</b>';
                document.getElementById('alert-user').style.backgroundColor = background;
                document.getElementById('alert-user').style.opacity = "0.7";
                setTimeout(function () { document.getElementById('alert-user').innerHTML = ''; }, timer)
            },
        })
    }
]