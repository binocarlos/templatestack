import { request } from '../../utils/ajax'
import options from 'template-tools/src/utils/options'

const REQUIRED = [
  'url',
]

const AuthApi = (opts = {}) => {

  opts = options.processor(opts, {
    required: REQUIRED
  })

  const BASE_URL = opts.url

  const status = (payload) => {
    return request({
      url: `${BASE_URL}/status`
    })
  }

  const login = (payload) => {
    return request({
      method: 'post',
      url: `${BASE_URL}/login`,
      data: payload
    })
  }

  const register = (payload) => {
    return request({
      method: 'post',
      url: `${BASE_URL}/register`,
      data: payload
    })
  }


  const loadToken = (payload = {}) => {
    return request({
      method: 'get',
      url: `${BASE_URL}/token`,
    })
  }

  const refreshToken = (payload = {}) => {
    return request({
      method: 'get',
      url: `${BASE_URL}/refreshtoken`,
    })
  }

  const update = (payload = {}) => {
    return request({
      method: 'put',
      url: `${BASE_URL}/update`,
      data: payload
    })
  }


  return {
    status,
    login,
    register,
    loadToken,
    refreshToken,
    update,
  }
}



export default AuthApi