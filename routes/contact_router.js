const express = require("express");
const contact_router = express.Router();
const Contact = require("../models/Contact");
const { jsonify } = require("../utility/utils");
const login_required = require("../middleware/authentication");

contact_router.get("/all", login_required, async function (req, res, next) {
  const { client, user_id } = req;
  try {
    const result = await Contact.get_all(user_id, client);
    jsonify(
      null,
      result,
      `ALL CONTACTS BELONG TO USER ID:${user_id} RETRIVED`,
      200,
      res,
      client
    );
  } catch (err) {
    next(err);
  }
});

contact_router.post("/", login_required, async function (req, res, next) {
  const { client, user_id } = req;
  try{
    const result = await Contact.add_contact(
      user_id,
      req.body.firstname,
      req.body.lastname,
      req.body.email,
      req.body.phonenumber,
      client
    );
    jsonify(null, result, "CONTACT ADDED", 201, res, client);
  } catch (err) {
    next(err);
  }
});

contact_router.delete(
  "/delete/:id",
  login_required,
  async function (req, res, next) {
    const { client } = req;
    const contact_id = req.params.id;
    try {
      let q0 = await Contact.presence(contact_id, client);
      if (q0) {
        let q1 = await Contact.delete(contact_id, client);
        let q2 = await Contact.presence(contact_id, client);
        if (!q2) {
          jsonify(
            null,
            { contact_id: contact_id },
            "CONTACT DELETED",
            200,
            res,
            client
          );
        } else {
          throw new Error("FAILED TO DELETE");
        }
      } else {
        jsonify("ERROR", null, "CONTACT WAS NOT FOUND", 404, res, client);
      }
    } catch (err) {
      next(err);
    }
  }
);

contact_router.put(
  "/update/:id",
  login_required,
  async function (req, res, next) {
    const { client } = req;
    const contact_id = req.params.id;
    try {
      let q0 = await Contact.presence(contact_id, client);
      if (q0) {
        q1 = await Contact.update(contact_id, req.body, client);
        jsonify(null, q1, "UPDATED", 200, res, client);
      } else {
        jsonify("ERROR", null, "CONTACT WAS NOT FOUND", 404, res, client);
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = contact_router;
