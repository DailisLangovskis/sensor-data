const Router = require('express-promise-router')
const sensor = require('./sensor')
const phenomena = require('./phenomena')
const refSys = require('./ref-sys')
const rateLimit = require('express-rate-limit');
const observation = require('./observation');
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()
// export our router to be mounted by the parent application
module.exports = router
const postLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
});
const timeSeries = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 1000,
});
router.get('/', (req, res) => {
    res.send('Nothing here');
});
router.use('/sensor', postLimiter, sensor);
router.use('/phenomena', postLimiter, phenomena);
router.use('/ref-sys', postLimiter, refSys);
router.use('/observation', timeSeries, observation);
