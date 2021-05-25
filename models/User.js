const { makingQuery } = require("../utility/utils");
const jwt = require("jsonwebtoken");

User = new Object();

User.get_all = async function (client) {
  return await makingQuery("../sql/users/get_all.sql", [], client);
};

User.check_presence_by_email = async function (inputEmail, client) {
  const result = await makingQuery(
    "../sql/users/presence_by_email.sql",
    [inputEmail],
    client
  );
  if (result[0].count == 1) {
    return true;
  } else {
    return false;
  }
};

User.add_user = async function (inputEmail, inputPassword, clientName, client) {
  return await makingQuery(
    "../sql/users/register.sql",
    [inputEmail, inputPassword, clientName],
    client
  );
};

User.get_by_id = async function (user_id, client) {
  return await makingQuery("../sql/users/get_by_id.sql", [user_id], client);
};

User.get_by_email = async function (email, client) {
  return await makingQuery("../sql/users/get_by_email.sql", [email], client);
};

User.token_generate = function (user_id) {
  return jwt.sign(user_id, "aSecureKey!");
};

User.update_user = async function (
  email,
  passkey,
  client_name,
  user_id,
  client
) {
  return await makingQuery(
    "../sql/users/update.sql",
    [email, passkey, client_name, user_id],
    client
  );
};
module.exports = User;
