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
router.get('/data', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT sensor_name FROM sensors')
        res.send(rows)
    } catch (e) {
        console.log(e.stack)
    }
})
function addSensorDataHandler(req, res) {
    var insertSensor = 'INSERT INTO sensors(sensor_name, sensor_type) VALUES ($1,$2)';
    var insertPhenomenon = 'INSERT INTO phenomenons(phenomenon_name, unit) VALUES ($1,$2)';
    try {
        db.query(insertSensor, [req.body.name, req.body.type])
            .then(db.query(insertPhenomenon, [req.body.phenomenon.phenomenon, req.body.phenomenon.unit]))
            .then(res.send('Insert completed!'))
            .catch(e => console.log(e.stack))
    } catch (e) {
        console.log(e.stack);
    }
}