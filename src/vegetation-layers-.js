import { Tile, Group, Image as ImageLayer } from 'ol/layer';
import { TileWMS, WMTS, OSM, XYZ } from 'ol/source';

export default [
    new Tile({
    title: "NDVI index (Vilcini, 2019-04-18)",
    source: new XYZ({
        attributions: '&copy; <a href="http://www.baltsat.lv/">Baltic Satellite Service</a>, <a href="https://www.esa.int/">European Space Agency - ESA</a>',
        url: '/proxy/https://api.forestradar.com/tiles-v1/public/ndvi_20190418_tiles/{z}/{x}/{y}.png',
        tms: false,
        crossOrigin: true,

    }),
    maxZoom: 14,
    minZoom: 12,
    path: 'Vegetation indexes',
    visible: false,
    opacity: 1
}),
new Tile({
    title: "NDVI index (Vilcini, 2019-05-30)",
    source: new XYZ({
        attributions: '&copy; <a href="http://www.baltsat.lv/">Baltic Satellite Service</a>, <a href="https://www.esa.int/">European Space Agency - ESA</a>',
        url: '/proxy/https://api.forestradar.com/tiles-v1/public/ndvi_20190530_tiles/{z}/{x}/{y}.png',
        tms: false,
        crossOrigin: true,

    }),
    maxZoom: 14,
    minZoom: 12,
    path: 'Vegetation indexes',
    visible: false,
    opacity: 1
}),
new Tile({
    title: "NDVI index (Vilcini, 2019-06-04)",
    source: new XYZ({
        attributions: '&copy; <a href="http://www.baltsat.lv/">Baltic Satellite Service</a>, <a href="https://www.esa.int/">European Space Agency - ESA</a>',
        url: '/proxy/https://api.forestradar.com/tiles-v1/public/ndvi_20190604_tiles/{z}/{x}/{y}.png',
        tms: false,
        crossOrigin: true,

    }),
    maxZoom: 14,
    minZoom: 12,
    path: 'Vegetation indexes',
    visible: false,
    opacity: 1
}),
new Tile({
    title: "NDVI index (Vilcini, 2019-06-24)",
    source: new XYZ({
        attributions: '&copy; <a href="http://www.baltsat.lv/">Baltic Satellite Service</a>, <a href="https://www.esa.int/">European Space Agency - ESA</a>',
        url: '/proxy/https://api.forestradar.com/tiles-v1/public/ndvi_20190624_tiles/{z}/{x}/{y}.png',
        tms: false,
        crossOrigin: true,

    }),
    maxZoom: 14,
    minZoom: 12,
    path: 'Vegetation indexes',
    visible: false,
    opacity: 1
}),
new Tile({
    title: "NDVI index (Vilcini, 2019-07-19)",
    source: new XYZ({
        attributions: '&copy; <a href="http://www.baltsat.lv/">Baltic Satellite Service</a>, <a href="https://www.esa.int/">European Space Agency - ESA</a>',
        url: '/proxy/https://api.forestradar.com/tiles-v1/public/ndvi_20190719_tiles/{z}/{x}/{y}.png',
        tms: false,
        crossOrigin: true,

    }),
    maxZoom: 14,
    minZoom: 12,
    path: 'Vegetation indexes',
    visible: false,
    opacity: 1
}),
new Tile({
    title: "NDVI index (Vilcini, 2019-08-23)",
    source: new XYZ({
        attributions: '&copy; <a href="http://www.baltsat.lv/">Baltic Satellite Service</a>, <a href="https://www.esa.int/">European Space Agency - ESA</a>',
        url: '/proxy/https://api.forestradar.com/tiles-v1/public/ndvi_20190823_tiles/{z}/{x}/{y}.png',
        tms: false,
        crossOrigin: true,

    }),
    maxZoom: 14,
    minZoom: 12,
    path: 'Vegetation indexes',
    visible: false,
    opacity: 1
}),
new Tile({
    title: "NDVI index (Vilcini, 2019-09-05)",
    source: new XYZ({
        attributions: '&copy; <a href="http://www.baltsat.lv/">Baltic Satellite Service</a>, <a href="https://www.esa.int/">European Space Agency - ESA</a>',
        url: '/proxy/https://api.forestradar.com/tiles-v1/public/ndvi_20190905_tiles/{z}/{x}/{y}.png',
        tms: false,
        crossOrigin: true,

    }),
    maxZoom: 14,
    minZoom: 12,
    path: 'Vegetation indexes',
    visible: false,
    opacity: 1
}),
new Tile({
    title: "NDVI index (Vilcini, 2019-09-27)",
    source: new XYZ({
        attributions: '&copy; <a href="http://www.baltsat.lv/">Baltic Satellite Service</a>, <a href="https://www.esa.int/">European Space Agency - ESA</a>',
        url: '/proxy/https://api.forestradar.com/tiles-v1/public/ndvi_20190927_tiles/{z}/{x}/{y}.png',
        tms: false,
        crossOrigin: true,

    }),
    maxZoom: 14,
    minZoom: 12,
    path: 'Vegetation indexes',
    visible: false,
    opacity: 1
}),
new Tile({
    title: "LAI index (Vilcini, 2019-04-18)",
    source: new XYZ({
        attributions: '&copy; <a href="http://www.baltsat.lv/">Baltic Satellite Service</a>, <a href="https://www.esa.int/">European Space Agency - ESA</a>',
        url: '/proxy/https://api.forestradar.com/tiles-v1/public/lai_20190418_tiles/{z}/{x}/{y}.png',
        tms: false,
        crossOrigin: true,

    }),
    maxZoom: 14,
    minZoom: 12,
    path: 'Vegetation indexes',
    visible: false,
    opacity: 1
}),
new Tile({
    title: "LAI index (Vilcini, 2019-05-23)",
    source: new XYZ({
        attributions: '&copy; <a href="http://www.baltsat.lv/">Baltic Satellite Service</a>, <a href="https://www.esa.int/">European Space Agency - ESA</a>',
        url: '/proxy/https://api.forestradar.com/tiles-v1/public/lai_20190530_tiles/{z}/{x}/{y}.png',
        tms: false,
        crossOrigin: true,

    }),
    maxZoom: 14,
    minZoom: 12,
    path: 'Vegetation indexes',
    visible: false,
    opacity: 1
}),
new Tile({
    title: "LAI index (Vilcini, 2019-06-04)",
    source: new XYZ({
        attributions: '&copy; <a href="http://www.baltsat.lv/">Baltic Satellite Service</a>, <a href="https://www.esa.int/">European Space Agency - ESA</a>',
        url: '/proxy/https://api.forestradar.com/tiles-v1/public/lai_20190604_tiles/{z}/{x}/{y}.png',
        tms: false,
        crossOrigin: true,

    }),
    maxZoom: 14,
    minZoom: 12,
    path: 'Vegetation indexes',
    visible: false,
    opacity: 1
}),
new Tile({
    title: "LAI index (Vilcini, 2019-06-24)",
    source: new XYZ({
        attributions: '&copy; <a href="http://www.baltsat.lv/">Baltic Satellite Service</a>, <a href="https://www.esa.int/">European Space Agency - ESA</a>',
        url: '/proxy/https://api.forestradar.com/tiles-v1/public/lai_20190624_tiles/{z}/{x}/{y}.png',
        tms: false,
        crossOrigin: true,

    }),
    maxZoom: 14,
    minZoom: 12,
    path: 'Vegetation indexes',
    visible: false,
    opacity: 1
}),
new Tile({
    title: "LAI index (Vilcini, 2019-08-23)",
    source: new XYZ({
        attributions: '&copy; <a href="http://www.baltsat.lv/">Baltic Satellite Service</a>, <a href="https://www.esa.int/">European Space Agency - ESA</a>',
        url: '/proxy/https://api.forestradar.com/tiles-v1/public/lai_20190823_tiles/{z}/{x}/{y}.png',
        tms: false,
        crossOrigin: true,

    }),
    maxZoom: 14,
    minZoom: 12,
    path: 'Vegetation indexes',
    visible: false,
    opacity: 1
}),
new Tile({
    title: "LAI index (Vilcini, 2019-09-05)",
    source: new XYZ({
        attributions: '&copy; <a href="http://www.baltsat.lv/">Baltic Satellite Service</a>, <a href="https://www.esa.int/">European Space Agency - ESA</a>',
        url: '/proxy/https://api.forestradar.com/tiles-v1/public/lai_20190905_tiles/{z}/{x}/{y}.png',
        tms: false,
        crossOrigin: true,

    }),
    maxZoom: 14,
    minZoom: 12,
    path: 'Vegetation indexes',
    visible: false,
    opacity: 1
}),
new Tile({
    title: "LAI index (Vilcini, 2019-09-27)",
    source: new XYZ({
        attributions: '&copy; <a href="http://www.baltsat.lv/">Baltic Satellite Service</a>, <a href="https://www.esa.int/">European Space Agency - ESA</a>',
        url: '/proxy/https://api.forestradar.com/tiles-v1/public/lai_20190927_tiles/{z}/{x}/{y}.png',
        tms: false,
        crossOrigin: true,

    }),
    maxZoom: 14,
    minZoom: 12,
    path: 'Vegetation indexes',
    visible: false,
    opacity: 1
})]