import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import BaseForm from 'template-ui/lib/plugins2/crud/containers/BaseForm'

import selectors from '../selectors'
import actions from '../actions'
import digger from '../digger'

import { redirects } from '../routes'

import ResourceForm from '../components/ResourceForm'

const ResourceFormContainer = BaseForm({
  name: 'resource',
  component: ResourceForm,
  getIcon: (props) => {
    return digger.getIcon(props.data)
  },
  getForm: (props) => {
    const item = props.data
    return digger.getType(item.type)
  }
})

export default ResourceFormContainer