import React, { Component, PropTypes } from 'react'
import { reduxForm } from 'redux-form'

import ProgressBar from 'react-toolbox/lib/progress_bar'
import Table from 'template-ui/lib/components/Table'
import ToolbarLayout from './layout2/ToolbarLayout'
import Toolbar from './Toolbar'
import CrudButtonsListToolbar from './CrudButtonsListToolbar'
import CrudButtonsListItem from './CrudButtonsListItem'
import CrudDeleteModal from './CrudDeleteModal'
import Modal from './Modal'
import FormLayout from './FormLayout'
import FormModal from './FormModal'

import formUtils from 'template-ui/lib/plugins2/form/utils'
import horizontal from './theme/horizontal.css'
import IconButtons from './IconButtons'

import icons from '../utils/icons'

class FormItemField extends Component {

  getToolbar() {
    const data = this.props.data || []
    
    const options = [
      ['edit', 'Edit', icons.edit, {}]
    ]

    const buttons = this.props.getToolbarButtons ? this.props.getToolbarButtons(this.props) : (
      <IconButtons
        options={options}
        onClick={(id) => this.props.toolbarClick(id)}
      />
    )

    const title = (this.props.getTitle ? this.props.getTitle() : this.props.title)

    return (
      <Toolbar
        leftIcon={ this.props.icon }
        title={ title }
        leftContent={ buttons }
        clearBackground
        small
      />
    )
  }

  getItemWindow() {
    if(this.props.formHook) return null
    if(this.props.itemWindowComponent) {
      const ItemWindowComponent = this.props.itemWindowComponent
      return (
        <ItemWindowComponent {...this.props} />
      )
    }
    return (
      <FormModal
        active={ this.props.itemWindow ? true : false}
        title={ this.props.itemTitle || this.props.label }
        form={ this.props.id }
        schema={ this.props.schema }
        values={ this.props.values }
        onCancel={ this.props.cancelItemWindow }
        onConfirm={ this.props.confirmItemWindow }
        onTouchForm={ this.props.touchItemWindow }
        valid={ this.props.valid }
      />
    )
  }

  getDataLine() {
    return Object.keys(this.props.data || {}).reduce((all, key) => {
      return all.concat([`${key}: ${this.props.data[key]}`])
    }, []).join(', ')
  }
  
  getSummary() {
    if(!this.props.getSummary) return this.getDataLine()
    return this.props.getSummary(this.props)
  }

  render() {
    return (
      <div>
        { this.getToolbar() }
        { this.getItemWindow() }
        <div>
          { this.getSummary() }
        </div>
      </div>
    )
  }
}

export default FormItemField