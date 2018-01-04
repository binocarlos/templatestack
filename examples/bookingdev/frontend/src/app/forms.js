import React, { Component, PropTypes } from 'react'
import models from 'template-ui/lib/plugins2/form/models'
import fields from 'template-ui/lib/plugins2/form/fields'
import utils from 'template-ui/lib/plugins2/form/utils'

import Yaml from 'template-ui/lib/plugins2/form/components/Yaml'

import validators from 'template-tools/src/utils/validators'

import CollaboratorField from 'template-ui/lib/plugins2/installation/collaboratorField'

import apis from './api'
import config from './config'
import selectors from './selectors'

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
    selectors: selectors.auth,
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

const bookingFormCore = {
  name: {
    title: 'Name',
    validate: []
  },
  'meta.url': {
    title: 'Url'
  }
}

const bookingFormConfig = {
  'meta.yaml': Yaml({
    title: 'Yaml',
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
  bookingFormCore,
  bookingFormConfig,
}

export default forms