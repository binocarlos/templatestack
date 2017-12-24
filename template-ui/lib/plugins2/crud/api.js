import { request } from '../../utils/ajax'
import options from 'template-tools/src/utils/options'

const REQUIRED = [
  'url',
]

const CrudApi = (opts = {}) => {

  opts = options.processor(opts, {
    required: REQUIRED
  })

  const BASE_URL = opts.url

  const list = (payload = {}) => {
    return request({
      method: 'get',
      url: `${BASE_URL}`,
      params: {
        
      }
    })
  }

  const get = (id) => {
    return request({
      method: 'get',
      url: `${BASE_URL}/${id}`
    })
  }

  const create = (payload) => {
    return request({
      method: 'post',
      url: `${BASE_URL}`,
      data: payload.data
    })
  }

  const save = (payload) => {
    return request({
      method: 'put',
      url: `${BASE_URL}/${payload.id}`,
      data: payload.data
    })
  }

  const del = (payload) => {
    return request({
      method: 'delete',
      url: `${BASE_URL}/${payload.id}`
    })
  }

  return {
    list,
    get,
    create,
    save,
    del
  }
}



export default CrudApi