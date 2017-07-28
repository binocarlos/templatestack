const info = (state, name) => {
  return name ?
    state.router.result[name] :
    state.router.result
}
const params = (state) => state.router.params
const param = (state, name) => (params(state) || {})[name]

// an array of route info starting at the lowest route
const infoArray = (state) => {
  let currentInfo = info(state)
  let ret = []
  while(currentInfo) {
    ret.push(currentInfo)
    currentInfo = currentInfo.parent
  }
  return ret
}

// start at lowest route - return first value for field found going up to /
const firstValue = (state, name) => {
  const info = infoArray(state)
  return info
    .map(i => i[name])
    .filter(v => typeof(v) !== 'undefined')[0]
}

const routerSelectors = {
  info,
  params,
  param,
  infoArray,
  firstValue
}

export default routerSelectors