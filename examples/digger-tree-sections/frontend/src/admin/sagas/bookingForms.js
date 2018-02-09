import { take, put, call, fork, select, all, takeLatest, takeEvery, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import options from 'template-tools/src/utils/options'
import apiSaga from 'template-ui/lib/plugins2/api/saga'
import routerSelectors from 'template-ui/lib/plugins2/router/selectors'
import systemActions from 'template-ui/lib/plugins2/system/actions'
import formUtils from 'template-ui/lib/plugins2/form/utils'

import forms from '../forms'
import actions from '../actions'
import selectors from '../selectors'
import utils from '../utils'

const REQUIRED = [
  'apis',
]

// parts of the needed digger api
const REQUIRED_APIS = [
  'descendents',
  'load',
]

const BookingFormsSagas = (opts = {}) => {

  opts = options.processor(opts, {
    required: REQUIRED
  })

  const apis = options.processor(opts.apis, {
    required: REQUIRED_APIS
  })

  const {
    name,    
  } = opts

  function* setList(val) {  
    yield put(actions.bookingForms.setList(val))
  }

  function* getList() {    
    const ret = yield select(selectors.bookingForms.list)
    return ret
  }

  function* list() {
    const { answer, error } = yield call(apiSaga, {
      name: 'bookingForms',
      handler: apis.descendents,
      payload: {
        namespace: 'bookingForm'
      },
      keepPayload: true,
    })

    if(error) {
      yield put(systemActions.message(error))
      yield call(setList, [])
    }
    else {
      yield call(setList, answer)
    }
  }

  function* getFirstBookingForm() {
    yield call(list)
    const bookingForms = yield call(getList)
    return bookingForms[0]
  }

  function* redirectToBookingForm(url) {
    const bookingForms = yield call(getList)
    const bookingForm = (bookingForms || []).filter(utils.matchBooking(url))[0]
    if(!bookingForm) return
    const bookingFormsSection = yield select(selectors.bookingForms.section)
    yield put(actions.router.redirect(`/${bookingFormsSection}${utils.parseUrl(bookingForm.meta.url)}`))
  }

  function* redirect() {
    const bookingForm = yield call(getFirstBookingForm)
    if(!bookingForm) {
      yield put(systemActions.message("Please create some booking forms first..."))
      return
    }
    const url = bookingForm.meta.url || ''
    yield call(redirectToBookingForm, bookingForm.meta.url)
  }


  // return the params for the calendar search
  function* getCalendarSearchParams() {
    let searchValues = yield select(state => selectors.form.values(state, 'calendarSearch'))
    searchValues = searchValues || {}
    const bookingForm = yield select(state => selectors.bookingForms.current(state))
    const defaults = formUtils.getDefaults(forms.calendarSearch)

    if(!bookingForm) {
      yield put(systemActions.message("No booking form loaded..."))
      return
    }

    const start = selectors.bookingForm.defaultCalendarDate(bookingForm)
    const days = searchValues.days || defaults.days

    return {
      start,
      days,
      type: bookingForm.meta.url
    }
  }


  const bookingForms = {    
    list,
    redirect,
    redirectToBookingForm,
    getCalendarSearchParams,
  }

  return bookingForms
}

export default BookingFormsSagas
