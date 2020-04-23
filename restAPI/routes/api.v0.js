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
const timeSeries = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100000,
});
//check if User is authentificated using middleware 
var auth_token = auth_middleware.authentificateToken
router.use('/groups', [auth_token], groups)
router.use('/units', [auth_token], units)
router.use('/sensors', [auth_token], sensors)
router.use('/phenomena', [auth_token], phenomena)
router.use('/observation', [auth_token,timeSeries], observation)
router.use('/features', [auth_token], features)
router.use('/registerUser', registerUser)
router.use('/auth', auth)
