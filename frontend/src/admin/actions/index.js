import { createAction } from 'redux-act'
import ValueActions from 'template-ui/lib/plugins/value/actions'
import ApiActions from 'template-ui/lib/plugins/api/actions'

export const value = {
  config: ValueActions('config'),
  initialized: ValueActions('initialized'),
  user: ValueActions('user'),
  menuOpen: ValueActions('menuOpen')
}

export const api = {
  config: {
    load: ApiActions('config_load')
  },
  user: {
    status: ApiActions('user_status')
  }
}

export const application = {
  menuClick: createAction('menu click')
}