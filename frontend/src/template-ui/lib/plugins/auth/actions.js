import { createAction } from 'redux-act'

import ApiActions from '../api/actions'

const AuthActions = (opts = {}) => {
  const apiBase = ApiActions()
  return {
    status: apiBase('auth_status', {keepPayload:true}),
    login: apiBase('auth_login', {keepPayload:true}),
    register: apiBase('auth_register', {keepPayload:true})
  }
}

export default AuthActions