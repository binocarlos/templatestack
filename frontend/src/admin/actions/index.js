import ApiActions from 'template-ui/lib/plugins/api/actions'
import ValueActions from 'template-ui/lib/plugins/value/actions'

export const value = ValueActions()
export const apis = {
  config: ApiActions({name: 'config'})
}