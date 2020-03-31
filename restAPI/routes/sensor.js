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
    check('name').custom(async (name, res) => {
        return await db.query('SELECT sensor_id FROM sensors WHERE sensor_name = $1', [name])
            .then(res => {
                if (res.rows != '') {
                    throw new Error("This sensor already exists!");
                }
                return true;
            })
    }).withMessage("This sensor already exists!"),
    check('type').isLength({ min: 1, max: 20 })
        .withMessage('Must be at less 20 chars long'),
    check('phenomenaId').isNumeric().withMessage("This is not a numeric value!"),
], addSensorDataHandler)

router.get('/phenomena/:id', getPhenomenaDataHandler)

router.post('/delete', [
    check('params').isLength({ min: 1 }).withMessage("There was no sensor selected!")
], deleteSensorsHandler)

router.get('/data', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT sensor_name,sensor_id,sensor_type FROM sensors')
        res.status(201).send(rows)
    } catch (e){
        console.log(e.stack)
    }
})
async function addSensorDataHandler(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    var insertSensor = 'INSERT INTO sensors(sensor_name, sensor_type,phenomena_id) VALUES ($1,$2,$3)';
    try {
        await db.query(insertSensor, [req.body.name, req.body.type, req.body.phenomenaId])
            .then(_ => {
                res.status(201).send('Insert Completed');
            })
            .catch(e => console.log(e.stack))
    } catch (e) {
        console.log(e.stack)
    }
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