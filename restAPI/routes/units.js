const Router = require('express-promise-router')
const db = require('../db')
const { check, validationResult } = require('express-validator')
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()
// export our router to be mounted by the parent application
module.exports = router
//Get all units
router.get('/data/:id', getAllUsableUnitsHandler)
//Get all units sensors
router.get('/sensors/:id', showUnitSensorsHandler)
//Delete all selected units sensors
router.post('/delete/sensors', [
    check('params').isLength({ min: 1 }).withMessage("There was no sensor selected!")
], deleteSensorsHandler)
//Add selected units to specific group
router.post('/units_groups', [
    check('params.*', 'group').custom(async function (unit, group, res) {
        return await db.query('SELECT ug.id, u.name FROM units_groups as ug\
        INNER JOIN units as u\
        ON ug.unit_id = u.unit_id\
        WHERE ug.unit_id = $1 and ug.group_id = $2', [unit, group.req.body.group])
            .then(res => {
                if (res.rows != '') {
                    var units = res.rows.map(u => u.name)
                    throw new Error(units + " already exist in this group!")
                }
            })

    }),
    check('params').isLength({ min: 1 }).withMessage("There was no unit selected!")
], saveAddedUnitsHandler)
//Save new unit
router.post('/new', [
    check('name', 'user').custom(async (name, user, res) => {
        return await db.query('SELECT unit_id FROM units WHERE name = $1 and user_id = $2', [name, user.req.user.id])
            .then(res => {
                if (res.rows != '') {
                    throw new Error("This unit already exists!")
                }
            })
    }),
    check('time').exists(),
    check('location').exists()
], saveUnitHandler)

async function getAllUsableUnitsHandler(req, res) {
    var id = req.params.id;
    var queryString = 'SELECT * FROM units WHERE user_id = ($1)\
    EXCEPT \
    SELECT u.* FROM units_groups as ug\
        INNER JOIN units as u\
        ON ug.unit_id = u.unit_id \
        INNER JOIN groups as g \
        ON ug.group_id= g.group_id WHERE ug.group_id = ($2)';
    try {
        const { rows } = await db.query(queryString, [req.user.id, id])
        res.status(201).send(rows)
    } catch (e) {
        console.log(e.stack)
    }
}

async function showUnitSensorsHandler(req, res) {
    try {
        var queryString = 'SELECT s.sensor_name,s.sensor_id,s.sensor_type, u.unit_id FROM sensors_units as su\
        INNER JOIN sensors as s\
        ON su.sensor_id = s.sensor_id \
        INNER JOIN units as u\
        ON su.unit_id = u.unit_id where su.unit_id = ($1)'
        const { rows } = await db.query(queryString, [req.params.id])
        res.status(201).send(rows)
    } catch (e) {
        console.log(e.stack)
    }
}

async function deleteSensorsHandler(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    var id = req.body.params.join(',')
    var deleteSensors = 'DELETE FROM sensors_units WHERE sensor_id IN (' + id + ') and unit_id = ($1)';
    try {
        await db.query(deleteSensors, [req.body.unit])
            .then(_ => {
                res.status(201).send('Sensors deleted')
            })
            .catch(e => console.log(e.stack))
    } catch (e) {
        console.log(e.stack)
    }
}

function saveAddedUnitsHandler(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    var units = req.body.params
    var insertUnits = 'INSERT INTO units_groups (unit_id, group_id) VALUES ($1, $2)';
    units.forEach(async unit => {
        try {
            await db.query(insertUnits, [unit, req.body.group])
                .catch(e => console.log(e.stack))
        } catch (e) {
            console.log(e.stack)
        }
    })
    res.status(201).send("Insert completed!")

}

async function saveUnitHandler(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    var coords = req.body.location
    var addUnit = 'INSERT INTO units (name, description, user_id) VALUES ($1, $2, $3)';
    var addUnitsPos = 'INSERT INTO units_positions (unit_id, unit_name, time_stamp, longitude, latitude, user_name) VALUES ($1, $2, $3, $4, $5, $6)';
    var addToGroup = 'INSERT INTO units_groups (unit_id, group_id) VALUES ($1,$2)';
    try {
        await db.query(addUnit, [req.body.name, req.body.description, req.user.id])
            .then(async _ => {
                await db.query('SELECT unit_id, name FROM units WHERE name = ($1) and user_id = ($2)', [req.body.name, req.user.id])
                    .then(async function (res) {
                        await db.query(addToGroup, [res.rows[0].unit_id, req.body.group])
                        return res
                    })
                    .then(async function (res) {
                        await db.query(addUnitsPos, [res.rows[0].unit_id, res.rows[0].name, req.body.time, coords[0], coords[1], req.user.username])
                    })
                    .then(_ => {
                        res.status(201).send("Insert completed!")
                    })
                    .catch(e => console.log(e.stack))
            })
            .catch(e => console.log(e.stack))
    } catch (e) {
        console.log(e.stack)
    }

}