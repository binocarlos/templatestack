import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import BaseForm from 'template-ui/lib/plugins2/crud/containers/BaseForm'

import selectors from '../selectors'
import actions from '../actions'

import { redirects } from '../routes'

import InstallationForm from '../components/InstallationForm'

const InstallationFormContainer = BaseForm({
  name: 'installation',
  component: InstallationForm,
})

export default InstallationFormContainer