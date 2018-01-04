import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import BaseTree from 'template-ui/lib/plugins2/digger/containers/BaseTree'

import selectors from '../selectors'
import actions from '../actions'

import { redirects } from '../routes'

import ResourceTree from '../components/ResourceTree'

const ResourceTreeContainer = BaseTree({
  name: 'resource',
  component: ResourceTree,
  actions: actions.resource,
  selectors: selectors.resource,
})

export default ResourceTreeContainer