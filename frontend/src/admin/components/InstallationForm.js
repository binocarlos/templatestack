import React, { Component, PropTypes } from 'react'

import ToolbarLayout from 'template-ui/lib/components/layout2/ToolbarLayout'
import Toolbar from 'template-ui/lib/components/Toolbar'
import Section from 'template-ui/lib/components/Section'
import CrudButtonsForm from 'template-ui/lib/components/CrudButtonsForm'
import LongText from 'template-ui/lib/components/widgets/LongText'
import horizontal from 'template-ui/lib/components/theme/horizontal.css'

import config from '../config'

class InstallationForm extends Component {

  getToolbar() {

    const buttons = (
      <CrudButtonsForm
        icons={config.icons}
        onClick={ (name) => this.props.toolbarClick(name, selectedItems) }
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
    const selected = this.props.selected || []
    const selectedItems = selected.map(i => data[i])
    return (
      <ToolbarLayout
        toolbar={this.getToolbar()}
      >
        <Section>FORM</Section>
      </ToolbarLayout>
    )
  }
}

export default InstallationForm