import { createAction } from 'redux-act'
import ValueActions from 'template-ui/lib/plugins/value/actions'
import ApiActions from 'template-ui/lib/plugins/api/actions'
import RouterActions from 'template-ui/lib/plugins/router/actions'

const valueActions = ValueActions()
const apiActions = ApiActions()

// generic state store (set/toggle)
export const value = {
  config: valueActions('config'),
  initialized: valueActions('initialized'),
  user: valueActions('user'),
  menuOpen: valueActions('menuOpen'),
  test: valueActions('test')
}

// generic api actions (request -> response || error)
export const api = {
  config: {
    load: apiActions('config_load', {keepPayload:true})
  },
  user: {
    status: apiActions('user_status', {keepPayload:true})
  }
}

// trigger actions (we use the createAction tool for these)
export const events = {
  menuClick: createAction('menu click')
}

export const router = RouterActions