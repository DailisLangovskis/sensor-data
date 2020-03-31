// ./routes/index.js
const helmet = require('helmet');
const compression = require('compression');
const api = require('./api.v0')
const rateLimit = require('express-rate-limit');
const express = require('express');
const users = require('./users');
const jwt = require('jsonwebtoken');
const cors = require('cors')({
  origin: function (origin, callback) {
    if (["http://localhost:8082", "http://0.0.0.0:8082", "http://localhost:8099".indexOf(origin) !== -1 || typeof origin == 'undefined']) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
});
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
});
function authentificateToken(req, res, next) {
  console.log(req.headers)
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[0]
  if (token == null) return res.sendStatus(401)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })

}
module.exports = app => {
  app.use(express.json());
  app.all('/api/*', cors);
  app.use(compression());
  app.use(helmet());
  app.use(limiter);
  app.use('/users', cors, users);
  app.use('/api', authentificateToken, api);


  app.use((req, res) => {
    res.status(404)
      .send('Unknown Request')
  });
  // etc..
}

