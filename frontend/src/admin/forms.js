import formWrapper from 'template-ui/lib/plugins/form/wrapper'
import models from 'template-ui/lib/plugins/form/models'
import fields from 'template-ui/lib/plugins/form/fields'
import validators from 'template-ui/lib/plugins/form/validators'

const authLogin = formWrapper({
  name: 'authLogin',
  fields: {
    username: models.string({
      title: 'Email',
      component: fields.input,
      validate: [validators.required,validators.email]
    }),
    password: models.string({
      type: 'password',
      component: fields.input,
      validate: validators.required
    })
  }
})

const authRegister = formWrapper({
  name: 'authRegister',
  fields: {
    username: models.string({
      title: 'Email',
      component: fields.input,
      validate: [validators.required,validators.email]
    }),
    password: models.string({
      type: 'password',
      component: fields.input,
      validate: validators.required
    })
  }
})

const forms = {
  authLogin,
  authRegister
}

export default forms