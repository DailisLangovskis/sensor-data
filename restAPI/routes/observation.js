const Router = require('express-promise-router');
const db = require('../db');
const { check, validationResult } = require('express-validator');
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();
// export our router to be mounted by the parent application
module.exports = router
//Save sensor measurement to database
router.post('/save', [
    check('sensor').isNumeric(),
    check('measuredValue').isNumeric().withMessage("Measured value must be a numeric value!").exists(),
    check('time').exists(),
    check('unitId').isNumeric(),
], addObservationDataHandler)
//Get sensor measurement from database
router.get('/collectedData', dataRequestHandler)
//Get sensor last measurement from database
router.get('/collectedData/lastObs', getEachSensorLastvalueHandler)
//Delete observations
router.post('/delete', deleteObservationsHandler)

async function addObservationDataHandler(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    var getUnitPos = 'SELECT id FROM units_positions WHERE unit_id = ($1)';
    var insertObservation = 'INSERT INTO observations(sensor_id, time_stamp, observed_value, unit_id, units_pos_id) VALUES ($1,$2,$3,$4,$5)';
    try {
        await db.query(getUnitPos, [req.body.unitId])
            .then(function (res) {
                return res;
            })
            .then(async function (res) {
                await db.query(insertObservation, [req.body.sensor, req.body.time, req.body.measuredValue, req.body.unitId, res.rows[0].id])
            }).then(_ => {
                res.status(201).send('Insert completed!');
            })
            .catch(e => console.log(e.stack))
    } catch (e) {
        console.log(e.stack)
    }

}

async function dataRequestHandler(req, res) {

    var getCollectedData = "SELECT data.observed_value, data.time_stamp, data.sensor_id, data.unit_id, p.unit,p.phenomenon_name FROM observations as data\
    INNER JOIN sensors as s\
    ON data.sensor_id = s.sensor_id\
    INNER JOIN phenomenons as p\
    ON s.phenomena_id = p.id\
    WHERE data.sensor_id = ($1) and data.unit_id = ($2) and data.time_stamp AT TIME ZONE 'EEST' > NOW() - INTERVAL '"+ req.query.interval + "' ORDER BY data.time_stamp DESC";
    try {
        const { rows } = await db.query(getCollectedData, [req.query.sensor, req.query.unit])
        res.status(201).send(rows)
    } catch (e) {
        console.log(e.stack)
    }
}
async function getEachSensorLastvalueHandler(req, res) {
    var getLastValue = 'SELECT data.observed_value, data.time_stamp, data.sensor_id, data.unit_id, s.sensor_name, p.unit, u.name FROM observations as data\
    INNER JOIN sensors as s\
    ON data.sensor_id = s.sensor_id\
    INNER JOIN phenomenons as p\
    ON s.phenomena_id = p.id\
    INNER JOIN units as u\
    ON data.unit_id = u.unit_id\
    WHERE data.sensor_id = ($1) AND data.unit_id = ($2) ORDER BY data.time_stamp DESC LIMIT 1';
    try {
        const { rows } = await db.query(getLastValue, [req.query.sensor, req.query.unit])
        res.status(201).send(rows)
    } catch (e) {
        console.log(e.stack)
    }
}
async function deleteObservationsHandler(req, res) {

    var sensor_idArray = req.body.params.join(',')
    var units = req.body.units
    var deleteSensors = 'DELETE FROM observations WHERE sensor_id IN (' + sensor_idArray + ') and unit_id = ($1)';
    units.forEach(async unit => {
        try {
            await db.query(deleteSensors, [unit])
                .catch(e => console.log(e.stack))
        } catch (e) {
            console.log(e.stack)
        }
        res.status(201).send();
    })
}