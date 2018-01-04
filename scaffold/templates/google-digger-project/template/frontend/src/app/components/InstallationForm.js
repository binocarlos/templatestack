import React, { Component, PropTypes } from 'react'

import config from '../config'
import forms from '../forms'

import TabForm from 'template-ui/lib/plugins2/crud/components/TabForm'

const ProjectForm = TabForm({
  title: 'Project',
  icon: config.icons.project,
  tabs: [{
    label: 'Details',
    fields: forms.installationCore
  }, {
    label: 'Collaborators',
    fields: forms.installationCollaborators
  }],
  icons: config.icons,
})

export default ProjectForm