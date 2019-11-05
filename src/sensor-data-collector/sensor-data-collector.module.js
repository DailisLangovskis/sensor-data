import sensorDataCollectorComponent from './sensor-data-collector.component';
import sensorDataCollectorService from './sensor-data-collector.service';

angular.module('sens.sensorDataCollector', ['hs.core', 'hs.map'])
    .directive('sens.sensorDataCollector.sidebarBtn', function () {
        return {
            template: require('./partials/sidebar-btn.directive.html')
        };
    })

    .service("sens.sensorDataCollector.service", sensorDataCollectorService)

    .component('sens.sensorDataCollector', sensorDataCollectorComponent);