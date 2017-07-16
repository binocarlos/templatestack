import { createAction } from 'redux-act'

import ApiActions from 'template-ui/lib/plugins/api/actions'
import RouterActions from 'template-ui/lib/plugins/router/actions'
import ValueActions from 'template-ui/lib/plugins/value/actions'
import AuthActions from 'template-ui/lib/plugins/auth/actions'

export const value = ValueActions

const apiBase = ApiActions()
export const api = {
  _types: apiBase._genericTypes,
  config: {
    load: apiBase('config_load', {keepPayload:true})
  }
}

export const auth = AuthActions()

export const events = {
  menuClick: createAction('menu click')
}

export const router = RouterActions