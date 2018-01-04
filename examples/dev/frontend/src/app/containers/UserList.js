import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import BaseList from 'template-ui/lib/plugins2/crud/containers/BaseList'

import selectors from '../selectors'
import actions from '../actions'
import config from '../config'

import { redirects } from '../routes'

import UserList from '../components/UserList'

const UserListContainer = BaseList({
  name: 'user',
  component: UserList,
  actions: actions.user,
  selectors: selectors.user,
  icons: config.icons,
})

export default UserListContainer