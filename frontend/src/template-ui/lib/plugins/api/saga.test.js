import tape from 'tape'
import { expectSaga } from 'redux-saga-test-plan';
import ApiActions, { TYPES } from './actions'
import ApiSaga from './saga'

tape('api saga: response', (t) => {
  const ID = 'fruit'
  const actions = ApiActions(ID)
  const opts = {
    actions,
    payload: 5,
    api: (payload) => new Promise(resolve => {
      resolve(10)
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
    .put(getAction('request', { payload: 5 }))
    .put(getAction('response', { payload: 10 }))
    .returns({
      answer: 10,
      error: null
    })
    .run()
    .then((result) => {
      t.end()
    })
})