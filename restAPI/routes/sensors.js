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
router.get('/data', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT sensor_name,sensor_id,sensor_type FROM sensors WHERE user_id = ($1)', [req.user.id])
        res.status(201).send(rows)
    } catch (e) {
        console.log(e.stack)
    }
})
router.get('/phenomena/:id', getPhenomenaDataHandler)

router.post('/delete', [
    check('params').isLength({ min: 1 }).withMessage("There was no sensor selected!")
], deleteSensorsHandler)


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
async function deleteSensorsHandler(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    var id = req.body.params.join(',');
    var deleteSensor = 'DELETE FROM sensors WHERE sensor_id IN (' + id + ')';
    try {
        await db.query(deleteSensor)
            .then(_ => {
                res.status(201).send('Sensors deleted');
            })
            .catch(e => console.log(e.stack))
    } catch (e) {
        console.log(e.stack)
    }
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
router.post('/sensors_units',[
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
], (req, res) => {
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

})