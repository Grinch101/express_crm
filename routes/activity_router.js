const express = require("express");
const activity_router = express.Router();
const Activity = require("../models/Activity");
const Contact = require("../models/Contact");
const { jsonify } = require("../utility/utils");
const login_required = require("../middleware/authentication");

activity_router.get(
  "/:contact_id",
  login_required,
  async function (req, res, next) {
    let { client } = req;
    try {
      let { contact_id } = req.params;
      let q0 = await Contact.presence(contact_id, client);
      if (!q0) {
        return jsonify(
          "ERROR",
          null,
          "CONTACT WAS NOT FOUND",
          404,
          res,
          client
        );
      }
      let q1 = await Activity.get_all(contact_id, client);
      if (q1 === []) {
        return jsonify(null, null, "NO ACTIVITIES FOUND", 404, res, client);
      } else {
        return jsonify(null, q1, "ACTIVITIES RETRIVED", 200, res, client);
      }
    } catch (err) {
      next(err);
    }
  }
);

activity_router.post(
  "/:contact_id",
  login_required,
  async function (req, res, next) {
    let { client, user_id } = req;
    try {
      let { contact_id } = req.params;
      let pack = req.body;
      let data = [pack.action, pack.description, pack.date, pack.time];
      if (
        data.every((v) => {
          return v === undefined;
        }) ||
        !data.every((v) => {
          return v !== undefined;
        })
      ) {
        return jsonify("ERROR", null, "INCOMPLETE INPUTS", 400, res, client);
      }
      pack.contact_id = contact_id;
      pack.user_id = user_id;
      let values = Object.values(pack);
      let q1 = await Activity.add(values, client);
      return jsonify(null, q1, "ACTIVITY ADDED", 201, res, client);
    } catch (err) {
      next(err);
    }
  }
);

activity_router.delete(
  "/:contact_id/delete/:activity_id",
  login_required,
  async function (req, res, next) {
    try {
      let { client, user_id } = req;
      let { contact_id, activity_id } = req.params;
      let q0 = await Contact.presence(contact_id, client);
      if (q0) {
        let q1 = await Activity.presence(activity_id, client);
        if (q1) {
          let q2 = await Activity.delete(activity_id, client);
          let q3 = await Activity.presence(activity_id, client);
          if (!q3) {
            return jsonify(null, q2, "CONTACT DELETED", 200, res, client);
          } else {
            throw new Error("DELETION IS NOT CONFIRMED");
          }
        } else {
          return jsonify("ERROR", null, "ACTIVITY NOT FOUND", 404, res, client);
        }
      } else {
        return jsonify(
          "ERROR",
          null,
          "CONTACT WAS NOT FOUND",
          404,
          res,
          client
        );
      }
    } catch (err) {
      next(err);
    }
  }
);

activity_router.put(
  "/:contact_id/update/:activity_id",
  login_required,
  async function (req, res, next) {
    try {
      let { client, user_id } = req;
      let { contact_id, activity_id } = req.params;
      let q0 = await Contact.presence(contact_id, client);
      if (q0) {
        let q1 = await Activity.presence(activity_id, client);
        if (q1) {
          let { action, description, date, time } = req.body;
          if (
            ![action, description, date, time].every((val) => {
              val != undefined;
            })
          ) {
            let old_data = await Activity.get_by_id(activity_id, client);
            if (action == undefined) {
              action = old_data[0].action;
            }
            if (description == undefined) {
              description = old_data[0].description;
            }
            if (date == undefined) {
              date = old_data[0].date;
            }
            if (time == undefined) {
              time = old_data[0].time;
            }
          }
          let values = [action, description, date, time];
          q2 = await Activity.update(activity_id, values, client);
          return jsonify(null, q2, "UPDATED", 200, res, client);
        } else {
          return jsonify("ERROR", null, "ACTIVITY NOT FOUND", 404, res, client);
        }
      } else {
        return jsonify("ERROR", null, "CONTACT NOT FOUND", 404, res, client);
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = activity_router;
