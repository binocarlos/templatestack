import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import BaseList from 'template-ui/lib/plugins2/crud/containers/BaseList'

import selectors from '../selectors'
import actions from '../actions'
import config from '../config'

import { redirects } from '../routes'

import ResourceList from '../components/ResourceList'

const ResourceListContainer = BaseList({
  name: 'resource',
  component: ResourceList,
  actions: actions.resource,
  selectors: selectors.resource,
  icons: config.icons,
  getProps: (state, ownProps) => {
    const selectedTreeItem = selectors.resource.tree.selectedItem(state)
    return {
      selectedTreeItem
    }
  }
})

export default ResourceListContainer