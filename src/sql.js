const { Pool, Client } = require('pg')

const config = require('../config')

const pool = new Pool({
  user: config.postgres.user,
  host: config.postgres.host,
  database: config.postgres.database,
  password: config.postgres.password,
  port: config.postgres.port,
})

exports.testSelect = async () => {
  const client = await pool.connect()
  const res = await client.query('SELECT NOW()')
  console.log('RES.rows', res)
  return res.rows
}
