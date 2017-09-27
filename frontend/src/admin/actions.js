import { createAction } from 'redux-act'

import forms from './forms'

import ApiActions from 'template-ui/lib/plugins/api/actions'
import RouterActions from 'template-ui/lib/plugins/router/actions'
import ValueActions from 'template-ui/lib/plugins/value/actions'
import AuthActions from 'template-ui/lib/plugins/auth/actions'
import FormActions from 'template-ui/lib/plugins/form/actions'
import { actions as apiActions } from './api'

export const value = ValueActions
export const api = apiActions
export const auth = AuthActions()

export const router = RouterActions
export const form = FormActions(forms)

export const events = {
  menuClick: createAction('menu click')
}