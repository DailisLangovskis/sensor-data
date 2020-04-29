// ./routes/index.js

const helmet = require('helmet')
const compression = require('compression')
const api = require('./api.v0')
const express = require('express')
const bodyparser = require('body-parser')

const rateLimit = require('express-rate-limit')
// Sets allowed connection ip addreses
const cors = require('cors')({
  origin: function (origin, callback) {
    if (["http://localhost:8082", "http://0.0.0.0:8082", "http://localhost/sensor-data".indexOf(origin) !== -1 || typeof origin == 'undefined']) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
})
// //Limits requests per minute to 100
// const limiter = rateLimit({
//   windowMs: 1 * 60 * 1000,
//   max: 100,
// });
//Access request body as json
const jsonParser = bodyparser.json()
// Implements created functions to API, and adds API routes
module.exports = app => {
  //Request and response can be a JSON object
  app.use(express.json())
  app.all('/api/*', [cors, jsonParser])
  // compress all responses
  app.use(compression())
  //Helmet helps you secure your Express apps by setting various HTTP headers.
  app.use(helmet())
  // app.use(limiter)
  app.use('/api', api)
  app.use((req, res) => {
    res.status(404)
      .send('Unknown Request')
  })
  // etc..
}

