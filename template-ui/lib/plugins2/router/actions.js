import { PUSH } from 'redux-little-router'

export const TYPES = {
  push: PUSH,
  changed: 'ROUTER_LOCATION_CHANGED',
  redirect: 'ROUTER_REDIRECT',
  hook: 'ROUTER_HOOK'
}

const RouterActions = {
  _types: TYPES,
  push: (payload) => ({
    type: TYPES.push,
    payload
  }),
  redirect: (name) => ({
    type: TYPES.redirect,
    name
  }),
  hook: (name, payload) => ({
    type: TYPES.hook,
    name,
    payload
  }),
  change: (payload) => ({
    type: TYPES.changed,
    payload
  })
}

export default RouterActions