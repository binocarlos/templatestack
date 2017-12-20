import React, { Component, PropTypes } from 'react'
import models from 'template-ui/lib/plugins2/form/models'
import fields from 'template-ui/lib/plugins2/form/fields'
import utils from 'template-ui/lib/plugins2/form/utils'
import validators from 'template-tools/src/utils/validators'

import config from './config'
import tables from './tables'

const user = {
  id: {
    title: 'ID'
  },
  name: {
    title: 'Name',
    validate: []
  }
}

const forms = {
  user
}

export default forms