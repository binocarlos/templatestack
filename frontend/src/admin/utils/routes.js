import config from '../config'
import { GetRoute, RouteProcessor, HomeRouteMatcher } from 'template-ui/lib/utils/routes'

// stuff to do with prepending the basepath (so the routes read nicely)
export const routeProcessor = RouteProcessor(CORE.basepath)
export const getRoute = GetRoute(CORE.basepath)
export const homeRouteMatcher = HomeRouteMatcher(CORE.basepath)

export const guest = (route) => {
  return Object.assign({}, route, {
    requireGuest: getRoute('/')
  })
}

export const user = (route) => {
  return Object.assign({}, route, {
    requireUser: getRoute('/')
  })
}