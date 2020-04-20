//ensures connection to database
const { Pool } = require('pg')
const pool = new Pool()
//exports query function
module.exports = {
  query: (text, params,error) => pool.query(text, params,error),
}