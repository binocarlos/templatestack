import { request } from 'template-ui/lib/utils/ajax'
import tools from './tools'

const BASE_URL = '/admin/user'

export const list = (payload = {}) => {
  return request({
    method: 'get',
    url: tools.url(`${BASE_URL}`),
    params: {
      
    }
  })
}

export const loadToken = (payload = {}) => {
  return request({
    method: 'get',
    url: tools.url(`/auth/token`),
  })
}

export const refreshToken = (payload = {}) => {
  return request({
    method: 'get',
    url: tools.url(`/auth/refreshtoken`),
  })
}

export const get = (id) => {
  return request({
    method: 'get',
    url: tools.url(`${BASE_URL}/${id}`)
  })
}

export const save = (payload) => {
  return request({
    method: 'put',
    url: tools.url(`${BASE_URL}/${payload.id}`),
    data: payload.data
  })
}

const userApi = {
  list,
  loadToken,
  refreshToken,
  get,
  save,
}

export default userApi