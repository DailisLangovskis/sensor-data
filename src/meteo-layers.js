import { transform, transformExtent } from 'ol/proj';
import { Tile, Group, Image as ImageLayer } from 'ol/layer';
import Projection from 'ol/proj/Projection.js';
import Static from 'ol/source/ImageStatic.js';
import moment from 'moment';
var weatherMapExtent = [16.3037109, 59.5955358, 32.4755859, 54.5274575];
var nowString = new moment().utc().format('YYYYMMDDHH');

export default [
    new ImageLayer({
        title: 'Cloud cover / precipitation',
        weatherMapExtent,
        opacity: 0.6,
        source: new Static({
          attributions: 'Meteoblue',
          url: `https://my.meteoblue.com/visimage/webmap?apikey=8vh83gfhu34g&variable=precipitation3h_cloudcover_pressure&time=${nowString}&level=surface&imgxs=1113&imgys=772&latmin=${weatherMapExtent[3]}&latmax=${weatherMapExtent[1]}&lonmin=${weatherMapExtent[0]}&lonmax=${weatherMapExtent[2]}&countryoverlay=1&colorbar=1`,
          imageExtent: transformExtent(weatherMapExtent, 'EPSG:4326', 'EPSG:3857')
        }),
        visible: false
    }),
    new ImageLayer({
        title: 'Temperature',
        weatherMapExtent,
        time: new moment(),
        opacity: 0.6,
        source: new Static({
          attributions: 'Meteoblue',
          url: `https://my.meteoblue.com/visimage/webmap?apikey=8vh83gfhu34g&variable=temperature&time=${nowString}&level=surface&imgxs=1113&imgys=772&latmin=${weatherMapExtent[3]}&latmax=${weatherMapExtent[1]}&lonmin=${weatherMapExtent[0]}&lonmax=${weatherMapExtent[2]}&countryoverlay=1&colorbar=1`,
          imageExtent: transformExtent(weatherMapExtent, 'EPSG:4326', 'EPSG:3857')
        }),
        visible: false
    }),
    new ImageLayer({
        title: 'Wind',
        weatherMapExtent,
        time: new moment(),
        opacity: 0.6,
        source: new Static({
          attributions: 'Meteoblue',
          url: `https://my.meteoblue.com/visimage/webmap?apikey=8vh83gfhu34g&variable=wind_streamlines&time=${nowString}&level=surface&imgxs=1113&imgys=772&latmin=${weatherMapExtent[3]}&latmax=${weatherMapExtent[1]}&lonmin=${weatherMapExtent[0]}&lonmax=${weatherMapExtent[2]}&countryoverlay=1&colorbar=1`,
          imageExtent: transformExtent(weatherMapExtent, 'EPSG:4326', 'EPSG:3857')
        }),
        visible: false
    }),
    new ImageLayer({
        title: 'Satellite and pressure',
        weatherMapExtent,
        time: new moment(),
        opacity: 0.6,
        source: new Static({
          attributions: 'Meteoblue',
          url: `https://my.meteoblue.com/visimage/webmap?apikey=8vh83gfhu34g&variable=obssat_pressure&time=${nowString}&level=surface&imgxs=1113&imgys=772&latmin=${weatherMapExtent[3]}&latmax=${weatherMapExtent[1]}&lonmin=${weatherMapExtent[0]}&lonmax=${weatherMapExtent[2]}&countryoverlay=1&colorbar=1`,
          imageExtent: transformExtent(weatherMapExtent, 'EPSG:4326', 'EPSG:3857')
        }),
        visible: false
    }),
    new ImageLayer({
        title: 'Temperature observations',
        weatherMapExtent,
        opacity: 0.6,
        source: new Static({
          attributions: 'Meteoblue',
          url: `https://my.meteoblue.com/visimage/webmap?apikey=8vh83gfhu34g&variable=obstemp&level=surface&imgxs=1113&imgys=772&latmin=${weatherMapExtent[3]}&latmax=${weatherMapExtent[1]}&lonmin=${weatherMapExtent[0]}&lonmax=${weatherMapExtent[2]}&countryoverlay=1&colorbar=1`,
          imageExtent: transformExtent(weatherMapExtent, 'EPSG:4326', 'EPSG:3857')
        }),
        visible: false
    })
]