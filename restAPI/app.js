// ./app.js
const dotenv = require('dotenv')
const express = require('express')
const mountRoutes = require('./routes')
const app = express()
const result = dotenv.config()
if (result.error) {
    throw result.error
}
console.log(result.parsed)
mountRoutes(app)

app.listen(8099, () => console.log('App is listening on port 8099!'))