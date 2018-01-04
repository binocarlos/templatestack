import React, { Component, PropTypes } from 'react'

import BaseTree from 'template-ui/lib/plugins2/digger/components/BaseTree'
import config from '../config'
import digger from '../digger'

const icons = config.icons

const ResourceTree = BaseTree({
  title: 'Resources',
  width: '250px',
  getIcon: digger.getIcon
})

export default ResourceTree