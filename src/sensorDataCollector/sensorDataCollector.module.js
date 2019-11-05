import sensorDataCollectorComponent from './sensorDataCollector.component';
import sensorDataCollectorService from './sensorDataCollector.service';

angular.module('sens.sensorDataCollector', ['hs.core', 'hs.map'])

    .service("sens.sensorDataCollector.service", sensorDataCollectorService)

    .component('sens.sensorDataCollector', sensorDataCollectorComponent);