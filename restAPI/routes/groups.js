const Router = require('express-promise-router');
const db = require('../db');
const { check, validationResult } = require('express-validator');
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();
// export our router to be mounted by the parent application
module.exports = router
//Get groups from database
router.get('/data', getGroupsHandler)
//Save group to database
router.post('/data', [
    check('name', 'user').custom(async (name, user, res) => {
        return await db.query('SELECT group_id FROM groups WHERE group_name = $1 and user_id = $2', [name, user.req.user.id])
            .then(res => {
                if (res.rows != '') {
                    throw new Error("This group already exists!");
                }
            })
    })
], saveGroupHandler)
//Get selected group units from database
router.get('/units/:id', getGroupUnitsHandler)
//Delete groups from database
router.post('/delete', [
    check('params').isLength({ min: 1 }).withMessage("There was no group selected!")
], deleteGroupsHandler)
//Delete selected group units from database
router.post('/delete/units', [
    check('params').isLength({ min: 1 }).withMessage("There was no unit selected!")
], deleteUnitsHandler)

async function getGroupsHandler(req, res) {
    try {
        const { rows } = await db.query('SELECT group_name, group_id FROM groups where user_id = ($1)', [req.user.id])
        res.status(201).send(rows)
    } catch (e) {
        console.log(e.stack)
    }
}
async function saveGroupHandler(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    var insertGroup = 'INSERT INTO groups (group_name, user_id) VALUES ($1, $2)';
    try {
        await db.query(insertGroup, [req.body.name, req.user.id])
            .then(_ => {
                res.status(201).send('Insert Completed');
            })
            .catch(e => console.log(e.stack))
    } catch (e) {
        console.log(e.stack)
    }
}

async function getGroupUnitsHandler(req, res) {
    try {
        var queryString = 'SELECT u.*, g.group_id FROM units_groups as ug\
        INNER JOIN units as u\
        ON ug.unit_id = u.unit_id \
        INNER JOIN groups as g \
        ON ug.group_id= g.group_id WHERE ug.group_id = ($1)'
        const { rows } = await db.query(queryString, [req.params.id])
        res.status(201).send(rows)
    } catch (e) {
        console.log(e.stack)
    }
}

async function deleteGroupsHandler(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    var id = req.body.params.join(',');
    var deleteGroups = 'DELETE FROM groups WHERE group_id IN (' + id + ')';
    try {
        await db.query(deleteGroups)
            .then(_ => {
                res.status(201).send('Groups deleted');
            })
            .catch(e => console.log(e.stack))
    } catch (e) {
        console.log(e.stack)
    }
}

async function deleteUnitsHandler(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    var id = req.body.params.join(',');
    var deleteUnits = 'DELETE FROM units_groups WHERE unit_id IN (' + id + ') and group_id = ($1)';
    try {
        await db.query(deleteUnits, [req.body.group])
            .then(_ => {
                res.status(201).send('Units deleted');
            })
            .catch(e => console.log(e.stack))
    } catch (e) {
        console.log(e.stack)
    }
}