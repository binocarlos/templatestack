import config from './config'
import { GetRoute, RouteProcessor, HomeRouteMatcher } from 'template-ui/lib/utils/routes'

const BASEPATH = config.basepath

// stuff to do with prepending the basepath (so the routes read nicely)
export const routeProcessor = RouteProcessor(BASEPATH)
export const getRoute = GetRoute(BASEPATH)
export const homeRouteMatcher = HomeRouteMatcher(BASEPATH)