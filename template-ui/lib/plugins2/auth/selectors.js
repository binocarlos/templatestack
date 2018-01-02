import value from '../value/selectors'

const auth = {
  user: (state) => value.get(state, 'user'),
  meta: (state) => (auth.user(state) || {}).meta || {},
  activeInstallationId: (state) => auth.meta(state).activeInstallationId,
  activeInstallation: (state) => value.get(state, 'activeInstallation'),
  loggedIn: (state) => auth.user(state) ? true : false,
  userToken: (state) => value.get(state, 'userToken'),
  // google or normal
  type: (data) => {
    const google = (data.meta || {}).google
    return google ? 'google' : 'normal'
  },
  displayName: (data) => {
    if(!data) return ''
    const google = (data.meta || {}).google
    return google ?
      google.displayName :
      data.username
  },
}

export default auth