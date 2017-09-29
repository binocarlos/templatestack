import models from 'template-ui/lib/plugins/form/models'
import fields from 'template-ui/lib/plugins/form/fields'
import validators from 'template-tools/src/utils/validators'

const authLogin = {
  username: {
    title: 'Email',
    component: fields.input,
    validate: [validators.required,validators.email]
  },
  password: {
    type: 'password',
    component: fields.input,
    validate: validators.required
  }
}

const authRegister = {
  username: {
    title: 'Email',
    component: fields.input,
    validate: [validators.required,validators.email]
  },
  password: {
    type: 'password',
    component: fields.input,
    validate: validators.required
  }
}

const installation = {
  name: {
    title: 'Name',
    component: fields.input,
    validate: [validators.required]
  },
  test: {}
}

const forms = {
  authLogin,
  authRegister,
  installation
}

export default forms