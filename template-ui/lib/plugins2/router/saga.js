import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import options from 'template-tools/src/utils/options'
import consoleTools from 'template-ui/lib/utils/console'

import { ForkListeners } from '../../utils/saga'
import { devLogger } from '../../utils/console'

import authSelectors from '../auth/selectors'

import actions, { TYPES } from './actions'
import selectors from './selectors'


const REQUIRED = [
  'getRouteHooks',
  'getRoute',
  'getHook'
]

const RouterSaga = (opts = {}) => {
  opts = options.processor(opts, {
    required: REQUIRED
  })

  const { getHook, getRoute, getRouteHooks } = opts

  // run though a sequence of hooks - blocking until
  //  * there are none left
  //  * one of them returns not true
  // hooks = []string
  function* runHookArray(hookNames) {
    let hookList = [].concat(hookNames)
    let ok = true
    while(ok && hookList.length > 0) {
      const nextHook = hookList.shift()
      const hookok = yield call(runHook, nextHook)
      ok = hookok === false ? false : true
      consoleTools.devRun(() => {
        if(!ok) {
          console.log(`HOOK ARRAY CANCELLED: ${nextHook}`)
        }
      })
    }
  }

  function* runRedirect(path) {
    if(path.indexOf('/') != 0) {
      yield call(runHook, path)
      return
    }
    let route = getRoute(path)
    const routerParams = yield select(state => state.router.params)
    route = route.replace(/:(\w+)/g, name => {
      return routerParams[name.replace(/^:/, '')]
    })
    consoleTools.devRun(() => {
      console.log(`REDIRECT: ${path} -> ${route}`)
    })
    yield put(actions.push(route))
  }

  // run a single hook
  function* runHook(name, payload) {
    consoleTools.devRun(() => {
      if(!payload || !payload._nolog) {
        console.log(`HOOK RUN: ${name}`)
        if(payload) console.dir(payload)
      }
    })
    const hook = getHook(name)
    if(!hook) throw new Error(`no hook found for ${name}`)
    const result = yield call(hook, payload)  
    return result
  }

  function* handleRedirectAction(action) {
    yield call(runRedirect, action.name)
  }

  // handle an action that means run a hook
  function* handleHookAction(action) {
    yield call(runHook, action.name, action.payload)
  }

  function* handleChangeAction() {
    const router = yield select(state => state.router)
    
    // run the onLeave hooks for the previous route (if any)
    const leaveRouteHooks = getRouteHooks(router.previous || {}, 'leave')
    consoleTools.devRun(() => {
      if(leaveRouteHooks.length > 0) {
        console.log(`HOOKS - LEAVE: ${leaveRouteHooks.join(', ')}`)  
      }
    })
    yield call(runHookArray, leaveRouteHooks)

    const enterRouteHooks = getRouteHooks(router || {}, 'enter')
    consoleTools.devRun(() => {
      if(enterRouteHooks.length > 0) {
        console.log(`HOOKS - ENTER: ${enterRouteHooks.join(', ')}`)  
      }
    })
    yield call(runHookArray, enterRouteHooks)
  }

  function* initialize() {
    yield takeEvery(TYPES.redirect, handleRedirectAction)
    yield takeEvery(TYPES.hook, handleHookAction)
    yield takeEvery(TYPES.changed, handleChangeAction)
    yield call(handleChangeAction)
  }

  return {
    initialize
  }
}

export default RouterSaga