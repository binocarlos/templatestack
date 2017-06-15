import RouterActions from 'boiler-ui/lib/actions/router'
import TriggerActions from 'boiler-ui/lib/actions/trigger'
import ApiActions from 'boiler-ui/lib/actions/api'

import plugins from './plugins'


import {
  getRoute
} from './config/core'

export const router = RouterActions
export const menu = plugins.menu.actions
export const snackbar = plugins.snackbar.actions
export const user = plugins.user.actions


export const types = {
  getConfig: 'GET_CONFIG',
  getBooking: 'GET_BOOKING',
  postBooking: 'POST_BOOKING',
  putBooking: 'PUT_BOOKING',
  bookingShowErrors: 'BOOKING_SHOW_ERRORS',
  setBooking: 'SET_BOOKING',
  resetBooking: 'RESET_BOOKING',
  updateBooking: 'UPDATE_BOOKING',
  updateBookingDate: 'UPDATE_BOOKING_DATE',
  saveBooking: 'SAVE_BOOKING',
  updateSearch: 'UPDATE_SEARCH',
  updateCalendarSearch: 'UPDATE_CALENDAR_SEARCH',
  updateScheduleSearch: 'UPDATE_SCHEDULE_SEARCH',
  getCalendarRange: 'GET_CALENDAR_RANGE',
  getBookingFormRange: 'GET_BOOKING_FORM_RANGE',
  getScheduleRange: 'GET_SCHEDULE_RANGE',
  openSchedulePDF: 'OPEN_SCHEDULE_PDF'
}


const actions = {
  types,
  router,
  push: (url) => router.push(getRoute(url)),
  menu,
  snackbar,
  user,
  datatriggers: TriggerActions('DATA_TRIGGER'),
  getConfig: ApiActions(types.getConfig),
  getCalendarRange: ApiActions(types.getCalendarRange),
  getBookingFormRange: ApiActions(types.getBookingFormRange),
  getScheduleRange: ApiActions(types.getScheduleRange),
  getBooking: ApiActions(types.getBooking),
  putBooking: ApiActions(types.postBooking),
  postBooking: ApiActions(types.putBooking),
  updateSearch: (name, value) => ({
    type: types.updateSearch,
    name,
    value
  }),
  updateCalendarSearch: (name, value) => ({
    type: types.updateCalendarSearch,
    name,
    value
  }),
  updateScheduleSearch: (name, value) => ({
    type: types.updateScheduleSearch,
    name,
    value
  }),
  bookingShowErrors: (value) => ({
    type: types.bookingShowErrors,
    value
  }),
  saveBooking: () => ({
    type: types.saveBooking
  }),
  openSchedulePDF: () => ({
    type: types.openSchedulePDF
  }),
  resetBooking: (opts = {}) => ({
    type: types.resetBooking,
    opts
  }),
  setBooking: (value) => ({
    type: types.setBooking,
    value
  }),
  updateBooking: (section, name, value) => ({
    type: types.updateBooking,
    section,
    name,
    value
  }),
  updateBookingDate: (value) => ({
    type: types.updateBookingDate,
    value
  })
}

export default actions