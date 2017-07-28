import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'
import selectors from './selectors'
import actions from './actions'

function* authenticateRoute() {
  const userSetting = yield select(state => selectors.firstValue(state, 'auth'))
  const failureRedirect = yield select(state => selectors.firstValue(state, 'authFailureRedirect'))
  // this route has no opinion about the user
  if(typeof(userSetting) != 'boolean') return
  const user = yield select(state => state.value.user)
  const hasUser = user ? true : false
  const isRouteAuthenticated = hasUser == userSetting
  if(!isRouteAuthenticated) {
    yield put(actions.push(failureRedirect || '/'))
  }
}

export default authenticateRoute