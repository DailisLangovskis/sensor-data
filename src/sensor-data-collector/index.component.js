export default {
    template: require('./partials/index.html'),
    controller: ['$scope', 'sens.userAuth.service', 'sens.sensorDataCollector.service',
        function ($scope, authService, sensorService) {
            angular.extend($scope, {
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
                    authService.login($scope.logUsername, $scope.logPassword).then(function (response) {
                        if (response == false) {
                            $scope.logUsername = '';
                            $scope.logPassword = '';

                        }
                    }).then(_ => {
                        sensorService.getSensors();
                        sensorService.getPhenomenas();
                    })
                },
                registerTab() {
                    $scope.registerTabVisible = !$scope.registerTabVisible;
                },
                register() {
                    if ($scope.password !== $scope.rePassword) {
                        window.alert("Passwords do not match!");
                        $scope.password = '';
                        $scope.rePassword = '';
                    }
                    else {
                        authService.registerUser($scope.name, $scope.lastname, $scope.email, $scope.username, $scope.password).then(function (response) {
                            if (response == false) {
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
        }
    ]
}