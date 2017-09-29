import { request } from 'template-ui/lib/utils/ajax'
import tools from './tools'

export const list = (payload) => {
  return request({
    url: tools.url('/installation')
  })
}

export const get = (id) => {
  return request({
    method: 'get',
    url: tools.url(`/installation/${id}`)
  })
}

export const create = (payload) => {
  return request({
    method: 'post',
    url: tools.url('/installation'),
    data: payload
  })
}

export const save = (payload) => {
  return request({
    method: 'put',
    url: tools.url(`/installation/${payload.id}`),
    data: payload.data
  })
}

export const del = (id) => {
  return request({
    method: 'delete',
    url: tools.url(`/installation/${id}`)
  })
}

export const activate = (id) => {
  return request({
    method: 'put',
    url: tools.url(`/installation/activate/${id}`)
  })
}

const installationApi = {
  list,
  get,
  create,
  save,
  del,
  activate
}

export default installationApi