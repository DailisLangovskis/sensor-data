const Router = require('express-promise-router');
const db = require('../db');
const { check, validationResult } = require('express-validator');
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();
// export our router to be mounted by the parent application
module.exports = router
//Save a new sensor to database 
router.post('/data', [
    check('name').isLength({ min: 1, max: 20 })
        .withMessage('Must be at less 20 chars long'),
    check('name', 'user').custom(async (name, user, res) => {
        return await db.query('SELECT sensor_id FROM sensors WHERE sensor_name = $1 and user_id = $2', [name, user.req.user.id])
            .then(res => {
                if (res.rows != '') {
                    throw new Error("This sensor already exists!");
                }
            })
    }),
    check('type').isLength({ min: 1, max: 20 })
        .withMessage('Sensor type be at less 20 chars long'),
    check('phenomenaId').isNumeric().withMessage("Given phenomena id is not a numeric value!"),
], addSensorDataHandler)
router.get('/data/:id', getAllUsableSensorsHandler)
//get All user sensors
router.get('/activeSensors', getAllActiveSensorsHandler)
//Get sensors phenomena
router.get('/phenomena/:id', getPhenomenaDataHandler)
//Save sensors inside selected unit
router.post('/sensors_units', [
    check('params.*', 'unit').custom(async function (sensor, unit, res) {
        return await db.query('SELECT su.id, s.sensor_name FROM sensors_units as su\
        INNER JOIN sensors as s\
        ON su.sensor_id = s.sensor_id\
        WHERE su.sensor_id = $1 and su.unit_id = $2', [sensor, unit.req.body.unit])
            .then(res => {
                if (res.rows != '') {
                    var sensors = res.rows.map(s => s.sensor_name)

                    throw new Error(sensors + " already exist in this unit!");
                }
            })

    }),
    check('params').isLength({ min: 1 }).withMessage("There was no sensor selected!")
], saveAddedSensorsHandler)

//Delete active sensors
router.post('/delete', [
    check('params').isLength({ min: 1 }).withMessage("There was no sensor selected!")
], deleteActiveSensorsHandler)

async function addSensorDataHandler(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    var insertSensor = 'INSERT INTO sensors(sensor_name, sensor_type,phenomena_id, user_id) VALUES ($1,$2,$3,$4)';
    var addToUnit = 'INSERT INTO sensors_units (sensor_id, unit_id) VALUES ($1,$2)';
    try {
        await db.query(insertSensor, [req.body.name, req.body.type, req.body.phenomenaId, req.user.id])
            .then(async _ => {
                await db.query('SELECT sensor_id FROM sensors WHERE sensor_name = ($1) and user_id = ($2)', [req.body.name, req.user.id])
                    .then(async function (res) {
                        await db.query(addToUnit, [res.rows[0].sensor_id, req.body.unit])
                    })
                    .catch(e => console.log(e.stack))
            })
            .catch(e => console.log(e.stack))
    } catch (e) {
        console.log(e.stack)
    }
    res.status(201).send("Insert completed!")
}
async function getAllActiveSensorsHandler(req, res) {
    try {
        const { rows } = await db.query('SELECT s.sensor_name,s.sensor_id, u.unit_id, u.name FROM sensors_units as su\
        INNER JOIN sensors as s\
        ON su.sensor_id = s.sensor_id \
        INNER JOIN units as u\
        ON su.unit_id = u.unit_id WHERE u.user_id = ($1)', [req.user.id])
        res.status(201).send(rows)
    } catch (e) {
        console.log(e.stack)
    }
}
async function getAllUsableSensorsHandler(req, res) {
    var id = req.params.id;
    try {
        const { rows } = await db.query('SELECT sensor_name,sensor_id,sensor_type FROM sensors WHERE user_id = ($1) \
        EXCEPT \
        SELECT s.sensor_name,s.sensor_id,s.sensor_type FROM sensors_units as su\
        INNER JOIN sensors as s\
        ON su.sensor_id = s.sensor_id \
        INNER JOIN units as u\
        ON su.unit_id = u.unit_id where su.unit_id = ($2)', [req.user.id, id])
        res.status(201).send(rows)
    } catch (e) {
        console.log(e.stack)
    }
}
async function deleteActiveSensorsHandler(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    var id = req.body.params.join(',')
    var units = req.body.units
    var deleteActiveSensors = 'DELETE FROM sensors_units WHERE sensor_id IN (' + id + ') and unit_id = ($1)';
    units.forEach(async unit => {
        try {
            await db.query(deleteActiveSensors, [unit])
                .catch(e => console.log(e.stack))
        } catch (e) {
            console.log(e.stack)
        }
        res.status(201).send();
    })
}
async function getPhenomenaDataHandler(req, res) {
    var id = req.params.id;
    var selectPhenomena = 'Select phenomenons.phenomenon_name,\
     phenomenons.unit, phenomenons.id  FROM sensors \
     INNER JOIN phenomenons ON sensors.phenomena_id = phenomenons.id \
      WHERE sensor_id = $1';
    try {
        const { rows } = await db.query(selectPhenomena, [id])
        res.status(201).send(rows);
    } catch (e) {
        console.log(e.stack)
    }
}
function saveAddedSensorsHandler(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    var sensors = req.body.params
    var insertSensors = 'INSERT INTO sensors_units (sensor_id, unit_id) VALUES ($1, $2)';
    sensors.forEach(async sensor => {
        try {
            await db.query(insertSensors, [sensor, req.body.unit])
                .catch(e => console.log(e.stack))
        } catch (e) {
            console.log(e.stack)
        }
    })
    res.status(201).send("Insert completed!")
}