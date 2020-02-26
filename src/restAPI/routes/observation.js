const Router = require('express-promise-router');
const db = require('../db');
const bodyparser = require('body-parser');
const { check, validationResult } = require('express-validator');
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();
// export our router to be mounted by the parent application
module.exports = router
router.use(bodyparser());
router.post('/save', [
    check('sensor').isNumeric(),
    check('phenomena').isNumeric(),
    check('measuredValue').isNumeric().withMessage("Measured value must be a numeric value!").exists(),
    check('time').exists(),
    check('refSys').isNumeric().exists(),
    check('wktGeom').exists(),
], addObservationDataHandler)

function addObservationDataHandler(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    var insertSensor = 'INSERT INTO observations(sensor_id, phenomena_id, ref_sys_id, time_stamp, observed_value, wkt_geom) VALUES ($1,$2,$3,$4,$5,$6)';
    try {
        db.query(insertSensor, [req.body.sensor, req.body.phenomena, req.body.refSys, req.body.time, req.body.measuredValue, req.body.wktGeom])
            .then(_ => {
                res.send('Insert completed!');
            })
            .catch(e => console.log(e.stack))
    } catch (e) {
        console.log(e.stack);
    }
}