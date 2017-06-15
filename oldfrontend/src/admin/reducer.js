import update from 'immutability-helper'
import { combineReducers } from 'redux'
import ApiReducer from 'boiler-ui/lib/reducers/api'

import actions from './actions'
import plugins from './plugins'

import dates from '../logic/dates'
import tools from '../logic/tools'

import {
  types
} from './actions'

const getDefaultBooking = (opts = {}) => {
  const nowDate = opts.date || new Date()
  if(!opts.date) {
    nowDate.setMinutes(0)  
  }
  const sqlDate = dates.getSQLDate(nowDate)
  return {
    date: nowDate,
    name: sqlDate,
    meta: {
      bookingid: tools.makeid(),
      date: sqlDate,
      options: {},
      info: {},
      costs: {},
      paymentInfo: {
        mode: 'manual',
        deposit: 0,
        sendEmail: true,
        sendText: true
      },
      slot: {
        date: sqlDate,
        index: opts.index || '',
        duration: opts.duration || 120,
        price: opts.price || 850
      }
    }
  }
}

const todayDate = new Date()
const searchFrom = todayDate//new Date(todayDate.getTime() - 1000 * 60 * 60 * 24 * 7)
const searchTo = todayDate//new Date(todayDate.getTime() + 1000 * 60 * 60 * 24 * 7)

const scheduleSearchFrom = todayDate
const scheduleSearchTo = todayDate//new Date(todayDate.getTime() + 1000 * 60 * 60 * 24)

const calendarDate = todayDate
const calendarWindow = 3

const DEFAULT_STATE = {
  bookingShowErrors: false,
  booking: getDefaultBooking(),
  search: {
    from: searchFrom,
    to: searchTo,
    scheduleFrom: scheduleSearchFrom,
    scheduleTo: scheduleSearchTo,
    calendarDate: calendarDate,
    calendarWindow: calendarWindow,
    all: true
  }
}

const coreReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {

    case types.bookingShowErrors:

      return update(state, {
        bookingShowErrors: {
          $set: action.value
        }
      })

    case types.setBooking:

      return update(state, {
        booking: {
          $set: action.value
        }
      })

    case types.resetBooking:

      return update(state, {
        booking: {
          $set: getDefaultBooking(action.opts)
        }
      })

    case types.updateSearch:

      return update(state, {
        search: {
          [action.name]: {
            $set: action.value
          }
        }
      })

    case types.updateCalendarSearch:

      return update(state, {
        search: {
          [action.name]: {
            $set: action.value
          }
        }
      })

    case types.updateScheduleSearch:

      return update(state, {
        search: {
          [action.name]: {
            $set: action.value
          }
        }
      })

    case types.updateBookingDate:

      const sqlDate = dates.getSQLDate(action.value)

      return update(state, {
        booking: {
          date: {
            $set: action.value
          },
          name: {
            $set: sqlDate
          },
          meta: {
            date: {
              $set: sqlDate
            },
            slot: {
              date: {
                $set: sqlDate
              }
            }
          }
        }
      })

    case types.updateBooking:

      if(action.section == 'root') {
        return update(state, {
          booking: {
            [action.name]: {
              $set: action.value
            }
          }
        })
      }
      else if(action.section == 'meta') {
        return update(state, {
          booking: {
            meta: {
              [action.name]: {
                $set: action.value
              }
            }
          }
        })
      }
      else {
        return update(state, {
          booking: {
            meta: {
              [action.section]: {
                [action.name]: {
                  $set: action.value
                }
              }
            }
          }
        })
      }
      

    default:
      return state
  }
}


const reducer = {
  menu: plugins.menu.reducer,
  snackbar: plugins.snackbar.reducer,
  user: plugins.user.reducer,
  booking: combineReducers({
    table: plugins.booking.table.reducer,
    search: plugins.booking.search.reducer
  }),
  config: ApiReducer(actions.getConfig.types, {keepData: true}),
  calendarRange: ApiReducer(actions.getCalendarRange.types, {keepData: true}),
  bookingFormRange: ApiReducer(actions.getBookingFormRange.types, {keepData: true}),
  scheduleRange: ApiReducer(actions.getScheduleRange.types, {keepData: true}),
  getBooking: ApiReducer(actions.getBooking.types, {keepData: false}),
  putBooking: ApiReducer(actions.putBooking.types, {keepData: false}),
  postBooking: ApiReducer(actions.postBooking.types, {keepData: false}),
  core: coreReducer
}

export default reducer