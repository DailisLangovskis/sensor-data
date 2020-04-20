const Router = require('express-promise-router');
const db = require('../db');
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();
// export our router to be mounted by the parent application
module.exports = router

router.get('/load/:id', featureDataHandler)

async function featureDataHandler(req, res) {
    var id = req.params.id;
    var postgisToGeoJSON = "SELECT jsonb_build_object(\
        'type', 'FeatureCollection', \
        'features', jsonb_agg(features.feature) \
        )\
        FROM ( \
            SELECT jsonb_build_object(\
                'type', 'Feature',\
                'time_stamp', inputs.time_stamp,\
                'geometry', ST_AsGeoJSON(inputs.geom)::jsonb,\
                'properties', to_jsonb(inputs) - 'time_stamp' - 'geom' \
                ) AS feature \
                FROM ( SELECT observations.time_stamp, observations.observed_value, \
                observations.geom, sensors.sensor_name, phenomenons.phenomenon_name, phenomenons.unit \
                 FROM observations \
                 INNER JOIN sensors ON observations.sensor_id = sensors.sensor_id \
                 INNER JOIN phenomenons ON observations.phenomena_id = phenomenons.id\
                 WHERE observations.sensor_id = $1) inputs) features";
    try {
        const { rows } = await db.query(postgisToGeoJSON, [id])
        res.status(201).send(rows);
    } catch (e) {
        console.log(e.stack)
    }
}