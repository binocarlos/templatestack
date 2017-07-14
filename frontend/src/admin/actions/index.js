import { createAction } from 'redux-act'

import ApiActions from 'template-ui/lib/plugins/api/actions'
import RouterActions from 'template-ui/lib/plugins/router/actions'
import ValueActions from 'template-ui/lib/plugins/value/actions'

export const value = ValueActions

const apiBase = ApiActions()
export const api = {
  _types: apiBase._genericTypes,
  config: {
    load: apiBase('config_load', {keepPayload:true})
  },
  user: {
    status: apiBase('user_status', {keepPayload:true}),
    login: apiBase('login', {keepPayload:true}),
    register: apiBase('register', {keepPayload:true})
  }
}

export const events = {
  menuClick: createAction('menu click')
}

export const router = RouterActions