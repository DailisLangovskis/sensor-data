// ./app.js
const dotenv = require('dotenv')
const express = require('express')
const mountRoutes = require('./routes')
const app = express()
//get environment variables
const result = dotenv.config()
if (result.error) {
    throw result.error
}
mountRoutes(app)

app.listen(3000, () => console.log('App is listening on port 3000!'))