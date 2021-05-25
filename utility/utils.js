const fs = require("fs");
const Path = require("path");

const JsonResponse = {
  error: null,
  data: null,
  info: null,
  code: 200,
};

function jsonify(error, data, info, code, res, client) {
  let jr = JsonResponse;
  jr.error = error;
  jr.data = data;
  jr.info = info;
  jr.code = code;
  res.status(code).send(jr);
  res.end();
  client.release();
}

function find_query_text(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(Path.resolve(__dirname, path), "utf8", (err, data) => {
      if (err) {
        reject(err);
      }
      if (data) {
        resolve(data);
      }
    });
  });
}

function makingQuery(path, values, C) {
  return new Promise(async (res, rej) => {
    client = await C;
    query_text = await find_query_text(path);
    query_result = await client.query(query_text, values);
    res(query_result.rows);
  });
}

module.exports = {
  jsonify: jsonify,
  JsonResponse: JsonResponse,
  makingQuery: makingQuery,
};

