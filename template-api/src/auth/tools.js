'use strict'

const crypto = require('crypto')

const makeSalt = () => {
  return Math.round((new Date().valueOf() * Math.random())) + '';
}

const encryptPassword = (password, salt) => {
  if (!password) return '';
  try {
    return crypto
      .createHmac('sha1', salt)
      .update(password)
      .digest('hex');
  } catch (err) {
    return '';
  }
}

const checkUserPassword = (check_password, hashed_password, salt) => {
  return encryptPassword(check_password, salt) == hashed_password
}

const middleware = () => (req, res, next) => {
  req.userid = req.user ? req.user.id : null
  next()
}

module.exports = {
  makeSalt,
  encryptPassword,
  checkUserPassword,
  middleware
}