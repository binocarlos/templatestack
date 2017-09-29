import React, { Component, PropTypes } from 'react'
import models from 'template-ui/lib/plugins2/form/models'
import fields from 'template-ui/lib/plugins2/form/fields'
import utils from 'template-ui/lib/plugins2/form/utils'
import validators from 'template-tools/src/utils/validators'

import config from './config'
import tables from './tables'

import TestModal from './components/TestModal'

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

const layer2 = {
  name: {
    title: 'Layer2',
    validate: [validators.required]
  }
}

const layer1 = {
  name: {
    title: 'Layer1',  
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
    validate: [validators.required]
  },
  address2: {
    title: 'Address 2',
    validate: []
  },
  area: {
    title: 'Area',
    validate: []
  },
  city: {
    title: 'City',
    validate: [validators.required]
  },
  postcode: {
    title: 'Postcode',
    validate: [validators.required]
  }
}

const options = {
  newsletter: {
    title: 'Get newsletter?',
    component: fields.checkbox
  },
  topics: {
    title: 'Topics',
    horizontal: true,
    component: fields.multipleCheckbox,
    source: ['science', 'art', 'history']
  },
  cost: models.number({
    title: 'Cost'
  }),
  format: {
    title: 'Format',
    horizontal: true,
    component: fields.radio,
    source: ['A4', 'A3', 'A5']
  },
  country: {
    title: 'Country',
    component: fields.select,
    source: ['UK', 'France', 'SPain']
  },
  about: {
    title: 'Read This!',
    notes: 'This is some text',
    component: fields.notes
  },
  notes: {
    title: 'Notes',
    multiline: true,
    rows: 5
  }
}

const project = utils.composeParts([{
  name: {
    title: 'Name',
    validate: [validators.required]
  },
  options: {
    containerComponent: fields.section,
    schema: options
  }
},
address,
{
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
}])


const forms = {
  authLogin,
  authRegister,
  project
}

export default forms