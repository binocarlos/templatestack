import { request } from '../../utils/ajax'
import options from 'template-tools/src/utils/options'
import authSelectors from '../auth/selectors'

const REQUIRED = [
  'url',
]

const DiggerApi = (opts = {}) => {

  opts = options.processor(opts, {
    required: REQUIRED
  })

  const BASE_URL = (state) => {
    const installationid = authSelectors.activeInstallationId(state)
    return `${opts.url}/installation/${installationid}${opts.suburl}`
  }

  const search = (payload = {}) => {
    return request({
      method: 'get',
      url: `${BASE_URL}`,
      params: {
        type: payload.type,
        search: payload.search,
        namespace: payload.namespace,
      }
    })
  }

  const children = (id) => {
    let url =  `${BASE_URL}/children`
    if(id) url += `/${id}`
    return request({
      method: 'get',
      url,
      params: {
        type: payload.type,
        search: payload.search,
        namespace: payload.namespace,
      }
    })
  }

  const descendents = (payload, state) => {
    let url =  `${BASE_URL(state)}/descendents`
    if(payload.id) url += `/${payload.id}`
    return request({
      method: 'get',
      url,
      params: {
        type: payload.type,
        search: payload.search,
        namespace: payload.namespace,
      }
    })
  }

  const links = (id) => {
    return request({
      method: 'get',
      url: `${BASE_URL}/links/${id}`
    })
  }

  const create = (payload) => {
    let url =  `${BASE_URL}`
    if(payload.id) url += `/${id}`
    return request({
      method: 'post',
      url,
      data: payload.data
    })
  }

  const load = (payload) => {
    return request({
      method: 'get',
      url: `${BASE_URL}/${payload.id}`
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
    search,
    children,
    descendents,
    links,
    create,
    load,
    save,
    del,
  }
}



export default DiggerApi