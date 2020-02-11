const Router = require('express-promise-router')
const sensor = require('./sensor')
const rateLimit = require('express-rate-limit');
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
router.get('/', (req, res) => {
    res.send('Nothing here');
});
router.use('/sensor', postLimiter, sensor);
