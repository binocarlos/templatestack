import models from 'template-ui/lib/plugins2/form/models'
import fields from 'template-ui/lib/plugins2/form/fields'
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

const project = {
  name: {
    title: 'Name',
    component: fields.input,
    validate: [validators.required]
  },
  test: {
    
  }
}

const layer1 = {
  name: {
    title: 'Layer1',
    component: fields.input,
    validate: [validators.required]
  }
}

const layer2 = {
  name: {
    title: 'Layer2',
    component: fields.input,
    validate: [validators.required]
  }
}

const forms = {
  authLogin,
  authRegister,
  project
}

export default forms