// ./routes/index.js
const helmet = require('helmet')
const compression = require('compression')
const api = require('./api.v0')
const express = require('express')
const login = require('./login')
const rateLimit = require('express-rate-limit')
const registerUser = require('./registerUser')
const auth_middleware = require('./auth_middleware')
const cors = require('cors')({
  origin: function (origin, callback) {
    if (["http://localhost:8082", "http://0.0.0.0:8082", "http://localhost:8099".indexOf(origin) !== -1 || typeof origin == 'undefined']) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
})
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
});
var auth_token = auth_middleware.authentificateToken
module.exports = app => {
  app.use(express.json())
  app.all('/api/*',cors)
  app.use(compression())
  app.use(helmet())
  app.use(limiter)
  app.use('/registerUser',cors, registerUser)
  app.use('/login', cors, login)
  app.use('/api', auth_token, api)


  app.use((req, res) => {
    res.status(404)
      .send('Unknown Request')
  })
  // etc..
}

