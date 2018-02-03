"use strict";

const booking = {
  meta: (data) => data.meta || {},
  info: (data) => booking.meta(data).info || {},
  slot: (data) => booking.meta(data).slot || {},
  prices: (data) => booking.meta(data).prices || {},
  orders: (data) => booking.meta(data).orders || [],
  order: (data) => booking.orders(data)[0] || {},
  options: (data) => booking.order(data).options || {},
  payment: (data) => booking.order(data).payment || {},
  payments: (data) => booking.orders(data).map(order => order.payment),
  isBlocked: (data) => booking.meta(data).blocked ? true : false,
  getBlockedBooking: (data, slot) => ({
    date: data.date,
    slot: data.slot,
    type: data.type,
    booking_reference: 'blocked',
    meta: {
      blocked: true,
      slot: slot,
      info: {
        name: 'blocked',
        child_name: 'blocked',
        email: 'blocked@blocked.com'
      },
      orders: [{
        options: {},
        payment: {}
      }]
    }
  })
}

const slot = {
  items: (data) => data._items || [],
  isEmpty: (data) => slot.items(data).length <= 0,
  isBlocked: (data) => slot.blockedBookings(data).length > 0,
  blockedBookings: (data) => slot.items(data).filter(b => booking.isBlocked(b))
}

const day = {
  slot: (data, index) => {
    const [blockIndex, slotIndex] = index.split('-')
    const block = day.blocks[blockIndex]
    return block.slots[slotIndex]
  }
}

module.exports = {
  booking,
  slot,
  day
}
