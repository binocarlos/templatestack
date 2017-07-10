import models from 'template-ui/lib/plugins/form/models'
import fields from 'template-ui/lib/plugins/form/fields'
import validators from 'template-ui/lib/plugins/form/validators'

const register = {
  email: {
    component: fields.input,
    validate: [validators.required,validators.email]
  },
  password: models.string({
    component: fields.input,
    validate: validators.required
  })
}

const login = {
  email: {
    component: fields.input,
    validate: [validators.required,validators.email]
  },
  password: models.string({
    component: fields.input,
    validate: validators.required
  })
}

const forms = {
  register,
  login
}

export default forms