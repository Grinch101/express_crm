const { makingQuery } = require("../utility/utils");

Contact = new Object();

Contact.get_all = async function (user_id, client) {
  return await makingQuery("../sql/contacts/get_all.sql", [user_id], client);
};

Contact.get_by_row_id = async function (id, client) {
  return await makingQuery("../sql/contacts/get_by_id.sql", [id], client);
};

Contact.add_contact = async function (
  user_id,
  firstname,
  lastname,
  email,
  phonenumber,
  client
) {
  return await makingQuery(
    "../sql/contacts/add_contact.sql",
    [user_id, firstname, lastname, email, phonenumber],
    client
  );
};

Contact.presence = async function (contact_id, client) {
  let result = await makingQuery(
    "../sql/contacts/presence.sql",
    [contact_id],
    client
  );
  if (result[0].count == 0) {
    return false;
  } else if (result[0].count == 1) {
    return true;
  }
};

Contact.update = async function (contact_id, pack, client) {
  let { firstname, lastname, email, phonenumber } = pack;
  return await makingQuery(
    "../sql/contacts/update.sql",
    [firstname, lastname, email, phonenumber, contact_id],
    client
  );
};

Contact.delete = async function (contact_id, client) {
  return await makingQuery("../sql/contacts/delete.sql", [contact_id], client);
};

module.exports = Contact;
