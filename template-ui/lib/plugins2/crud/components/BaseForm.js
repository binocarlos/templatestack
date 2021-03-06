import React, { Component, PropTypes } from 'react'

import ToolbarLayout from '../../../components/layout2/ToolbarLayout'
import Toolbar from '../../../components/Toolbar'
import Section from '../../../components/Section'
import CrudButtonsForm from '../../../components/CrudButtonsForm'
import FormLayout from '../../../components/FormLayout'
import LongText from '../../../components/widgets/LongText'

import horizontal from '../../../components/theme/horizontal.css'

import formUtils from '../../form/utils'

const BaseFormFactory = (opts = {}) => {
  return class BaseForm extends Component {
    getToolbar() {
      const icons = this.props.icons || {}
      const buttons = (
        <CrudButtonsForm
          valid={this.props.valid}
          loading={this.props.loading}
          icons={icons}
          onClick={ (name) => this.props.toolbarClick(name, this.props) }
        />
      )

      const icon = opts.getIcon ? opts.getIcon(this.props) : opts.icon
      const title = opts.getTitle ? opts.getTitle(this.props) : opts.title
      return (
        <Toolbar
          leftIcon={ icon }
          title={ title }
          leftContent={ buttons }
        />
      )
    }

    render() {
      const useForm = opts.getForm ? opts.getForm(this.props) : opts.form
      const fields = formUtils.getFields(useForm)
      
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
}


export default BaseFormFactory