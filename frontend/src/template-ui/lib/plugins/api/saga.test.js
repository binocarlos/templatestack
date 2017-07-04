import tape from 'tape'
import { expectSaga } from 'redux-saga-test-plan';
import ApiActions, { TYPES } from './actions'
import ApiSaga from './saga'

tape('api saga: response', (t) => {
  const ID = 'fruit'
  const REQUEST = 6
  const RESPONSE = 10
  const actions = ApiActions(ID)
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
      type_api: TYPES[type],
      name_api: ID
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
      t.end()
    })
})

tape('api saga: error', (t) => {
  const ID = 'fruit'
  const REQUEST = 6
  const ERROR = 'hello world'
  const actions = ApiActions(ID)
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
      type_api: TYPES[type],
      name_api: ID
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
      t.end()
    })
})