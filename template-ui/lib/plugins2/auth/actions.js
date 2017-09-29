import value from '../value/actions'

const AuthActions = {
  setUser: (data) => value.set('user', data),
  clearUser: () => value.set('user', null)
}

export default AuthActions