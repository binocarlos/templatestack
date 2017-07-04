import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import { ForkListeners } from '../../utils/saga'
import actions, { TYPES } from './actions'

const RouterSaga = (opts = {}) => {
  if(!opts.redirects) throw new Error('redirects needed for RouterSaga')
  if(!opts.loaders) throw new Error('loaders needed for RouterSaga')
  if(!opts.basepath) throw new Error('basepath needed for RouterSaga')

  let initialRouteLoaded = false

  const { redirects, loaders, basepath } = opts

  const getRoute = (path) => basepath + path

  function* redirect(action) {
    if(!action.name) return
    if(action.name.indexOf('/') == 0) {
      yield put(actions.push(getRoute(action.name)))
    }
    else {
      const redirectHandler = redirects[action.name]
      if(!redirectHandler) return
      yield call(redirectHandler, action.payload)
    }
  }

  function* changed(action) {
    const router = yield select(state => state.router)
    const routeInfo = router.result || {}
    const loaderName = routeInfo.loader
    if(!loaderName) return
    if(!loaders[loaderName]) return
    yield call(loaders[loaderName], action)
    initialRouteLoaded = true
  }

  function* initializeRoute() {
    const routerState = yield select(state => state.router)
    yield put(actions.push(routerState.pathname))
  }

  const listeners = ForkListeners([
    [TYPES.redirect, redirect],
    [TYPES.changed, changed]
  ])

  function* routerEntrySaga() {
    yield fork(listeners)
    yield call(initializeRoute)
  }

  return routerEntrySaga
}

export default RouterSaga