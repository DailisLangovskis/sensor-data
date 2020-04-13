export default {
    template: require('./partials/index.html'),
    controller: ['$scope', "sens.loginRegister.service", "sens.auth.service",
        function ($scope, loginRegister, authService) {
            angular.extend($scope, {
                loginRegister,
                authService,
                name: '',
                lastname: '',
                email: '',
                username: '',
                password: '',
                rePassword: '',
                logUsername: '',
                logPassword: '',
                registerTabVisible: false,

                login() {
                    loginRegister.login($scope.logUsername, $scope.logPassword).then(function (response) {
                        if (!response) {
                            authService.loggedIn = true;
                            $scope.logUsername = '';
                            $scope.logPassword = '';

                        }
                    })
                },
                register() {
                    if ($scope.password !== $scope.rePassword) {
                        window.alert("Passwords do not match!");
                        $scope.password = '';
                        $scope.rePassword = '';
                    }
                    else {
                        loginRegister.registerUser($scope.name, $scope.lastname, $scope.email, $scope.username, $scope.password).then(function (response) {
                            if (!response) {
                                $scope.name = '';
                                $scope.lastname = '';
                                $scope.email = '';
                                $scope.username = '';
                                $scope.password = '';
                                $scope.rePassword = '';
                                $scope.registerTabVisible = !$scope.registerTabVisible;
                            }
                        })
                    }
                }
            })
            $scope.$on('logout', function () {
                $scope.name = '';
                    $scope.lastname = '';
                    $scope.email = '';
                    $scope.usernam = '';
                    $scope.password = '';
                    $scope.rePassword = '';
                    $scope.logUsername = '';
                    $scope.logPassword = '';
                    $scope.registerTabVisible = false;
                    loginRegister.loggedInUser = '';
            })
        }
    ]
}