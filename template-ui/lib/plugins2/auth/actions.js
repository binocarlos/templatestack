import value from '../value/actions'

const AuthActions = {
  setUser: (data) => value.set('user', data),
  setToken: (data) => value.set('userToken', data),
  clearUser: () => value.set('user', null)
}

export default AuthActions