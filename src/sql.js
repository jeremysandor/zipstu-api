const { Pool, Client } = require('pg')

const pgConfig = require('../config').postgres

const pool = new Pool(pgConfig)

// the pool with emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

exports.testSelect = async () => {
  const client = await pool.connect()
  const res = await client.query('SELECT NOW()')
  client.release()
  return res.rows
}

/**
* Creates a provider
* @param {postgres.connection} dbConnection 
* @param {string} customerId 
* @param {object} data
*/
exports.createProvider = async (customerId, data) => {
  const client = await pool.connect()
  const sql = 'INSERT INTO providers(customer_id, data) VALUES($1, $2) RETURNING *'
  const values = [customerId, data]
  const res = await client.query(sql, values)
  client.release()
  return res.rows
}
