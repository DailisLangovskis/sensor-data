// ./routes/index.js
const api = require('./api.v0')

module.exports = app => {
  app.use('/api', api)

  app.use((req, res) => {
    res.status(404)
      .send('Unknown Request')
  })
  // etc..
}

