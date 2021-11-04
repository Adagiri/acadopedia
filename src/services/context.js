const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function getUserInfo(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

module.exports = { getUserInfo };
