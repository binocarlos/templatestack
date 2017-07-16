import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import { ForkListeners } from '../../utils/saga'
import actions, { TYPES } from './actions'

const RouterSaga = (opts = {}) => {
  if(!opts.triggers) throw new Error('triggers needed for RouterSaga')
  if(!opts.basepath) throw new Error('basepath needed for RouterSaga')

  let initialRouteLoaded = false

  const { triggers, basepath } = opts

  const getRoute = (path) => basepath + path

  function* runTrigger(name, payload) {
    if(name.indexOf('/') == 0) {
      yield put(actions.push(getRoute(name)))
    }
    else {
      const triggerHandler = triggers[name]
      if(!triggerHandler) {
        console.error(`no trigger found for ${name}`)
        return
      }
      yield call(triggerHandler, payload)
    }
  }

  // handle a trigger from other code
  function* handleTrigger(action) {
    yield call(runTrigger, action.name, action.payload)
  }

  function* routerChanged(action) {
    const router = yield select(state => state.router)
    const routeInfo = router.result || {}
    const triggerArray = routeInfo.triggers || []
    const redirect = routeInfo.redirect
    if(redirect) triggerArray.push(redirect)
    if(!triggerArray || triggerArray.length <= 0) return

    const triggerHandlers = triggerArray
      .map(trigger => {        
        return call(runTrigger, trigger.name, trigger.payload)
      })
    yield all(triggerHandlers)
    initialRouteLoaded = true
  }

  function* triggered(action) {
    if(!action.name) return
    const triggerHandler = triggers[action.name]
    if(!triggerHandler) return
    yield call(triggerHandler, action.payload)
  }

  function* initializeRoute() {
    const routerState = yield select(state => state.router)
    yield put(actions.push(routerState.pathname))
  }

  const listeners = ForkListeners([
    [TYPES.changed, routerChanged],
    [TYPES.redirect, handleTrigger],
    [TYPES.trigger, handleTrigger]
  ])

  function* routerEntrySaga() {
    yield fork(listeners)
    yield call(initializeRoute)
  }

  return routerEntrySaga
}

export default RouterSaga