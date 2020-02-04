// ./routes/index.js
const users = require('./user')

module.exports = app => {
  app.use('/users', users)

  // etc..
}