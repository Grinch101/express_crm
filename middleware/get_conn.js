const { Pool } = require("pg");

const pool = new Pool({
  user: "grinch",
  host: "localhost",
  database: "express_crm",
  port: 5432,
  password: "1",
});

async function get_client(req, res, next) {
  const client = await pool.connect();
  req.client = client;
  next();
}

module.exports = get_client;
