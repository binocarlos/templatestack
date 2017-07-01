export const GetRoute = (BASEPATH) => (route) => BASEPATH + route
export const RouteProcessor = (BASEPATH) => (routes = {}) => {
  return Object.keys(routes).reduce((all, route) => {
    return Object.assign({}, all, {
      [BASEPATH + route]: routes[route]
    })
  }, {})
}
export const HomeRouteMatcher = (BASEPATH) => {
  const getRoute = GetRoute(BASEPATH)
  return (location) => {
    if(location.pathname == getRoute('')) return true
    if(location.pathname == getRoute('/')) return true
    return false
  }
}