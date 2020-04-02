export default ['$http', 'sens.auth.service',
    function ($http, authService) {
        var me = this;
        angular.extend(me, {
            registerUser: function (name, lastname, email, username, password) {
                var user = { name: name, lastname: lastname, email: email, username: username, password: password };
                return $http.post('http://localhost:8099/registerUser', user)
                    .then(function success(res) {
                        me.userAlert(res.data, 2000, "green");
                        return false;
                    })
                    .catch(function (error) {
                        console.log(error);
                        if (error.hasOwnProperty('errors')) {
                            var gottenErrors = error.errors.map(msg => msg.msg)
                            me.userAlert(gottenErrors, 2000, "red");
                        }
                        return true;
                    });
            },
            login: function (username, password) {
                var user = { username: username, password: password };
                return $http.post('http://localhost:8099/login', user)
                    .then(function success(res) {
                        authService.setToken(res.data.accessToken);
                        authService.setRefreshToken(res.data.refreshToken);
                        //$http.defaults.headers.common['authorization'] = authService.getToken();
                        me.userAlert(res.data.msg, 2000, "green");
                        return false;
                    })
                    .catch(function (error) {
                        console.log(error);
                        if (error.hasOwnProperty('errors')) {
                            var gottenErrors = error.errors.map(msg => msg.msg)
                            me.userAlert(gottenErrors, 2000, "red");
                        }
                        return true;
                    });
            },
            loggedIn: authService.isLoggedIn,
            userAlert(msg, timer, background) {
                document.getElementById('alert-user').innerHTML = '<b>' + msg + '</b>';
                document.getElementById('alert-user').style.backgroundColor = background;
                document.getElementById('alert-user').style.opacity = "0.7";
                setTimeout(function () { document.getElementById('alert-user').innerHTML = ''; }, timer)
            },
        })
        me.loggedIn();
    }
]