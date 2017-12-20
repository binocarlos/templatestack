import { request } from 'template-ui/lib/utils/ajax'
import tools from './tools'

export const status = (payload) => {
  return request({
    url: tools.url('/auth/status')
  })
}

export const login = (payload) => {
  return new Promise((resolve, reject) => {
    reject('This is not implemented but needs to be defined')
  })
}

export const register = (payload) => {
  return new Promise((resolve, reject) => {
    reject('This is not implemented but needs to be defined')
  })
}

const userApi = {
  status,
  login,
  register,
}

export default userApi