const { response, json } = require("express");
const express = require("express");
const user_router = express.Router();
const User = require("../models/User");
const { jsonify } = require("../utility/utils");
const login_required = require("../middleware/authentication");

// user_router.get("/", async function (req, res) {
//   const client = req.client;
//   const result = await User.get_all(client);
//   jsonify(null, result, "All Contacts Retrived", 200, res, client);
//   });

user_router.post("/signup", async function (req, res) {
  const { client } = req;
  const { inputEmail, inputPassword, clientName } = req.body;
  var q = await User.check_presence_by_email(inputEmail, client);
  if (q) {
    jsonify("ERROR", null, "EMAIL IN USE", 406, res, client);
  } else {
    q = await User.add_user(inputEmail, inputPassword, clientName, client);
    const id = result[0].id;
    jsonify(null, id, "User Added", 201, res, client);
  }
});

user_router.get("/current_user",
 login_required,
  async function (req, res) {
    const { client, user_id } = req; // user_id is set by login_required
    const result = await User.get_by_id(user_id, client);
    jsonify(null, result, "CONTACT RETRIVED", 200, res, client);
});

user_router.post("/login", async function (req, res) {
  const { client } = req;
  const { inputEmail, inputPassword } = req.body;
  var q = await User.check_presence_by_email(inputEmail, client);
  if (q) {
    q = await User.get_by_email(inputEmail, client); //the saved passkey
    const { passkey, id } = q[0];
    if (passkey == inputPassword) {
      const JWT = User.token_generate(id);
      jsonify(null, JWT, "LOGIN SUCCESSFUL, TOKEN GENERATED", 200, res, client);
    } else {
      jsonify("ERROR", null, "PASSWORD INCORRECT", 401, res, client);
    }
  } else {
    jsonify("ERROR", null, "EMAIL INVALID", 400, res, client);
  }
});

user_router.put("/update_user", login_required, async function (req, res) {
  const { client, user_id } = req;
  var { inputEmail, inputPassword, clientName } = req.body;
  const q = await User.get_by_id(user_id, client);
  const { email, passkey, client_name } = q[0];

  new_data = [inputEmail, inputPassword, clientName];
  if (
    !new_data.every((val) => {
      val != undefined;
    })
  ) {
    if (inputEmail == undefined) {
      inputEmail = email;
    }
    if (inputPassword == undefined) {
      inputPassword = passkey;
    }
    if (clientName == undefined) {
      clientName = client_name;
    }
  }
  const q2 = await User.update_user(
    inputEmail,
    inputPassword,
    clientName,
    user_id,
    client
  );
  jsonify(null, q2[0], "UPDATED", 200, res, client);
});

module.exports = user_router;
