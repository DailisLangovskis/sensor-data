const { Pool } = require('pg')
const pool = new Pool()
module.exports = {
  query: (text, params,error) => pool.query(text, params,error),
}