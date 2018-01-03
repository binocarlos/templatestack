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

  const search = (payload = {}, state) => {
    return request({
      method: 'get',
      url: `${BASE_URL(state)}`,
      params: {
        type: payload.type,
        search: payload.search,
        namespace: payload.namespace,
      }
    })
  }

  const children = (payload = {}, state) => {
    let url =  `${BASE_URL(state)}/children`
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

  const descendents = (payload = {}, state) => {
    let url =  `${BASE_URL(state)}/descendents`
    if(payload.id) url += `/${payload.id}`
    return request({
      method: 'get',
      url,
      params: {
        type: payload.type,
        search: payload.search,
        namespace: payload.namespace,
        tree: payload.tree ? 'y' : ''
      }
    })
  }

  const links = (payload = {}, state) => {
    return request({
      method: 'get',
      url: `${BASE_URL(state)}/links/${payload.id}`
    })
  }

  const create = (payload = {}, state) => {
    let url =  `${BASE_URL(state)}`
    if(payload.id) url += `/${payload.id}`
    return request({
      method: 'post',
      url,
      data: payload.data
    })
  }

  const load = (payload = {}, state) => {
    return request({
      method: 'get',
      url: `${BASE_URL(state)}/${payload.id}`
    })
  }

  const save = (payload = {}, state) => {
    return request({
      method: 'put',
      url: `${BASE_URL(state)}/${payload.id}`,
      data: payload.data
    })
  }

  const del = (payload = {}, state) => {
    return request({
      method: 'delete',
      url: `${BASE_URL(state)}/${payload.id}`
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