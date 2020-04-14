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
        const { rows } = await db.query('SELECT phenomenon_name,unit,id FROM phenomenons')
        res.status(201).send(rows)
    } catch (e) {
        console.log(e.stack)
    }
})
router.post('/new', [
    check('name').custom(async function (name) {
        return await db.query('SELECT phenomenon_name FROM phenomenons WHERE phenomenon_name = $1', [name])
            .then(res => {
                if (res.rows != '') {
                    throw new Error("This phenomenon already exists!");
                }
            })

    })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        await db.query('INSERT INTO phenomenons (phenomenon_name,unit) VALUES ($1, $2)', [req.body.name, req.body.unit])
        res.status(201).send("Insert completed!")
    } catch (e) {
        console.log(e.stack)
    }
})