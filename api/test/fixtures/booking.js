"use strict";
const async = require('async')
const idTools = require('template-api/src/utils/id')
const dateTools = require('template-api/src/utils/date')
const tools = require('../tools')

const create = (opts = {}) => {
  const email = (new Date().getTime()) + (Math.floor(Math.random()*1000000)) + 'test@test.com'
  const date = opts.date || new Date()
  let ret = {
    type: opts.type || 'default',
    booking_reference: opts.booking_reference || idTools.makeid(),
    slot: opts.slot || '0-1',
    date: dateTools.sqlDate(date),
    meta: {
      info: {
        name: opts.name || 'Default Name',
        secondary_name: opts.name || 'Default Secondary Name',
        email: opts.email || email,
        mobile: opts.mobile || '07947827347'
      }
    } 
  }
  if(opts.installation) {
    ret.installation = opts.installation
  }
  return ret
}

const createMany = (overlays, bookingOpts) => {
  overlays = overlays || []
  bookingOpts = bookingOpts || {}
  return overlays.map(overlay => {
    const useOpts = Object.assign({}, bookingOpts, overlay)
    return create(useOpts)
  })
}

module.exports = {
  create,
  createMany
}