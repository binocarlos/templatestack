import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import BaseList from 'template-ui/lib/plugins2/crud/containers/BaseList'

import selectors from '../selectors'
import actions from '../actions'
import config from '../config'

import { redirects } from '../routes'

import InstallationList from '../components/InstallationList'

const InstallationListContainer = BaseList({
  name: 'installation',
  component: InstallationList,
  actions: actions.installation,
  selectors: selectors.installation,
  icons: config.icons,
})

export default InstallationListContainer