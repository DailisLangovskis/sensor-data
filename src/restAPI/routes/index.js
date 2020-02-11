// ./routes/index.js
const helmet = require('helmet');
const compression = require('compression');
const api = require('./api.v0')
const rateLimit = require('express-rate-limit');
const cors = require('cors')({
  origin: function (origin, callback) {
    if (["https://localhost:8082", "https://localhost:8099".indexOf(origin) !== -1 || typeof origin == 'undefined']) {
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
module.exports = app => {
  app.all('/api/*', cors)
  app.use(compression());
  app.use(helmet());
  app.use(limiter);
  app.use('/api', api)

  app.use((req, res) => {
    res.status(404)
      .send('Unknown Request')
  })
  // etc..
}

