const Router = require('express-promise-router')
const db = require('../db')
const bodyparser = require('body-parser')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()
// export our router to be mounted by the parent application
module.exports = router
router.use(bodyparser())
let refreshTokens = []
router.post('/', [
    check('username').custom(async (username, res) => {
        return await db.query('SELECT username FROM system_users WHERE username = $1', [username])
            .then(res => {
                if (res.rows == '') {
                    throw new Error("This user does not exist!")
                }
                return true
            })
    }).withMessage("This user does not exist!")
]
    , async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }
        var getUser = 'SELECT  * FROM system_users WHERE (username) = ($1)';
        try {
            const { rows } = await db.query(getUser, [req.body.username])
            try {
                var user = rows[0];
                if (await bcrypt.compare(req.body.password, user.password)) {
                    const accessToken = generateAccessToken(user)
                    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
                    refreshTokens.push(refreshToken)
                    res.json({ accessToken: accessToken, refreshToken: refreshToken, msg: 'Successful login!' })
                }
                else {
                    res.status(404).send({ errors: [{ msg: 'Username or password does not exist!' }] })
                }
            } catch (e) {
                res.status(500).send()
            }
        } catch (e) {
            console.log(e.stack)
        }

    })
router.post('/token', (req, res) => {
    const refreshToken = req.body.refreshToken
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name })
        res.json({ accessToken: accessToken })
    })
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' })
}
router.post('/delete', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.refreshToken)
    res.sendStatus(204)
})
