import React, { Component, PropTypes } from 'react'

import config from '../config'
import forms from '../forms'

import BaseForm from 'template-ui/lib/plugins2/crud/components/BaseForm'

const UserForm = BaseForm({
  title: 'User',
  icon: config.icons.users,
  form: forms.user,
  icons: config.icons,
})

export default UserForm