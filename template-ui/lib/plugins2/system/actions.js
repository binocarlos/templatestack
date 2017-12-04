import value from '../value/actions'

const SystemActions = {
  message: (text) => value.set('message', text),
  toggleMenu: () => value.toggle('menuOpen'),
  setMenu: (val) => value.set('menuOpen', val),
  initialized: () => value.set('initialized', true)
}

export default SystemActions