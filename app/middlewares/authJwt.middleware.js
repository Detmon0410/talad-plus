const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;

/** Check token by get access token first.
 * Then return the confirm message.
 */
verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
    const decoded = jwt.verify(token, "config.secret");
    const user = await User.findById(decoded.id);
    req.user = user;
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(500).send({ message: "internal server error" });
  }
};

const authJwt = {
  verifyToken,
};

module.exports = authJwt;
