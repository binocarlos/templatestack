const DEFAULTS = {
  valueName: 'user',
  nameProperty: 'username'
}

const AuthSelectors = (opts = {}) => {
  opts = Object.assign({}, DEFAULTS, opts)
  const valueName = opts.valueName
  const auth = {
    user: state => state.value[valueName],
    loggedIn: state => auth.user(state) ? true : false,
    meta: state => (auth.user(state) || {}).meta || {},
    name: state => (auth.user(state) || {})[opts.nameProperty],
    activeInstallation: state => auth.meta(state).activeInstallation
  }
  return auth
}

export default AuthSelectors