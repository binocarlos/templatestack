import models from 'template-ui/lib/plugins/form/models'
import fields from 'template-ui/lib/plugins/form/fields'

const register = {
  username: {
    component: fields.input
  },
  password: models.string({
    component: fields.input
  })
}

const login = {
  username: {
    component: fields.input
  },
  password: models.string({
    component: fields.input
  })
}

const forms = {
  register,
  login
}

export default forms