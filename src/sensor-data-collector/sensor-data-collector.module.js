import sensorDataCollectorService from './sensor-data-collector.service';
import sensorRowComponent from './sensor-row.component';
import sensorDataCollectorComponent from './sensor-data-collector.component';
import indexComponent from './index.component';
import loginRegisterService from './login-register.service';
import sensorRowService from './sensor-row.service';
import authService from './auth.service';

angular.module('sens.sensorDataCollectorModule', ['hs.core', 'hs.map'])
    .directive('sens.sensorDataCollector.sidebarBtn', function () {
        return {
            template: require('./partials/sidebar-btn.directive.html')
        };
    })

    .service("sens.sensorDataCollector.service", sensorDataCollectorService)

    .service("sens.loginRegister.service", loginRegisterService)

    .service("sens.auth.service", authService)

    .service("sens.sensorRow.service", sensorRowService)

    .service("sens.authInterceptor", ['sens.auth.service', '$q','$window',
        function (authService, $q, $window) {
            var authInterceptor = {
                responseError: function (response) {
                    if (response.status === 403) {
                        authService.clearAllToken();
                        $window.alert(response.data);
                    }
                    return $q.reject(response.data);
                }
            };
            return authInterceptor;
        }])

    .component('sens.sensorDataCollector', sensorDataCollectorComponent)

    .component('sens.index', indexComponent)

    .component('sens.sensorRow', sensorRowComponent)

    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('sens.authInterceptor');
    }])