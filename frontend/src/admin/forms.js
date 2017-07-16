import models from 'template-ui/lib/plugins/form/models'
import fields from 'template-ui/lib/plugins/form/fields'
import validators from 'template-ui/lib/plugins/form/validators'

const register = {
  username: {
    title: 'Email',
    component: fields.input,
    validate: [validators.required,validators.email]
  },
  password: models.string({
    type: 'password',
    component: fields.input,
    validate: validators.required
  })
}

const login = {
  username: {
    component: fields.input,
    validate: [validators.required,validators.email]
  },
  password: models.string({
    type: 'password',
    component: fields.input,
    validate: validators.required
  })
}

const forms = {
  register,
  login
}

export default forms