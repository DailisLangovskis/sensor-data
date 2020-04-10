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
    check('measuredValue').isNumeric().withMessage("Measured value must be a numeric value!").exists(),
    check('time').exists()
], addObservationDataHandler)

async function addObservationDataHandler(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    var getUnitPos = "SELECT id FROM units_positions WHERE unit_id = ($1)"
    var insertObservation = 'INSERT INTO observations(sensor_id, time_stamp, observed_value, unit_id, units_pos_id) VALUES ($1,$2,$3,$4,$5)';
    try {
        await db.query(getUnitPos, [req.body.unitId])
            .then(async function(res) {
                await db.query(insertObservation, [req.body.sensor, req.body.time, req.body.measuredValue, req.body.unitId, res.rows[0].id])
            })
            .catch(e => console.log(e.stack))
    } catch (e){
        console.log(e.stack)
    }
    res.status(201).send('Insert completed!');
}