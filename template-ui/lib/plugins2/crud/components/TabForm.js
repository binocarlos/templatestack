import React, { Component, PropTypes } from 'react'

import {Tab, Tabs} from 'react-toolbox/lib/tabs'


import ToolbarLayout from '../../../components/layout2/ToolbarLayout'
import Toolbar from '../../../components/Toolbar'
import Section from '../../../components/Section'
import CrudButtonsForm from '../../../components/CrudButtonsForm'
import FormLayout from '../../../components/FormLayout'
import LongText from '../../../components/widgets/LongText'

import horizontal from '../../../components/theme/horizontal.css'

import formUtils from '../../form/utils'

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