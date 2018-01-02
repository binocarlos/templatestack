import React, { Component, PropTypes } from 'react'

import {Tab, Tabs} from 'react-toolbox/lib/tabs'


import ToolbarLayout from 'template-ui/lib/components/layout2/ToolbarLayout'
import Toolbar from 'template-ui/lib/components/Toolbar'
import Section from 'template-ui/lib/components/Section'
import CrudButtonsForm from 'template-ui/lib/components/CrudButtonsForm'
import FormLayout from 'template-ui/lib/components/FormLayout'
import LongText from 'template-ui/lib/components/widgets/LongText'

import horizontal from 'template-ui/lib/components/theme/horizontal.css'

import formUtils from 'template-ui/lib/plugins2/form/utils'

const TabFormFactory = (opts = {}) => {
  return class BaseForm extends Component {
    state = {
      index: 0,
    }

    handleTabChange = (index) => {
      this.setState({index})
    }

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

      return (
        <Toolbar
          leftIcon={ opts.icon }
          title={ opts.title }
          leftContent={ buttons }
        />
      )
    }

    render() {
      const data = this.props.data || []
      const tabs = opts.tabs || []

      return (
        <ToolbarLayout
          toolbar={this.getToolbar()}
        >
          <Section>
            <Tabs index={this.state.index} onChange={this.handleTabChange}>
              {
                tabs.map((tab, i) => {
                  const fields = formUtils.getFields(tab.fields)
                  return (
                    <Tab label={tab.label} key={i}>
                      <FormLayout
                        fields={ fields }
                      />
                    </Tab>
                  )
                })
              }
            </Tabs>
          </Section>
        </ToolbarLayout>
      )
    }
  }
}

export default TabFormFactory