const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const jwt_secret = require('../secrets.json').JWT_SECRET


async function hashPassword (ps) {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(ps, salt)

  return password
}

async function signToken (payload) {
  const token = jwt.sign(payload, jwt_secret)
  return token
}

async function checkPassword (ps, user) {
  const isMatch = await bcrypt.compare(ps, user.password)
  console.log(isMatch)
  return isMatch
}

async function getUserFromToken (token) {
  const secret = jwt.verify(token, jwt_secret)
  return secret
}


module.exports = {
    hashPassword,
    signToken,
    checkPassword,
    getUserFromToken
}