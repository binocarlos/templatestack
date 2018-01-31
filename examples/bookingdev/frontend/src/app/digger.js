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
  children: ['folder', 'settingsItem', 'appleItem'],
}

const settingsItem = {
  type: 'settingsItem',
  form: {
    type: 'normal',
    fields: forms.settingsItem
  },
  title: 'Settings Item',
  icon: icons.settings,
  leaf: true,
}

const appleItem = {
  type: 'appleItem',
  form: {
    type: 'normal',
    fields: forms.appleItem
  },
  title: 'Apple Item',
  icon: icons.settings,
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

const settingsTypes = {
  folder,
  settingsItem,
  appleItem
}

const bookingFormTypes = {
  bookingForm: bookingFormSchema
}

const settings = Factory({
  title: 'Settings',
  name: 'settings',
  api: apis.digger,
  namespace: 'settings',
  types: settingsTypes,
  icons,
  descendentType: 'folder',
  rootItem: {
    name: 'Settings',
  },
  rootTypes: ['folder', 'settingsItem']
})

const bookingForm = Factory({
  title: 'Booking Forms',
  icon: icons.bookingForm,
  name: 'bookingForm',
  api: apis.digger,
  namespace: 'bookingForm',
  types: bookingFormTypes,
  childTypes: ['bookingForm'],
  FormComponent: bookingFormForm,
  icons,
  noTree: true,
  rootItem: {
    name: 'Booking Forms',
  },
  // when saved we keep a log of previous configs
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
  settings,
  bookingForm
}

export default diggers