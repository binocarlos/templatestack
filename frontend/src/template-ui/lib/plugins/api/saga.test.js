import tape from 'tape'
import { expectSaga } from 'redux-saga-test-plan'
import ApiActions from './actions'
import ApiSaga from './saga'

tape('api saga: response', (t) => {
  const NAME = 'fruit'
  const REQUEST = 6
  const RESPONSE = 10
  const actions = ApiActions()(NAME)
  const opts = {
    actions,
    payload: REQUEST,
    api: (payload) => new Promise(resolve => {
      resolve(RESPONSE)
    })
  }
  const getAction = (type, action) => {
    return Object.assign({}, action, {
      type: actions._types[type],
      _genericid: 'api',
      _genericname: NAME,
      _genericaction: type
    })
  }
  return expectSaga(ApiSaga, opts)
    .put(getAction('request', { payload: REQUEST }))
    .put(getAction('response', { payload: RESPONSE }))
    .returns({
      answer: RESPONSE,
      error: null
    })
    .run()
    .then((result) => {
      t.ok('saga has passed')
      t.end()
    })
})

tape('api saga: error', (t) => {
  const NAME = 'fruit'
  const REQUEST = 6
  const ERROR = 'hello world'
  const actions = ApiActions()(NAME)
  const opts = {
    actions,
    payload: REQUEST,
    api: (payload) => new Promise((resolve, reject) => {
      reject(ERROR)
    })
  }
  const getAction = (type, action) => {
    return Object.assign({}, action, {
      type: actions._types[type],
      _genericid: 'api',
      _genericname: NAME,
      _genericaction: type
    })
  }
  return expectSaga(ApiSaga, opts)
    .put(getAction('request', { payload: REQUEST }))
    .put(getAction('error', { payload: ERROR }))
    .returns({
      answer: null,
      error: 'hello world'
    })
    .run()
    .then((result) => {
      t.ok('saga has passed')
      t.end()
    })
})