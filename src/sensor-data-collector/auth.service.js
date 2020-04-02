export default ['$window',
    function ($window) {
        var me = this;
        angular.extend(me, {
            getToken: function() {
                return $window.localStorage.getItem('JWT');
            },
            getRefreshToken: function() {
                return $window.localStorage.getItem('Refresh-JWT');
            },
            setRefreshToken: function(token) {
                $window.localStorage.setItem('Refresh-JWT', token);
            },
            setToken: function(token) {
                $window.localStorage.setItem('JWT', token);
            },
            clearAllToken: function(){
                $window.localStorage.removeItem('JWT');
                $window.localStorage.removeItem('Refresh-JWT');
            },
            clearToken: function(){
                $window.localStorage.removeItem('JWT');
            },
            isLoggedIn: function() {
                if ($window.localStorage.getItem('JWT') === null) {
                    return false;
                }
                else {
                    return true;
                }
            }
        })
    }
]