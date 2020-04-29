export default ['$window', '$injector', 'config',
    function ($window, $injector, config) {
        var me = this;
        angular.extend(me, {
            loggedIn: false,
            //Get users token from the clients local storage
            getToken: function () {
                return $window.localStorage.getItem('JWT');
            },
            //Get users username from the clients local storage
            getUsername: function () {
                return $window.localStorage.getItem('Username');
            },
            //Get users refresh-token from the clients local storage
            getRefreshToken: function () {
                return $window.localStorage.getItem('Refresh-JWT');
            },
            //Set users refresh-token from the clients local storage
            setRefreshToken: function (token) {
                $window.localStorage.setItem('Refresh-JWT', token);
            },
            //Set users token from the clients local storage
            setToken: function (token) {
                $window.localStorage.setItem('JWT', token);
            },
            //Set users username from the clients local storage
            setUsername: function (username) {
                $window.localStorage.setItem('Username', username);
            },
            //Clean all localstorage on logout
            clearAllToken: function () {
                $window.localStorage.removeItem('JWT');
                $window.localStorage.removeItem('Refresh-JWT');
                $window.localStorage.removeItem('Username');
            },
            //Remove old token to replace it with new
            clearToken: function () {
                $window.localStorage.removeItem('JWT');
            },
            //check if user is logged in system
            isLoggedIn: function () {
                if ($window.localStorage.getItem('JWT') !== null) {
                    me.loggedIn = true;
                }
                else {
                    me.loggedIn = false;
                }
            },
            //user not logged in
            returnToLogin: function () {
                return me.loggedIn = false;
            },
            //logout user from the system
            logout: function () {
                $injector.get('$http').post(config.sensorApiEndpoint + '/auth/delete', { refreshToken: me.getRefreshToken() })
                    .then(function success() {
                        me.clearAllToken();
                        me.loggedIn = false;
                    })
                    .catch(function failed(error) {
                        console.log(error);
                    });
            },
        })
        me.isLoggedIn();
    }
]