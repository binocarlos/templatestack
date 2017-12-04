import actions from './actions'
import selectors from './selectors'

export const processRoutes = (routes, basepath = '') => {
  return Object.keys(routes).reduce((all, path) => {
    all[basepath + path] = routes[path]
    return all
  }, {})
}

// turn a string into an array of strings
const processHooks = (hooks) => typeof(hooks) == 'string' ? [hooks] : hooks

// default function for getting the hook names for a route
// based on it's result
export const getRouteInfoHooks = (routeInfo, mode = 'enter') => {
  const results = routeInfo.result || {}
  if(mode == 'enter') {
    const ret = results.onEnter || results.hooks || []
    return processHooks(ret)
  }
  else if(mode == 'leave') {
    const ret = results.onLeave || []
    return processHooks(ret)
  }
  else {
    return []
  }
}