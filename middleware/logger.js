const _ = require("lodash");
const { Pool } = require("pg");
const hstore = require("node-postgres-hstore");

const pool = new Pool({
  user: "grinch",
  host: "localhost",
  database: "express_crm",
  port: 5432,
  password: "1",
});

async function saveLog() {
  client = await pool.connect();
  for (let R of logArr) {
    await client.query(
      'INSERT INTO logs(log, url, "user", date, time) VALUES($1, $2, $3, $4, $5)',
      Array.prototype.concat.apply(R, [new Date().getTime()])
    );
  }
  logArr = [];
}

const throttleSaveLog = _.throttle(saveLog, 15000);
let logArr = [];

async function logger(req, res, next) {
  let { user_id } = { req };
  logArr.push([
    hstore.stringify(req.body),
    req.originalUrl,
    user_id,
    new Date(),
  ]);
  throttleSaveLog();
  next();
}

module.exports = logger;
