import React, { Component, PropTypes } from 'react'

import FormContainer from 'template-ui/lib/plugins/form/Container'
import forms from '../forms'

const LoginForm = FormContainer({
  name: 'login',
  fields: forms.login
})

export default LoginForm
