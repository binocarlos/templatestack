import { createAction } from 'redux-act'

import router from 'template-ui/lib/plugins2/router/actions'
import value from 'template-ui/lib/plugins2/value/actions'
import form from 'template-ui/lib/plugins2/form/actions'
import system from 'template-ui/lib/plugins2/system/actions'
import Crud from 'template-ui/lib/plugins2/crud/actions'
import Digger from 'template-ui/lib/plugins2/digger/actions'

import forms from './forms'

const events = {
  menuClick: createAction('menu click')
}

const user = Crud({
  name: 'user'
})

const installation = Crud({
  name: 'installation'
})

const resource = Digger({
  name: 'resource'
})

const actions = {
  system,
  router,
  value,
  form,
  events,
  user,
  installation,
  resource,
  formutils: {
    // utility to touch all by name
    touchAll: (name) => form.touchAll(name, forms[name])
  }
}

export default actions