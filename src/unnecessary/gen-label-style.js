import { Style, Icon, Stroke, Fill, Circle, Text } from 'ol/style';
export default new Style({
    geometry: function (feature) {
        var geometry = feature.getGeometry();
        if (geometry.getType() == 'MultiPolygon') {
            // Only render label for the widest polygon of a multipolygon
            var polygons = geometry.getPolygons();
            var widest = 0;
            for (var i = 0, ii = polygons.length; i < ii; ++i) {
                var polygon = polygons[i];
                var width = getWidth(polygon.getExtent());
                if (width > widest) {
                    widest = width;
                    geometry = polygon;
                }
            }
        }
        return geometry;
    },
    text: new Text({
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new Fill({
            color: '#000'
        }),
        stroke: new Stroke({
            color: '#fff',
            width: 3
        })
    })
})