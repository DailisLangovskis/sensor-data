const Router = require('express-promise-router')
const db = require('../db')
const bodyparser = require('body-parser')
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator')
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()
// export our router to be mounted by the parent application
module.exports = router
router.use(bodyparser())
//check data to be valid
router.post('/', [
    check('name').isLength({ min: 1, max: 20 })
        .withMessage('Name must be at less 20 chars long'),

    check('lastname').isLength({ min: 1, max: 30 })
        .withMessage('Lastname be at less 30 chars long'),

    check('email').custom(async (email, res) => {
        return await db.query('SELECT email FROM system_users WHERE email = $1', [email])
            .then(res => {
                if (res.rows != '') {
                    throw new Error("This email has been already registered!")
                }
                return true
            })
    }).withMessage("This email has been already registered!"),

    check('username').custom(async (username, res) => {
        return await db.query('SELECT username FROM system_users WHERE username = $1', [username])
            .then(res => {
                if (res.rows != '') {
                    throw new Error("This username is taken!")
                }
                return true
            })
    }).withMessage("This username is taken!"),

    check('username').isLength({ min: 3, max: 30 })
        .withMessage('Username must be at atleast 3 chars or less than 30'),

        check('email').isEmail().withMessage('Email address is not correct!'),

    check('password').isLength({ min: 6, max: 30 })
        .withMessage('Password must be at least 6 chars long'),
], registerUserHandler)

async function registerUserHandler(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    var insertNewUser = 'INSERT INTO system_users(name, lastname, email, username, password) VALUES ($1,$2,$3,$4,$5)';
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        await db.query(insertNewUser, [req.body.name, req.body.lastname, req.body.email, req.body.username, hashedPassword])
            .then(_ => {
                res.status(201).send('New user created!')
            })
            .catch(e => console.log(e.stack))
    } catch (e) {
        console.log(e.stack)
    }
}

