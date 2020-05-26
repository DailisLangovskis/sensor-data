import sensorService from './sensor.service';
import sensorRowComponent from './sensor-row.component';
import sensorDataCollectorComponent from './sensor-data-collector.component';
import indexComponent from './sensor-index.component';
import loginRegisterService from './login-register.service';
import authService from './auth.service';
import groupsRowComponent from './sensor-groups-row.component';
import unitsRowComponent from './sensor-units-row.component';
import sensorGroupService from './sensor-group.service';
import sensorUnitService from './sensor-unit.service';
import 'angular-chart.js';
import 'chart.js';
import 'chartjs-plugin-zoom';
angular.module('sens.sensorDataCollectorModule', ['hs.core', 'hs.map', 'chart.js'])
    .directive('sens.sensorDataCollector.sidebarBtn', function () {
        return {
            template: require('./partials/sidebar-btn.directive.html')
        };
    })
    //directive for chart popup
    .directive('sens.chartDirective', function () {
        return {
            template: require('./partials/chartModal.html'),
            link: function (scope) {
                scope.chartModalVisible = true;
            }
        };
    })
    //chart popup controller
    .controller('chartController', ['$scope', 'sens.sensor.service', function ($scope, sensorService) {
        angular.extend($scope, {
            close() {
                sensorService.sensorCollectedData = [];
            },
            saveAsImage() {
                /*Get image of canvas element*/
                const canvas = document.getElementById('sensor-data-chart');
                $scope.fillCanvasBackgroundWithColor(canvas, 'white');
                var url_base64jp = document.getElementById("sensor-data-chart").toDataURL("image/png", 1.0);
                /*get download button (tag: <a></a>) */
                var a = document.getElementById("save-as-image");
                /*insert chart image url to download button (tag: <a></a>) */
                a.href = url_base64jp;
            },
            exportAsCSV() {
                //creating CSV data from JSON data
                var items = sensorService.sensorCollectedData;
                const replacer = (key, value) => value === null ? '' : value; //handling null values
                const header = Object.keys(items[0]);
                let csv = items.map(row => header.map(fielName => JSON.stringify(row[fielName], replacer)).join(','));
                csv.unshift(header.join(','));
                csv = csv.join('\r\n');

                //Download the file as CSV
                var downloadLink = document.createElement("a");
                var blob = new Blob(["\ufeff", csv]);
                var url = URL.createObjectURL(blob);
                downloadLink.href = url;
                downloadLink.download = new Date() + "-chartData.csv";  //Name the file here
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            },
            fillCanvasBackgroundWithColor(canvas, color) {
                // Get the 2D drawing context from the provided canvas.
                const context = canvas.getContext('2d');

                // We're going to modify the context state, so it's
                // good practice to save the current state first.
                context.save();
                // Learn more about `globalCompositeOperation` here:
                // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
                context.globalCompositeOperation = 'destination-over';

                // Fill in the background. We do this by drawing a rectangle
                // filling the entire canvas, using the provided color.
                context.fillStyle = color;
                context.fillRect(0, 0, canvas.width, canvas.height);

                // Restore the original context state from `context.save()`
                context.restore();
            },
            setXAxis(value) {
                Chart.helpers.each(Chart.instances, function (instance) {
                    instance.chart.options.scales.xAxes[0].time.unit = value;
                    instance.chart.update();
                })

            }
        })
    }])
    .service("sens.sensor.service", sensorService)

    .service("sens.loginRegister.service", loginRegisterService)

    .service("sens.auth.service", authService)

    .service("sens.sensorGroup.service", sensorGroupService)

    .service("sens.sensorUnit.service", sensorUnitService)

    .component('sens.sensorDataCollector', sensorDataCollectorComponent)

    .component('sens.index', indexComponent)

    .component('sens.sensorRow', sensorRowComponent)

    .component('sens.groupsRow', groupsRowComponent)

    .component('sens.unitsRow', unitsRowComponent)
    // authorization header intercepting service, for updating access token from refresh token
    .service("sens.authInterceptor", ['sens.auth.service', '$q', '$window', '$injector', 'HsConfig',
        function (authService, $q, $window, $injector, config) {
            var inFlightAuthRequest = null;
            return {
                //provide autorization header for all requests
                request: function (config) {
                    config.headers = config.headers || {};
                    if (authService.getToken()) {
                        config.headers['authorization'] = authService.getToken()
                    }
                    return config;
                },
                //Check if user session is still active
                responseError: function (response) {
                    if (response.config.url == config.sensorApiEndpoint + '/auth/token') {
                        authService.clearAllToken();
                        authService.returnToLogin();
                        return;
                    } else {
                        switch (response.status) {
                            case 401:
                                authService.clearToken();
                                var deffered = $q.defer();
                                if (!inFlightAuthRequest) {
                                    inFlightAuthRequest = $injector.get('$http').post(config.sensorApiEndpoint + '/auth/token', { refreshToken: authService.getRefreshToken() });

                                }
                                inFlightAuthRequest.then(function (res) {
                                    inFlightAuthRequest = null
                                    if (res === undefined) return;
                                    authService.setToken(res.data.accessToken);
                                    $injector.get('$http')(response.config).then(function (resp) {
                                        deffered.resolve(resp);
                                    }, function (resp) {
                                        deffered.reject(resp);
                                    });

                                }, function (error) {
                                    inFlightAuthRequest = null;
                                    deffered.reject(error);
                                    authService.clearAllToken();
                                    authService.returnToLogin();
                                    $window.alert("Please relog into the site!");
                                    return deffered.promise;
                                });
                                deffered.reject();
                                authService.clearAllToken();
                                authService.returnToLogin();
                                $window.alert("Please relog into the site!");
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

    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('sens.authInterceptor');
    }])