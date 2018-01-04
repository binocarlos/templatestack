import React, { Component, PropTypes } from 'react'
import models from 'template-ui/lib/plugins2/form/models'
import fields from 'template-ui/lib/plugins2/form/fields'
import utils from 'template-ui/lib/plugins2/form/utils'

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

const installationCore = {
  name: {
    title: 'Name',
    validate: []
  },
  'meta.url': {
    title: 'url'
  }
}

const installationCollaborators = {
  collaborators: CollaboratorField({
    icons: config.icons,
    selectors: selectors.auth,
    api: apis.user.list,
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
}

export default forms