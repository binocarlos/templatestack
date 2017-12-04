'use strict'

const AdminUser = (user = {}) => {

  user.id = user.id || 1

  const loadByUsername = (username, done) => {
    username == user.username ?
      done(null, user) :
      done()
  }

  const loadById = (id, done) => {
    id == user.id ?
      done(null, user) :
      done()
  }

  const displayUser = (givenuser) => {
    const retuser = Object.assign({}, givenuser)
    delete(retuser.password)
    return retuser
  }

  const checkPassword = (givenuser, check_password) => user.password == check_password

  return {
    loadByUsername,
    loadById,
    displayUser,
    checkPassword
  }
}

module.exports = AdminUser