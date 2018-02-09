import React, { Component, PropTypes } from 'react'
import { reduxForm } from 'redux-form'

import Modal from './Modal'
import FormLayout from './FormLayout'

import formUtils from '../plugins2/form/utils'

const FormContainer = reduxForm({
  
})(FormLayout)

class FormModal extends Component {

  getForm() {
    const fields = formUtils.getFields(this.props.schema)
    const defaults = formUtils.getDefaults(this.props.schema)
    return (
      <FormContainer
        form={ this.props.form }
        fields={ fields }
        initialValues={ defaults }
      />
    )
  }

  onConfirm() {
    if(!this.props.valid) {
      this.props.onTouchForm()
    }
    else {
      this.props.onConfirm(this.props.values)
    }
  }

  render() {
    const actions = [
      {
        label: this.props.cancelTitle || "Cancel",
        onClick: this.props.onCancel 
      },
      {
        label: this.props.confirmTitle || "Save",
        onClick: this.onConfirm.bind(this),
        raised: this.props.valid,
        primary: this.props.valid
      }
    ]

    return (
      <Modal
        actions={ actions }
        valid={ this.props.valid }
        title={ this.props.title }
        active={ this.props.active }
        onEscKeyDown={this.props.onCancel}
        onOverlayClick={this.props.onCancel}
      >
        { this.getForm() }
      </Modal>
    )
    
  }
}

export default FormModal