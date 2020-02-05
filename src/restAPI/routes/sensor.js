const Router = require('express-promise-router')
const db = require('../db')
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()
// export our router to be mounted by the parent application
module.exports = router
router.get('/', async (req, res) => {
  // const params = req.body;
  // const q = 'INSERT INTO sensors(name, type) values($1, $2)'
  // const data = [params.name, params.type]
  // const { rows } = await db.query(q, data);
  res.send('Hello world!');
});