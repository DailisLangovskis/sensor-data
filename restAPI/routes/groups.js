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
    try {
        const { rows } = await db.query('SELECT group_name, id FROM groups where system_user_id = ($1)', [req.user.id])
        res.status(201).send(rows)
    } catch (e){
        console.log(e.stack)
    }
})
router.post('/data', async (req, res) => {

    var insertGroup = 'INSERT INTO groups (group_name, system_user_id) VALUES ($1, $2)';
    try {
        await db.query(insertGroup, [req.body.name, req.user.id])
            .then(_ => {
                res.status(201).send('Insert Completed');
            })
            .catch(e => console.log(e.stack))
    } catch (e) {
        console.log(e.stack)
    }
})
router.get('/units/:id', async (req, res) => {
    try {
        var queryString = 'SELECT u.* FROM units as u\
        INNER JOIN units_groups as ug\
        ON u.id = ug.unit_id where ug.group_id = ($1)'
        const { rows } = await db.query(queryString, [req.params.id])
        res.status(201).send(rows)
    } catch (e){
        console.log(e.stack)
    }
})