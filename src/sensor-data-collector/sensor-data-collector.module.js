import sensorDataCollectorService from './sensor-data-collector.service';
import sensorRowComponent from './sensor-row.component';
import sensorDataCollectorComponent from './sensor-data-collector.component';
import indexComponent from './index.component';
import userAuthService from './user-auth.service';
angular.module('sens.sensorDataCollectorModule', ['hs.core', 'hs.map'])
    .directive('sens.sensorDataCollector.sidebarBtn', function () {
        return {
            template: require('./partials/sidebar-btn.directive.html')
        };
    })

    .service("sens.sensorDataCollector.service", sensorDataCollectorService)
    
    .service("sens.userAuth.service", userAuthService)

    .component('sens.sensorDataCollector', sensorDataCollectorComponent)

    .component('sens.index', indexComponent)

    .component('sens.sensorRow', sensorRowComponent);