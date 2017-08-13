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

  // a named hook might actually have multiple handler functions
  // run each handler function with the same payload in series
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
        [].concat(hookHandlers) :
        [hookHandlers]

      const useHandlers = hookHandlerArray.filter(h => h)

      if(useHandlers.length <= 0) {
        devLogger(`no hooks found for ${name}`, 'error')
        return
      }
      
      while(hookHandlerArray.length > 0) {
        const nextHandler = hookHandlerArray.shift()
        // allow hooks to call other hooks with the same payload
        if(typeof(nextHandler) == 'string') {
          yield call(runHook, nextHandler, payload)  
        }
        else {
          yield call(nextHandler, payload)  
        }
        
      }
    }
  }

  // handle a trigger from other code
  function* handleHookAction(action) {
    yield call(runHook, action.name, action.payload)
  }

  // the route config may list an array of handler names
  // if the handler is a string - it is turned into {name}
  // this way - the router can also pass a payload {name,payload}
  // each name/payload combo is run in series
  function* routerChanged(action) {
    const router = yield select(state => state.router)
    const routeInfo = router.result || {}
    let hookArray = routeInfo.hooks || []
    hookArray = typeof(hookArray) == 'string' ? [hookArray] : hookArray
    const redirect = routeInfo.redirect
    if(redirect) hookArray.push(redirect)
    if(hookArray && hookArray.length > 0) {
      const hookHandlerArray = hookArray
        .map(hook => {
          return typeof(hook) == 'string' ?
            {name:hook,payload:null} :
            hook
        })
      while(hookHandlerArray.length > 0) {
        const nextHook = hookHandlerArray.shift()
        yield call(runHook, nextHook.name, nextHook.payload)
      }
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