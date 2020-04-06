export default ['$window', '$injector', 'config', 
    function ($window, $injector, config) {
        var me = this;
        angular.extend(me, {
            loggedIn: false,
            getToken: function () {
                return $window.localStorage.getItem('JWT');
            },
            getUsername: function () {
                return $window.localStorage.getItem('Username');
            },
            getRefreshToken: function () {
                return $window.localStorage.getItem('Refresh-JWT');
            },
            setRefreshToken: function (token) {
                $window.localStorage.setItem('Refresh-JWT', token);
            },
            setToken: function (token) {
                $window.localStorage.setItem('JWT', token);
            },
            setUsername: function (username) {
                $window.localStorage.setItem('Username', username);
            },
            clearAllToken: function () {
                $window.localStorage.removeItem('JWT');
                $window.localStorage.removeItem('Refresh-JWT');
                $window.localStorage.removeItem('Username');
            },
            clearToken: function () {
                $window.localStorage.removeItem('JWT');
            },
            isLoggedIn: function () {
                if ($window.localStorage.getItem('JWT') !== null) {
                    me.loggedIn = true;
                }
                else {
                    me.loggedIn = false;
                }
            },
            returnToLogin: function () {
                return me.loggedIn = false;
            },
            logout: function () {
                $injector.get('$http').post(config.sensorApiEndpoint + '/auth/delete', { refreshToken: me.getRefreshToken() })
                    .then(function success(res) {
                        me.clearAllToken();
                        me.loggedIn = false;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
        })
        me.isLoggedIn();
    }
]