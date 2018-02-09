import { take, put, call, fork, select, all, takeLatest, takeEvery, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import options from 'template-tools/src/utils/options'
import apiSaga from 'template-ui/lib/plugins2/api/saga'
import routerSelectors from 'template-ui/lib/plugins2/router/selectors'
import valueSelectors from 'template-ui/lib/plugins2/router/selectors'

import valueActions from 'template-ui/lib/plugins2/value/actions'
import systemActions from 'template-ui/lib/plugins2/system/actions'

const REQUIRED = [
  'apis',
  'hooks',
]

// parts of the needed digger api
const REQUIRED_APIS = [  
  'search',
  'range',
]

const REQUIRED_HOOKS = [  
  'getSearchParams',
]

const CalendarSagas = (opts = {}) => {

  opts = options.processor(opts, {
    required: REQUIRED
  })

  const apis = options.processor(opts.apis, {
    required: REQUIRED_APIS
  })

  const hooks = options.processor(opts.hooks, {
    required: REQUIRED_HOOKS
  })

  const {
    name,   
  } = opts

  function* setData(val) {  
    yield put(valueActions.set(`calendarData${name}`, val))
  }

  function* load() {
    const params = yield call(hooks.getSearchParams)

    if(!params) return

    console.log('-------------------------------------------');
    console.log('-------------------------------------------');
    console.log('-------------------------------------------');
    console.dir(params)
    const { answer, error } = yield call(apiSaga, {
      name: `calendarLoad${name}`,
      handler: apis.range,
      payload: params,
      keepPayload: true,
    })

    if(error) {
      yield put(systemActions.message(error))
      yield call(setData, [])
    }
    else {
      yield call(setData, answer)
    }
  }

  const calendar = {    
    load,
  }

  return calendar
}

export default CalendarSagas
