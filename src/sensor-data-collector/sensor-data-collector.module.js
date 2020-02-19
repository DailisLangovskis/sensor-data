import sensorDataCollectorService from './sensor-data-collector.service';
import sensorDataCollectorComponent from './sensor-data-collector.component';
import sensorRowComponent from './sensor-row.component';
angular.module('sens.sensorDataCollector', ['hs.core', 'hs.map'])
    .directive('sens.sensorDataCollector.sidebarBtn', function () {
        return {
            template: require('./partials/sidebar-btn.directive.html')
        };
    })

    .service("sens.sensorDataCollector.service", sensorDataCollectorService)

    .component('sens.sensorDataCollector', sensorDataCollectorComponent)
    .component('sens.sensorRow', sensorRowComponent);