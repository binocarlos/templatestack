export const processRoutes = (routes, basepath = '') => {
  return Object.keys(routes).reduce((all, path) => {
    all[basepath + path] = routes[path]
    return all
  }, {})
}