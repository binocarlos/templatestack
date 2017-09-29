import React, { Component, PropTypes } from 'react'

import ToolbarLayout from 'template-ui/lib/components/layout2/ToolbarLayout'
import Toolbar from 'template-ui/lib/components/Toolbar'
import Section from 'template-ui/lib/components/Section'
import CrudButtonsForm from 'template-ui/lib/components/CrudButtonsForm'
import FormLayout from 'template-ui/lib/components/FormLayout'
import LongText from 'template-ui/lib/components/widgets/LongText'

import horizontal from 'template-ui/lib/components/theme/horizontal.css'

import formUtils from 'template-ui/lib/plugins2/form/utils'
import config from '../config'
import forms from '../forms'

class ProjectForm extends Component {

  getToolbar() {

    const buttons = (
      <CrudButtonsForm
        icons={config.icons}
        onClick={ (name) => this.props.toolbarClick(name) }
      />
    )

    return (
      <Toolbar
        leftIcon={ config.icons.project }
        title='Project Form'
        leftContent={ buttons }
      />
    )
  }

  render() {
    const data = this.props.data || []
    const fields = formUtils.getFields(forms.project)
    
    return (
      <ToolbarLayout
        toolbar={this.getToolbar()}
      >
        <Section>
          <FormLayout
            fields={ fields }
          />
        </Section>
      </ToolbarLayout>
    )
  }
}

export default ProjectForm