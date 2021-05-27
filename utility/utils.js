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
    try {
      query_text = await find_query_text(path);
      query_result = await client.query(query_text, values);
      // {
      //   // this block convert hstore to json for better user experience

      //   let { phonenumber } = query_result.rows[0];
      //   if (phonenumber) {
      //     for (let i = 0; i < query_result.rows.length; i++) {
      //       query_result.rows[i].email = hstore.parse(
      //         query_result.rows[i].email
      //       );
      //       query_result.rows[i].phonenumber = hstore.parse(
      //         query_result.rows[i].phonenumber,
      //         {
      //           numeric_check: true,
      //         }
      //       );
      //     }
      //   }
      // }
      res(query_result.rows);
    } catch (err) {
      // console.log(err);
      rej(err);
    }
  });
}

module.exports = {
  jsonify: jsonify,
  JsonResponse: JsonResponse,
  makingQuery: makingQuery,
};
