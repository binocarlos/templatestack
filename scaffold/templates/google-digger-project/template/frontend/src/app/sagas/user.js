import { take, put, call, fork, select, all, takeLatest, takeEvery, cancel } from 'redux-saga/effects'

import selectors from '../selectors'
import actions from '../actions'

import CrudSaga from 'template-ui/lib/plugins2/crud/saga'

const UserSaga = (opts = {}) => {

  function* loadInitialData() {
    return {}
  }

  const userSaga = CrudSaga({
    name: 'user',
    actions: actions.user,
    selectors: selectors.user,
    apis: opts.apis,
    loadInitialData
  })

  return userSaga
}

export default UserSaga