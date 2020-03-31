export default ['$http',
    function ($http) {
        var me = this;
        angular.extend(me, {
            accessToken: '',
            registerUser: function (name, lastname, email, username, password) {
                var user = { name: name, lastname: lastname, email: email, username: username, password: password };
                return $http.post('http://localhost:8099/users/reg', user)
                    .then(function success(res) {
                        me.userAlert(res.data, 2000, "green");
                        return false;
                    })
                    .catch(function (error) {
                        if (error.data != null) {
                            var gottenErrors = error.data.errors.map(msg => msg.msg)
                            me.userAlert(gottenErrors, 4000, "red");
                        }
                        return true;
                    });
            },
            login: function (username, password) {
                var user = { username: username, password: password };
                return $http.post('http://localhost:8099/users/login', user)
                    .then(function success(res) {

                        me.accessToken = res.data.accessToken;

                        me.userAlert(res.data.msg, 2000, "green");
                        return false;
                    })
                    .catch(function (error) {
                        if (error.data != null) {
                            var gottenErrors = error.data.errors.map(msg => msg.msg)
                            me.userAlert(gottenErrors, 4000, "red");
                        }
                        return true;
                    });
            },
            userAlert(msg, timer, background) {
                document.getElementById('alert-user').innerHTML = '<b>' + msg + '</b>';
                document.getElementById('alert-user').style.backgroundColor = background;
                document.getElementById('alert-user').style.opacity = "0.7";
                setTimeout(function () { document.getElementById('alert-user').innerHTML = ''; }, timer)
            },
        })
    }
]