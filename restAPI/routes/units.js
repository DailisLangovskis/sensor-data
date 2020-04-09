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
router.get('/data', async (req, res) => {
    var queryString = 'SELECT name, id, description FROM units WHERE user_id = ($1) ORDER BY name'
    try {
        const { rows } = await db.query(queryString, [req.user.id])
        res.status(201).send(rows)
    } catch (e){
        console.log(e.stack)
    }
})
router.get('/sensors/:id', async (req, res) => {
    try {
        var queryString = 'SELECT s.sensor_name,s.sensor_id,s.sensor_type FROM sensors as s\
        INNER JOIN sensors_units as su \
        ON s.sensor_id = su.sensor_id where su.unit_id = ($1)'
        const { rows } = await db.query(queryString, [req.params.id])
        res.status(201).send(rows)
    } catch (e){
        console.log(e.stack)
    }
})
router.post('/delete/sensors', [
    check('params').isLength({ min: 1 }).withMessage("There was no sensor selected!")
], deleteSensorsHandler)
async function deleteSensorsHandler(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    var id = req.body.params.join(',');
    var deleteSensors = 'DELETE FROM sensors_units WHERE sensor_id IN ($1) and unit_id = ($2)';
    try {
        await db.query(deleteSensors, [id, req.body.unit])
            .then(_ => {
                res.status(201).send('Sensors deleted');
            })
            .catch(e => console.log(e.stack))
    } catch (e) {
        console.log(e.stack)
    }
}