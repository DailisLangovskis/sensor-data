const { Pool } = require('pg')
const pool = new Pool()
console.log(process.env);
module.exports = {
  query: (text, params) => pool.query(text, params),
}