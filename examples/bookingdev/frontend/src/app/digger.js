import React, { Component, PropTypes } from 'react'

import Factory from 'template-ui/lib/plugins2/digger/factory'
import TabForm from 'template-ui/lib/plugins2/crud/components/TabForm'
import yaml from 'template-ui/lib/utils/yaml'

import apitools from './api/tools'
import config from './config'
import forms from './forms'
import apis from './api'

const icons = config.icons

const folder = {
  type: 'folder',
  form: {
    type: 'normal',
    fields: forms.folder
  },
  title: 'Folder',
  icon: icons.folder,
  children: ['folder', 'item'],
}

const item = {
  type: 'item',
  form: {
    type: 'normal',
    fields: forms.item
  },
  title: 'Item',
  icon: icons.item,
  leaf: true,
}

const bookingFormSchema = {
  type: 'bookingForm',
  form: {
    type: 'normal',
    fields: forms.bookingForm
  },
  title: 'Booking Form',
  icon: icons.bookingForm,
  leaf: true,
}

const bookingFormForm = TabForm({
  title: 'Booking Form',
  icon: icons.bookingForm,
  tabs: [{
    label: 'Details',
    fields: forms.bookingFormCore
  }, {
    label: 'Config',
    fields: forms.bookingFormConfig
  }],
  icons: config.icons,
})

const resourceTypes = {
  folder,
  item,
}

const bookingFormTypes = {
  bookingForm: bookingFormSchema
}

const resource = Factory({
  title: 'Resource',
  name: 'resource',
  api: apis.resource,
  namespace: 'resource',
  types: resourceTypes,
  icons,
  descendentType: 'folder',
  rootItem: {
    name: 'Resources',
  }
})

const bookingForm = Factory({
  title: 'Booking Forms',
  icon: icons.bookingForm,
  name: 'bookingForm',
  api: apis.resource,
  namespace: 'bookingForm',
  types: bookingFormTypes,
  childTypes: ['bookingForm'],
  FormComponent: bookingFormForm,
  icons,
  noTree: true,
  rootItem: {
    name: 'Booking Forms',
  },
  mapData: (data) => {
    const parsed = yaml.load(data.meta.yaml)
    if(parsed.error) {
      alert(parsed.error)
      return data
    }
    data.meta.config = parsed.doc
    return data
  }
})

const diggers = {
  resource,
  bookingForm
}

export default diggers