"use strict";
const prices = require('./prices')
const dates = require('./dates')
const calculator = require('./calculator')

const getSlotPrice = (slot) => {
  return prices.title(slot.price)
}

const getSlotDuration = (slot) => {
  return slot.duration + ' mins'
}

const getSlotSummary = (slot) => {
  return getSlotDuration(slot) + ' - ' + getSlotPrice(slot)
}

const getAdminSlotSummary = (slot, filled) => {
  const childName = filled ? ' - ' + getChildSummary(slot.booking.meta.info) : ''
  const index = slot.index
  return index + childName
}

const getChildSummary = (info) => {
  return info.child_name
}

const getPaymentInfo = (booking) => {
  const meta = booking.meta || {}
  const paymentInfo = meta.paymentInfo || {}
  const deposit = paymentInfo.deposit
  const paymentMode = paymentInfo.mode
  const stripeToken = prices.getStripeDescription(paymentInfo.token)

  return `
Payment:      ${ paymentMode + ' - ' + prices.title(deposit) }
Stripe ref:   ${ stripeToken }
`
}

const getCostExtraInfo = (item, forEmail) => {
  return `${ item.title } - ${ forEmail ? prices.title(item.total) : item.total } - ${ item.summary }`
}

const getCostInfo = (booking, forEmail) => {
  const meta = booking.meta || {}
  const costs = meta.costs || {}

  return costs.extras
    .map(item => getCostExtraInfo(item, forEmail)).join("\n")
}

const getSlotInfo = (booking) => {
  const meta = booking.meta || {}

  const bookingid = meta.bookingid || ''
  const date = new Date(meta.date)
  const slot = meta.slot || {}
  const options = meta.options || {}
  const costs = meta.costs || {}

  return `
Ref:          ${ bookingid }
Date:         ${ dates.getDateTitle(date) }
Time:         ${ dates.getSlotTitle(slot) }
Duration:     ${ slot.duration + ' mins' }
Children:     ${ options.children || 0 }
Total:        ${ prices.title(costs.total || 0) }
`
}

const getEmailBooking = (booking) => {
  const slot = getSlotInfo(booking)
  const costs = getCostInfo(booking, true)

  return `
Booking Info
-------------
${slot}

Costs
-------------
${costs}
`
}

const getTextBooking = (booking) => {
  const meta = booking.meta || {}

  const bookingid = meta.bookingid
  const date = new Date(meta.date)
  const slot = meta.slot || {}
  const options = meta.options

  return `${ dates.getDateTitle(date) } ${ dates.getSlotTitle(slot) } - ref: ${ bookingid }`
}


module.exports = {
  getSlotPrice,
  getSlotDuration,
  getSlotSummary,
  getAdminSlotSummary,
  getSlotInfo,
  getCostInfo,
  getChildSummary,
  getPaymentInfo,
  getEmailBooking,
  getTextBooking
}