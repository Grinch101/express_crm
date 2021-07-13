const { jsonify } = require("../utility/utils");

const httpError = async function (err, req, res, next) {
  const client = req.client;
  if (err) {
    if (process.env.NODE_ENV === "PRO") {
      await client.query("ROLLBACK");
    }
  }
  jsonify("ERROR", null, err.message, 500, res, client);
  next(err);
};

module.exports = httpError;
