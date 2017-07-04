import { createAction } from 'redux-act'
import ValueActions from 'template-ui/lib/plugins/value/actions'
import ApiActions from 'template-ui/lib/plugins/api/actions'
import RouterActions from 'template-ui/lib/plugins/router/actions'

// generic state store (set/toggle)
export const value = {
  config: ValueActions('config'),
  initialized: ValueActions('initialized'),
  user: ValueActions('user'),
  menuOpen: ValueActions('menuOpen')
}

// generic api actions (request -> response || error)
export const api = {
  config: {
    load: ApiActions('config_load')
  },
  user: {
    status: ApiActions('user_status')
  }
}

// trigger actions (we use the createAction tool for these)
export const events = {
  menuClick: createAction('menu click')
}

export const router = RouterActions