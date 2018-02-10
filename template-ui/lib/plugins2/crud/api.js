import { request } from '../../utils/ajax'
import options from 'template-tools/src/utils/options'

const REQUIRED = [
  
]

const CrudApi = (opts = {}) => {

  opts = options.processor(opts, {
    required: REQUIRED
  })

  const BASE_URL = opts.url

  const defaultGetUrl = (state) => BASE_URL

  const getUrl = opts.getUrl || defaultGetUrl

  const list = (payload = {}, state) => {
    return request({
      method: 'get',
      url: `${getUrl(state)}`,
      params: {
        search: payload.search 
      }
    })
  }

  const get = (payload, state) => {
    return request({
      method: 'get',
      url: `${getUrl(state)}/${payload.id}`
    })
  }

  const create = (payload, state) => {
    return request({
      method: 'post',
      url: `${getUrl(state)}`,
      data: payload.data
    })
  }

  const save = (payload, state) => {
    return request({
      method: 'put',
      url: `${getUrl(state)}/${payload.id}`,
      data: payload.data
    })
  }

  const del = (payload, state) => {
    return request({
      method: 'delete',
      url: `${getUrl(state)}/${payload.id}`
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