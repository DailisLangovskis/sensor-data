import analysisComponent from './analysis.component';
import analysisService from './analysis.service';

angular.module('fie.analysis', ['hs.core', 'hs.map'])
    .directive('fie.analysis.sidebarBtn', function () {
        return {
            template: require('./analysis-sidebar-btn.directive.html')
        };
    })
    
    .directive('hs.infoDirective', function () {
        return {
            template: require('./info.html'),
            link: function (scope, element, attrs) {
                scope.infoModalVisible = true;
                scope.image = attrs.image;
            }
        };
    })

    .service("fie.analysis.service", analysisService)

    .component('fie.analysis', analysisComponent);
