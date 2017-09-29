import value from '../value/selectors'

const auth = {
  user: (state) => value.get(state, 'user'),
  loggedIn: (state) => auth.user(state) ? true : false
}

export default auth