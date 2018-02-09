import { request } from 'template-ui/lib/utils/ajax'

import tools from './tools'

const BASE_URL = tools.installationWrapper('/bookings')

const search = (payload = {}, state) => {
  return request({
    method: 'get',
    url: `${BASE_URL(state)}`,
    params: payload
  })
}

const range = (payload = {}, state) => {
  return request({
    method: 'get',
    url: `${BASE_URL(state)}/range`,
    params: payload
  })
}

const bookingApi = {
  search,
  range,
}

export default bookingApi