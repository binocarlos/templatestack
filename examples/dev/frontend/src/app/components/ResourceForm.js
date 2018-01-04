import React, { Component, PropTypes } from 'react'

import config from '../config'
import forms from '../forms'
import digger from '../digger'

import BaseForm from 'template-ui/lib/plugins2/crud/components/BaseForm'

const ResourceForm = BaseForm({
  title: 'Resource',
  getIcon: (props) => {
    const item = props.formvalues || {}
    return digger.getIcon(item)
  },
  getTitle: (props) => {
    const item = props.formvalues || {}
    if(item.id) return item.name
    const schemaTitle = digger.getTitle(item)
    return `New ${schemaTitle}`
  },
  getForm: (props) => {
    const item = props.formvalues || {}
    return digger.getForm(item)
  },
  form: forms.folder,
  icons: config.icons,
})

export default ResourceForm