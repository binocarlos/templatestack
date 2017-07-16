import { request } from 'template-ui/lib/utils/ajax'
import config from '../config'
const url = (path) => config.api + path

export const status = (payload) => {
  return request({
    url: url('/auth/status')
  })
}

export const login = (payload) => {
  return request({
    method: 'post',
    url: url('/auth/login'),
    data: payload
  })
}

export const register = (payload) => {
  return request({
    method: 'post',
    url: url('/auth/register'),
    data: payload
  })
}

const userApi = {
  status,
  login,
  register
}

export default userApi