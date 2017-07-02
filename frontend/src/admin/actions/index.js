import { createAction } from 'redux-act'
import ValueActions from 'template-ui/lib/plugins/value/actions'
import ApiActions from 'template-ui/lib/plugins/api/actions'

export const value = ValueActions()
export const api = {
  config: {
    get: ApiActions({
      name: 'getConfig',
      keepPayload: true
    })
  },
  user: {
    get: ApiActions({
      name: 'getUser'
    })
  }
}

export const application = {
  menuClick: createAction('menu click')
}