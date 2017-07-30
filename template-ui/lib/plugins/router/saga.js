import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import { ForkListeners } from '../../utils/saga'
import { devLogger } from '../../utils/console'
import actions, { TYPES } from './actions'
import consoleTools from 'template-ui/lib/utils/console'

const RouterSaga = (opts = {}) => {
  if(!opts.hooks) throw new Error('hooks needed for RouterSaga')
  if(!opts.basepath) throw new Error('basepath needed for RouterSaga')

  const { hooks, basepath } = opts

  consoleTools.devRun(() => {
    console.log('have hooks:')
    console.dir(Object.keys(hooks))
  })  

  const getRoute = (path) => basepath + path

  function* runHook(name, payload) {    
    if(opts.trigger) opts.trigger(name, payload)
    
    if(name.indexOf('/') == 0) {
      // replace `:param` with values from state
      const routerParams = yield select(state => state.router.params)
      name = name.replace(/:(\w+)/g, name => {
        return routerParams[name.replace(/^:/, '')]
      })
      yield put(actions.push(getRoute(name)))
    }
    else {
      const hookHandlers = hooks[name]
      if(!hookHandlers) {
        devLogger(`no hook found for ${name}`, 'error')
        return
      }
      const hookHandlerArray = hookHandlers.constructor === Array ?
        hookHandlers :
        [hookHandlers]

      yield all(hookHandlerArray.map(handler => {
        return call(handler, payload)
      }))
    }
  }

  // handle a trigger from other code
  function* handleHookAction(action) {
    yield call(runHook, action.name, action.payload)
  }

  function* routerChanged(action) {
    const router = yield select(state => state.router)
    const routeInfo = router.result || {}
    let hookArray = routeInfo.hooks || []
    hookArray = typeof(hookArray) == 'string' ? [hookArray] : hookArray
    const redirect = routeInfo.redirect
    if(redirect) hookArray.push(redirect)
    if(hookArray && hookArray.length > 0) {
      const hookHandlers = hookArray
        .map(hook => {
          hook = typeof(hook) == 'string' ?
            {name:hook,payload:null} :
            hook     
          return call(runHook, hook.name, hook.payload)
        })
      yield all(hookHandlers)
    }
    yield put(actions.hook('routerChanged'))
  }

  // called once we have loaded user info
  function* initialize() {
    const routerState = yield select(state => state.router)
    yield put(actions.push(routerState.pathname))
  }

  const listeners = ForkListeners([
    [TYPES.changed, routerChanged],
    [TYPES.redirect, handleHookAction],
    [TYPES.hook, handleHookAction]
  ])

  function* main() {
    yield fork(listeners)
  }

  return {
    initialize,
    main
  }
}

export default RouterSaga