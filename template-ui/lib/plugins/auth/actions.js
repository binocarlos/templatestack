import { createAction } from 'redux-act'

import ApiActions from '../api/actions'

const AuthActions = (opts = {}) => {
  const apiBase = ApiActions()
  return {
    status: apiBase('authStatus', {keepPayload:true}),
    login: apiBase('authLogin', {keepPayload:true}),
    register: apiBase('authRegister', {keepPayload:true})
  }
}

export default AuthActions