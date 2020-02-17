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
router.post('/data', addSensorDataHandler)
router.delete('/delete', deleteSensorsHandler)
router.get('/data', async (req, res) => {
    try {
        console.log('Get list');
        const { rows } = await db.query('SELECT sensor_name,sensor_id FROM sensors')
        res.send(rows)
    } catch (e) {
        console.log(e.stack)
    }
})
function addSensorDataHandler(req, res) {
    var insertSensor = 'INSERT INTO sensors(sensor_name, sensor_type) VALUES ($1,$2)';
    try {
        db.query(insertSensor, [req.body.name, req.body.type])
            .then(_ => {
                res.send('Insert completed!');
            })
            .catch(e => console.log(e.stack))
    } catch (e) {
        console.log(e.stack);
    }
}
function deleteSensorsHandler(req, res) {
    console.log(req.body);
    // var deleteSensor = 'DELETE FROM sensors WHERE sensor_id IN (SELECT sensor_id FROM )';
    // try {
    //     db.query(deleteSensor, [req.body])
    //         .then(_ => {
    //             res.send('Delete completed!');
    //         })
    //         .catch(e => console.log(e.stack))
    // } catch (e) {
    //     console.log(e.stack);
    // }
}