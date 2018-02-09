import React, { Component, PropTypes } from 'react'

import Factory from 'template-ui/lib/plugins2/digger/factory'
import TabForm from 'template-ui/lib/plugins2/crud/components/TabForm'
import yaml from 'template-ui/lib/utils/yaml'

import apitools from './api/tools'
import config from './config'
import forms from './forms'
import apis from './api'

const icons = config.icons

const template = {
  type: 'template',
  form: {
    type: 'normal',
    fields: forms.template
  },
  title: 'Template',
  icon: icons.template,
  leaf: true,
}

const bookingFormSchema = {
  type: 'bookingForm',
  form: {
    type: 'normal',
    fields: forms.bookingFormCore
  },
  title: 'Booking Form',
  icon: icons.bookingForm,
  leaf: true,
}

const BookingTabForm = TabForm({
  title: 'Booking Form',
  icon: icons.bookingForm,
  tabs: [{
    label: 'Details',
    fields: forms.bookingFormCore
  }, {
    label: 'Calendar',
    fields: forms.bookingFormCalendar
  }, {
    label: 'Options',
    fields: forms.bookingFormOptions
  }, {
    label: 'Info',
    fields: forms.bookingFormInfo
  }],
  icons: config.icons,
})

const configTypes = {
  template,
  bookingForm: bookingFormSchema
}

const CONFIG_ROOT_ITEMS = [{
  name: 'Booking Forms',
  namespace: 'bookingForm',
  icon: icons.bookingForm,
  type: 'root',
  rootTypes: ['bookingForm'],
}, {
  name: 'Templates',
  namespace: 'templates',
  icon: icons.template,
  root: true,
  type: 'root',
  rootTypes: ['template'],
}]

const configDigger = Factory({
  title: 'Config',
  icon: icons.settings,
  name: 'config',
  api: apis.digger,
  types: configTypes,
  icons,
  noSearch: true,
  descendentType: 'folder',
  getNamespace: (state) => {
    return state.router.params.namespace
  },
  // we choose which FormComponent to inject
  // based on our props
  getFormComponent: (props, BaseComponent) => {
    const values = props.formvalues || {}
    return values.type == 'bookingForm' ? BookingTabForm : BaseComponent
  },
  getRootItems: (data, state) => {
    const namespace = state.router.params.section
    const rootItems = CONFIG_ROOT_ITEMS.map(item => {
      let ret = Object.assign({}, item)
      ret.children = ret.namespace == namespace ? data : []
      return ret
    })
    return rootItems
  },
  getRootTypes: (item) => {
    const ROOT_ITEM = CONFIG_ROOT_ITEMS.filter(i => i.namespace == item.namespace)[0] || {}
    return ROOT_ITEM.rootTypes || []
  }
})

const diggers = {
  config: configDigger
}

export default diggers