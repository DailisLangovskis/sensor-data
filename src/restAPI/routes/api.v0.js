const Router = require('express-promise-router')
const db = require('../db')
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()
// export our router to be mounted by the parent application
module.exports = router
router.get('/', (req, res) => {
    res.send('Nothing here');
});
router.post('/sensor', sensorDataHandler)

function sensorDataHandler(req, res) {
    var sensorName = req.sensorName;
    var sensorType = req.sensorType;
    var measuredPhe = req.measuredPhe;
    var measuringUnit = req.measuringUnit;
    db.query('INSERT INTO sensors(sensor_name, sensor_type)', [sensorName, sensorType], (err, res) => { console.log(err, res); db.end() });
    db.query('INSERT INTO phenomenons(phenomenon_name, unit)', [measuredPhe, measuringUnit], (err, res) => { console.log(err, res); db.end() });
    res.send('Insert completed!');

}
