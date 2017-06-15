
import Ajax from 'boiler-ui/lib/api/ajax'
import Crud from 'boiler-ui/lib/api/crud'
import UserSelectors from 'boiler-ui/lib/plugins/user/selectors'

import URLS from './urls'

const userSelectors = UserSelectors(state => state.user)

const urlInjector = (baseurl) => (req, query) => {
  req.url = baseurl + req.url
  return req
}
// functions we run each query object via before it hits Ajax
// they inject the base url and the installation id
const mapfns = {
  booking: urlInjector(URLS.booking)
}

const user = {
  status: (query) => Ajax({
    method: 'get',
    url: URLS.user.status
  }),

  login: (query) => Ajax({
    method: 'post',
    url: URLS.user.login,
    data: query.data
  })
}

const BasicCrud = (map) => {
  return {
    list: (query) => {
      return Ajax(map(Crud.list(query), query))
    },
    get: (query) => Ajax(map(Crud.get(query), query)),
    post: (query) => Ajax(map(Crud.post(query), query)),
    put: (query) => Ajax(map(Crud.put(query), query)),
    delete: (query) => {
      return Crud.delete(query)
        .map(req => map(req, query))
        .map(Ajax)
    }
  }
}

const config = {
  get: () => Ajax({
    method: 'get',
    url: URLS.config
  })
}

const booking = BasicCrud(mapfns.booking)

booking.range = (query) => {
  return Ajax({
    method: 'get',
    url: URLS.bookingrange,
    params: query.params
  })
}

const apis = {
  user,
  config,
  booking
}

export default apis