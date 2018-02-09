import { createAction } from 'redux-act'

import router from 'template-ui/lib/plugins2/router/actions'
import value from 'template-ui/lib/plugins2/value/actions'
import form from 'template-ui/lib/plugins2/form/actions'
import system from 'template-ui/lib/plugins2/system/actions'

import forms from './forms'

const events = {
  menuClick: createAction('menu click')
}

const bookingForms = {
  setList: val => value.set('bookingForms', val),
}

const actions = {
  system,
  router,
  value,
  form,
  events,
  formutils: {
    // utility to touch all by name
    touchAll: (name) => form.touchAll(name, forms[name])
  },
  bookingForms,
}

export default actions