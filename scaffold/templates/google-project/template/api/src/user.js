'use strict'

const settings = require('./settings')
const adminUserIds = settings.admin_users.split(',')

const getTags = (user) => {
  let tags = {}
  user = user || {}
  tags.admin = adminUserIds.indexOf(user.username || '') >= 0
  return tags
}

module.exports = {
  getTags
}