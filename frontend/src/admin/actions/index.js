import ValueActions from 'template-ui/lib/plugins/value/actions'
import ApiActions from 'template-ui/lib/plugins/api/actions'

export const value = ValueActions()
export const api = {
  config: ApiActions({name: 'config'})
}