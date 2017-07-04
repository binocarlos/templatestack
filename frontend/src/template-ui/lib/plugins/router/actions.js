import { PUSH } from 'redux-little-router'

export const TYPES = {
  push: PUSH,
  changed: 'ROUTER_LOCATION_CHANGED',
  redirect: 'ROUTER_REDIRECT'
}

const RouterActions = {
  _types: TYPES,
  push: (payload) => ({
    type: TYPES.push,
    payload
  }),
  redirect: (name, payload) => ({
    type: TYPES.redirect,
    name,
    payload
  })
}

export default RouterActions