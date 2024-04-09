const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

function nowVerify(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("This is nowVerify decode line 7: ", decoded);
    return decoded;
  } catch (error) {
    throw new Error('Failed to verify token in nowVerify module');
  }
}

module.exports = {
  nowVerify,
};
