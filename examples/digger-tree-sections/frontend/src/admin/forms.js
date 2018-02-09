import React, { Component, PropTypes } from 'react'
import models from 'template-ui/lib/plugins2/form/models'
import fields from 'template-ui/lib/plugins2/form/fields'
import utils from 'template-ui/lib/plugins2/form/utils'
import dateLight from 'template-tools/src/utils/dateLight'

import validators from 'template-tools/src/utils/validators'
import authSelectors from 'template-ui/lib/plugins2/auth/selectors'

import CollaboratorField from 'template-ui/lib/plugins2/installation/collaboratorField'

import apis from './api'
import config from './config'

const alphaNumeric = value =>
  value && /[^a-zA-Z0-9]/i.test(value)
    ? 'Only alphanumeric characters'
    : undefined

const Yaml = (opts) => {
  return models.yaml(Object.assign({}, {
    component: fields.input,
  }, opts))
}

const auth = {
  username: {
    title: 'Email',
    component: fields.input,
    validate: [validators.required,validators.email]
  },
  password: {
    type: 'password',
    validate: validators.required
  }
}

const authLogin = auth
const authRegister = auth

const user = {
  id: {
    title: 'ID'
  },
  name: {
    title: 'Name',
    validate: []
  }
}

const installationCore = {
  name: {
    title: 'Name',
    validate: []
  },
}

const installationCollaborators = {
  collaborators: CollaboratorField({
    icons: config.icons,
    selectors: authSelectors,
    api: apis.user.list,
  })
}

/*

  digger
  
*/


const folder = {
  name: {
    title: 'Name',
    validate: []
  }
}

const item = {
  name: {
    title: 'Name',
    validate: []
  },
  'meta.comment': {
    title: 'Comment'
  }
}


const template = {
  name: {
    title: 'Name',
    validate: []
  },
  'meta.yaml': Yaml({
    title: 'Yaml',
  })
}


const calendar = {
  name: {
    title: 'Name',
    validate: []
  },
  'meta.yaml': Yaml({
    title: 'Yaml',
  })
}

const bookingFormCore = {
  name: {
    title: 'Name',
    validate: [validators.required],
  },
  'meta.url': {
    title: 'Url',
    validate: [validators.required,alphaNumeric],
  },
}

const bookingFormCalendar = {
  'meta.calendarDriver': {
    title: 'Driver',
    component: fields.select,
    source: ['blockBooking', 'ticketBooking'],
    validate: [validators.required],
  },
  'meta.calendarConfig': Yaml({
    title: 'Yaml',
  })
}

const bookingFormOptions = {
  'meta.optionConfig': Yaml({
    title: 'Yaml',
  })
}

const bookingFormInfo = {
  'meta.infoConfig': Yaml({
    title: 'Yaml',
  })
}

const calendarSearch = {
  'start': models.date({
    component: fields.date,
    default: dateLight.sqlDate(new Date(), true)
  }),
  'days': models.number({
    component: fields.input,
    default: 5,
    validate: [
      validators.required,
      validators.numeric,
      validators.integer,
      validators.unsigned
    ]
  })
}

const forms = {
  authLogin,
  authRegister,
  user,
  installationCore,
  installationCollaborators,
  folder,
  item,
  template,
  calendar,
  bookingFormCore,
  bookingFormCalendar,
  bookingFormOptions,
  bookingFormInfo,
  calendarSearch,
  
}

export default forms