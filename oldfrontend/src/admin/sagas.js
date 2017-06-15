import { takeLatest, takeEvery } from 'redux-saga'
import { fork, put, take, select, call } from 'redux-saga/effects'
import RouteTriggerSaga from 'boiler-ui/lib/sagas/routetrigger'
import DataTriggerSaga from 'boiler-ui/lib/sagas/datatrigger'
import RedirectorSaga from 'boiler-ui/lib/sagas/redirector'
import ApiSaga from 'boiler-ui/lib/sagas/api'

import plugins from './plugins'
import actions from './actions'
import selectors from './selectors'

import tools from '../logic/tools'
import dates from '../logic/dates'
import calculator from '../logic/calculator'

import { 
  getRouteActions,
  redirectors,
  dataTriggers
} from './routes'

function* loadConfig() {
  yield put(actions.getConfig.request())
}

function* editBooking(action) {
  const booking = action.payload

  booking.meta.slot.originalDate = booking.meta.slot.date.split(' ')[0]
  yield put(actions.setBooking(booking))
  yield put(actions.getBookingFormRange.request({
    date: dates.getSQLDate(booking.name, true),
    daywindow: 0
  }))
}

function* listenEditBooking() {
  yield takeLatest(actions.getBooking.types.success, editBooking)
}

function* openPDF(action) {

  const searchFrom = yield select(state => selectors.search.scheduleFrom(state))
  const searchTo = yield select(state => selectors.search.scheduleTo(state))

  const addTo = new Date(searchTo.getTime() + (1000 * 60 * 60 * 24))

  const sqlFrom = dates.getSQLDate(searchFrom, true)
  const sqlTo = dates.getSQLDate(addTo, true)

  const url = '/api/v1/bookings/schedule?pdf=y&from=' + sqlFrom + '&to=' + sqlTo
  window.open(url)
}

function* listenOpenPDF() {
  yield takeLatest(actions.types.openSchedulePDF, openPDF)
}

function* saveBooking(action) {
  const saveMode = yield select(state => state.router.result.api)
  const bookingData = yield select(state => selectors.booking.data(state))
  const routerParams = yield select(state => state.router.params)
  const quoteme_blocks = yield select(state => selectors.booking.quoteme_blocks(state))
  const prices = yield select(state => selectors.booking.prices(state))
  let slot = yield select(state => selectors.booking.slot(state))
  const formInfo = yield select(state => selectors.booking.formInfo(state))
  const paymentInfo = yield select(state => selectors.booking.paymentInfo(state))

  slot.index = slot.currentIndex || slot.index

  const options = formInfo.options.values
  const costs = calculator(quoteme_blocks, prices, options, slot, paymentInfo)

  let meta = Object.assign({}, bookingData.meta, {
    costs,
    slot
  })

  if(!meta.bookingid) {
    meta.bookingid = tools.makeid()
  }

  const saveData = {
    meta: meta,
    name: bookingData.name,
    date: bookingData.name
  }

  const actionFunction = saveMode == 'put' ?
    actions.putBooking.request :
    actions.postBooking.request

  const actionParams = saveMode == 'put' ?
    routerParams :
    {}

  yield put(actionFunction(actionParams, saveData))
}

function* listenSaveBooking() {
  yield takeLatest(actions.types.saveBooking, saveBooking)
}

const getSagas = (apis = {}) => {

  return [

    plugins.user.saga,
    plugins.snackbar.saga,
    plugins.booking.table.saga,
    plugins.booking.search.saga,
    RouteTriggerSaga({
      getRouteActions,
      userLoadedActionType: actions.user.status.api.types.success
    }),
    DataTriggerSaga({
      handlers: dataTriggers
    }),
    RedirectorSaga({
      redirectors
    }),
    ApiSaga({
      api: apis.config.get,
      actions: actions.getConfig
    }),
    ApiSaga({
      api: apis.booking.get,
      actions: actions.getBooking
    }),
    ApiSaga({
      api: apis.booking.post,
      actions: actions.postBooking
    }),
    ApiSaga({
      api: apis.booking.put,
      actions: actions.putBooking
    }),
    ApiSaga({
      api: apis.booking.range,
      actions: actions.getCalendarRange
    }),
    ApiSaga({
      api: apis.booking.range,
      actions: actions.getBookingFormRange
    }),
    ApiSaga({
      api: apis.booking.list,
      actions: actions.getScheduleRange
    }),
    loadConfig,
    listenEditBooking,
    listenSaveBooking,
    listenOpenPDF

  ]
}

export default getSagas