import value from '../value/selectors'
import router from '../router/selectors'

const system = {
  message: (state) => value.get(state, 'message'),
  initialized: (state) => value.get(state, 'initialized'),
  menuOpen: (state) => value.get(state, 'menuOpen'),
  manualScroll: (state) => router.firstValue(state, 'manualScroll')
}

export default system