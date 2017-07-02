import { createAction } from 'redux-act'
import ValueActions from 'template-ui/lib/plugins/value/actions'
import ApiActions from 'template-ui/lib/plugins/api/actions'

export const value = ValueActions()
export const api = {
  config: {
    load: ApiActions({
      name: 'config:load'
    })
  },
  user: {
    status: ApiActions({
      name: 'user:status'
    })
  }
}

export const application = {
  menuClick: createAction('menu click')
}