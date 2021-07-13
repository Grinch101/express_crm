const { Pool } = require("pg");
require('dotenv/config')


const get_pool = function () {
  if (process.env.NODE_ENV === "DEV") {
    const pool = new Pool({
      user: "grinch",
      host: "localhost",
      database: "express_crm_test",
      port: 5432,
      password: "1",
    });
    console.log(process.env.NODE_ENV)
    return pool;
  }

  if (process.env.NODE_ENV === "PRO") {
    const pool = new Pool({
      user: "grinch",
      host: "localhost",
      database: "express_crm",
      port: 5432,
      password: "1",
    });
    console.log(process.env.NODE_ENV)
    return pool;
  }
};

async function get_client(req, res, next) {
  const pool = get_pool();
  const client = await pool.connect();
  await client.query('BEGIN')
  console.log('transcation begin')
  req.client = client;
  next();
}

module.exports = get_client;