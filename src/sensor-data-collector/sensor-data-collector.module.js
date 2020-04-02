import sensorDataCollectorService from './sensor-data-collector.service';
import sensorRowComponent from './sensor-row.component';
import sensorDataCollectorComponent from './sensor-data-collector.component';
import indexComponent from './index.component';
import loginRegisterService from './login-register.service';
import sensorRowService from './sensor-row.service';
import authService from './auth.service';
import { deepEqual } from 'vega-lite/build/src/util';

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

    .service("sens.authInterceptor", ['sens.auth.service', '$q', '$window', '$injector',
        function (authService, $q, $window, $injector) {
            var inFlightAuthRequest = null;
            return {
                request: function (config) {
                    config.headers = config.headers || {};
                    if (authService.getToken()) {
                        config.headers['authorization'] = authService.getToken()
                    }
                    return config;
                },
                responseError: function (response) {
                    if (response.config.url == 'http://localhost:8099/login/token') {
                        authService.clearAllToken();
                        authService.toLogin();
                    } else {
                        switch (response.status) {
                            case 401:
                                authService.clearToken();
                                var deffered = $q.defer();
                                if (!inFlightAuthRequest) {
                                    inFlightAuthRequest = $injector.get('$http').post('http://localhost:8099/login/token', { refreshToken: authService.getRefreshToken() });

                                }
                                inFlightAuthRequest.then(function (res) {
                                    inFlightAuthRequest = null;
                                    authService.setToken(res.data.accessToken);
                                    $injector.get('$http')(response.config).then(function (resp) {
                                        deffered.resolve(resp);
                                    }, function (resp) {
                                        deffered.reject(resp);
                                    });
                                }, function (error) {
                                    inFlightAuthRequest = null;
                                    deffered.reject();
                                    authService.clearAllToken();
                                    authService.toLogin();
                                    $window.alert(error);
                                    return;
                                });
                                return deffered.promise;
                                break;
                            default:
                                return $q.reject(response.data);
                                break;
                        }
                        return response || $q.when(response);
                    };
                }
            }
        }])

    .component('sens.sensorDataCollector', sensorDataCollectorComponent)

    .component('sens.index', indexComponent)

    .component('sens.sensorRow', sensorRowComponent)

    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('sens.authInterceptor');
    }])