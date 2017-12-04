import { createAction } from 'redux-act'

import router from 'template-ui/lib/plugins2/router/actions'
import value from 'template-ui/lib/plugins2/value/actions'
import form from 'template-ui/lib/plugins2/form/actions'
import system from 'template-ui/lib/plugins2/system/actions'

import forms from './forms'

const events = {
  menuClick: createAction('menu click')
}

const project = {
  list: {
    setData: (data) => value.set('projectList', data),
    setSelected: (data) => value.set('projectSelected', data),
    setDeleteWindow: (val) => value.set('projectDeleteWindowOpen', val),
  }
}

const actions = {
  system,
  router,
  value,
  form,
  events,
  project,
  formutils: {
    // utility to touch all by name
    touchAll: (name) => form.touchAll(name, forms[name])
  }
}

export default actions