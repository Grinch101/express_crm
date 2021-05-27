const { jsonify } = require("../utility/utils");

const httpError = function (err, req, res, next) {
  const client = req.client;
  if (err) {
    console.log(err)
    jsonify("ERROR", null, err.message, 500, res, client);
    next(err);
  }
};

module.exports = httpError;
