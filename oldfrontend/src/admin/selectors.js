import plugins from './plugins'

import validate from '../logic/validate'

// extract the parent id for the resource section
// used to reload the table for paste
export const parentIdRouteSelector = (state) => {
  const parentid = state.router.params.parentid
  return !parentid || parentid == 'root' ? 
    null :
    parentid
}

const configRaw = (state) => state.config.payload || {}
const config = {
  calendar: (state) => configRaw(state).calendar || [],
  templates: (state) => configRaw(state).schedule_templates || {},
  prices: (state) => configRaw(state).prices || {},
  deposit: (state) => configRaw(state).deposit || 0,
  quoteme_blocks: (state) => configRaw(state).quoteme_blocks || [],
  booking_form: (state) => configRaw(state).booking_form || [],
  stripeKey: (state) => configRaw(state).stripeKey || ''
}

const search = {
  text: (state) => state.booking.search.current.value,
  from: (state) => state.core.search.from,
  to: (state) => state.core.search.to,
  scheduleFrom: (state) => state.core.search.scheduleFrom,
  scheduleTo: (state) => state.core.search.scheduleTo,
  calendarDate: (state) => state.core.search.calendarDate,
  calendarWindow: (state) => state.core.search.calendarWindow,
  all: (state) => state.core.search.all,
  calendarRange: (state) => state.calendarRange.payload || [],
  bookingFormRange: (state) => state.bookingFormRange.payload || [],
  scheduleRange: (state) => state.scheduleRange.payload || []
}

const booking = {
  data: (state) => state.core.booking || {},
  meta: (state) => booking.data(state).meta || {},
  bookingid: (state) => booking.meta(state).bookingid,
  paymentInfo: (state) => booking.meta(state).paymentInfo || {},
  chargeInfo: (state) => booking.meta(state).chargeInfo || {},
  deposit: (state) => booking.paymentInfo(state).deposit,
  paymentMode: (state) => booking.paymentInfo(state).mode,
  stripeToken: (state) => booking.paymentInfo(state).token,
  slot: (state) => booking.meta(state).slot || {},
  prices: (state) => booking.meta(state).prices || config.prices(state),
  quoteme_blocks: (state) => booking.meta(state).quoteme_blocks || config.quoteme_blocks(state),
  booking_form: (state) => booking.meta(state).booking_form || config.booking_form(state),
  formInfo: (state) => {
    const meta = booking.meta(state)
    const optionsData = meta.options || {}
    const infoData = meta.info || {}
    
    const optionsBlocks = booking.quoteme_blocks(state)
    const infoBlocks = booking.booking_form(state)

    return {
      options: {
        blocks: optionsBlocks,
        errors: validate.options(optionsData, optionsBlocks),
        values: optionsData
      },
      info: {
        blocks: infoBlocks,
        errors: validate.info(infoData, infoBlocks),
        values: infoData
      }
    }
  },
}

const selectors = {
  parentIdRouteSelector,
  config,
  booking,
  search
}

export default selectors