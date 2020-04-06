const Router = require('express-promise-router')
const sensors = require('./sensors')
const groups = require('./groups')
const units = require('./units')
const phenomena = require('./phenomena')
const rateLimit = require('express-rate-limit')
const observation = require('./observation')
const features = require('./features')
const auth = require('./auth')
const registerUser = require('./registerUser')
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()
// export our router to be mounted by the parent application
const auth_middleware = require('./auth_middleware')
module.exports = router
const postLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
});
const timeSeries = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 1000,
});

var auth_token = auth_middleware.authentificateToken
router.use('/groups', [auth_token,postLimiter], groups)
router.use('/units', [auth_token,postLimiter], units)
router.use('/sensors', [auth_token,postLimiter], sensors)
router.use('/phenomena', [auth_token,postLimiter], phenomena)
router.use('/observation', [auth_token,postLimiter], observation)
router.use('/features', [auth_token,postLimiter], features)
router.use('/registerUser', registerUser)
router.use('/auth', auth)
