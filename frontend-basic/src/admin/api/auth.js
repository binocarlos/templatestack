import { request } from 'template-ui/lib/utils/ajax'
import tools from './tools'

export const status = (payload) => {
  return request({
    url: tools.url('/auth/status')
  })
}

export const login = (payload) => {
  return request({
    method: 'post',
    url: tools.url('/auth/login'),
    data: payload
  })
}

export const register = (payload) => {
  return request({
    method: 'post',
    url: tools.url('/auth/register'),
    data: payload
  })
}

const userApi = {
  status,
  login,
  register
}

export default userApi