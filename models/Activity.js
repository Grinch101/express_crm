const { makingQuery } = require("../utility/utils");

Activity = new Object();

Activity.presence = async function (activity_id, client) {
  let result = await makingQuery(
    "../sql/activities/presence.sql",
    [activity_id],
    client
  );
  if (result[0].count == 0) {
    return false;
  } else {
    return true;
  }
};

Activity.get_by_id = async function (activity_id, client) {
  return await makingQuery(
    "../sql/activities/get_by_id.sql",
    [activity_id],
    client
  );
};

Activity.get_all = async function (contact_id, client) {
  return await makingQuery(
    "../sql/activities/get_all.sql",
    [contact_id],
    client
  );
};

Activity.add = async function (values, client) {
  let result = await makingQuery("../sql/activities/add.sql", values, client);
  return result.rows;
};

Activity.delete = async function (activity_id, client) {
  return await makingQuery(
    "../sql/activities/delete.sql",
    [activity_id],
    client
  );
};

Activity.update = async function (activity_id, values, client) {
  return await makingQuery(
    "../sql/activities/update.sql",
    [...values, activity_id],
    client
  );
};

module.exports = Activity;
