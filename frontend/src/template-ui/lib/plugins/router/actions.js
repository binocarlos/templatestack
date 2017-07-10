import { PUSH } from 'redux-little-router'

export const TYPES = {
  push: PUSH,
  changed: 'ROUTER_LOCATION_CHANGED',
  redirect: 'ROUTER_REDIRECT',
  trigger: 'ROUTER_TRIGGER'
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
  }),
  trigger: (name, payload) => ({
    type: TYPES.trigger,
    name,
    payload
  }),
  change: (payload) => ({
    type: TYPES.changed,
    payload
  })
}

export default RouterActions