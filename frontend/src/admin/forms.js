import React, { Component, PropTypes } from 'react'
import models from 'template-ui/lib/plugins2/form/models'
import fields from 'template-ui/lib/plugins2/form/fields'
import utils from 'template-ui/lib/plugins2/form/utils'
import validators from 'template-tools/src/utils/validators'

import config from './config'
import tables from './tables'

import TestModal from './components/TestModal'

const authLogin = {
  username: {
    title: 'Email',
    component: fields.input,
    validate: [validators.required,validators.email]
  },
  password: {
    type: 'password',
    component: fields.input,
    validate: validators.required
  }
}

const authRegister = {
  username: {
    title: 'Email',
    component: fields.input,
    validate: [validators.required,validators.email]
  },
  password: {
    type: 'password',
    component: fields.input,
    validate: validators.required
  }
}

const layer2 = {
  name: {
    title: 'Layer2',
    component: fields.input,
    validate: [validators.required]
  }
}

const layer1 = {
  name: {
    title: 'Layer1',
    component: fields.input,
    validate: [validators.required]
  },
  others: {
    component: fields.list,
    itemTitle: 'Thing2',
    schema: layer2,
    table: tables.layer2
  }
}

const address = {
  address1: {
    title: 'Address 1',
    component: fields.input,
    validate: [validators.required]
  },
  address2: {
    title: 'Address 2',
    component: fields.input,
    validate: []
  },
  area: {
    title: 'Area',
    component: fields.input,
    validate: []
  },
  city: {
    title: 'City',
    component: fields.input,
    validate: [validators.required]
  },
  postcode: {
    title: 'Postcode',
    component: fields.input,
    validate: [validators.required]
  }
}

const project = {
  name: {
    title: 'Name',
    component: fields.input,
    validate: [validators.required]
  },
  address: {
    _include: address
  },
  test: {
    title: 'Test List',
    itemTitle: 'Thing',
    allowEdit: false,
    allowReorder: true,
    component: fields.list,
    schema: layer1,
    table: tables.layer1,
    //formHook: 'projectTest',
    itemWindowComponent: TestModal
  }
}


const forms = {
  authLogin: utils.processSchema(authLogin),
  authRegister: utils.processSchema(authRegister),
  project: utils.processSchema(project)
}

export default forms