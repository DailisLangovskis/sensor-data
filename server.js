const express = require('express')
const dotenv = require('dotenv')
const app = express();
const result = dotenv.config()
if (result.error) {
    throw result.error
}
app.use(express.static(__dirname + '/static/index.html'))

app.listen(process.env.HTTP_PORT, () => console.log(`API listening on port ${process.env.HTTP_PORT}!`))