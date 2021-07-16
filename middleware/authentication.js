const jwt = require("jsonwebtoken");

login_required = function (req, res, next) {
  const token = req.headers.token;
  try {
    const user_id = jwt.verify(token, "aSecureKey!");
    req.user_id = user_id;
    next();
  } catch (e) {
    return res.status(401).send("TOKEN INVALID");
  }
};

module.exports = login_required;
