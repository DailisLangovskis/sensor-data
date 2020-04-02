export default ['$window', '$injector', 'config', 
    function ($window, $injector, config) {
        var me = this;
        angular.extend(me, {
            toLogin: true,
            getToken: function () {
                return $window.localStorage.getItem('JWT');
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
            clearAllToken: function () {
                $window.localStorage.removeItem('JWT');
                $window.localStorage.removeItem('Refresh-JWT');
            },
            clearToken: function () {
                $window.localStorage.removeItem('JWT');
            },
            isLoggedIn: function () {
                if ($window.localStorage.getItem('JWT') === null) {
                    me.toLogin = true;
                }
                else {
                    me.toLogin = false;
                }
            },
            returnToLogin: function () {
                return me.toLogin = true;
            },
            logOut: function () {
                $injector.get('$http').post(config.sensorApiEndpoint + '/auth/delete', { refreshToken: me.getRefreshToken() })
                    .then(function success(res) {
                        me.clearAllToken();
                        me.toLogin = true;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }

        })
        me.isLoggedIn()
    }
]