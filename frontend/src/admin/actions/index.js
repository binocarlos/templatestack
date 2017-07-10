import { createAction } from 'redux-act'
import ValueActions from 'template-ui/lib/plugins/value/actions'
import ApiActions from 'template-ui/lib/plugins/api/actions'
import RouterActions from 'template-ui/lib/plugins/router/actions'

export const base = {
  value: ValueActions(),
  api: ApiActions()
}

export const value = {
  _types: base.value._genericTypes,
  config: base.value('config'),
  initialized: base.value('initialized'),
  user: base.value('user'),
  menuOpen: base.value('menuOpen'),
  loginError: base.value('loginError'),
  registerError: base.value('registerError')
}

export const api = {
  _types: base.api._genericTypes,
  config: {
    load: base.api('config_load', {keepPayload:true})
  },
  user: {
    status: base.api('user_status', {keepPayload:true}),
    login: base.api('login', {keepPayload:true}),
    register: base.api('register', {keepPayload:true})
  }
}

export const events = {
  menuClick: createAction('menu click')
}

export const router = RouterActions