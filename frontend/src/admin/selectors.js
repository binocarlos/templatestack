import {
  getFormValues
} from 'redux-form'
import APISelector from 'template-ui/lib/plugins/api/selectors'
import AuthSelectors from 'template-ui/lib/plugins/auth/selectors'
export { default as router } from 'template-ui/lib/plugins/router/selectors'

export const values = (state) => state.value || {}
export const value = (state, name) => values(state)[name]
export const routeInfo = (state) => state.router.result

export const formValues = (name) => {
  const selector = getFormValues(name)
  const handler = (state) => {
    const ret = selector(state)
    return ret || {}
  }
  return handler
}

export const api = APISelector()
export const auth = AuthSelectors()