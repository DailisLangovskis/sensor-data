export default ['$window', '$injector',
    function ($window, $injector) {
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
                    return false;
                }
                else {
                    return true;
                }
            },
            returnToLogin: function () {
                return me.toLogin = true;
            },
            logOut: function () {
                $injector.get('$http').post('http://localhost:8099/auth/delete', { refreshToken: me.getRefreshToken() })
                    .then(function success(res) {
                        me.clearAllToken();
                        me.toLogin = true;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }

        })
    }
]