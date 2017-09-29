import React, { Component, PropTypes } from 'react'

import Modal from './Modal'

class CrudFormModal extends Component {

  render() {
    return (
      <Modal
        title={ this.props.title }
        active={ this.props.active }
        confirmTitle='Save'
        onCancel={ this.props.onCancel }
        onConfirm={ this.props.onConfirm }
      >
        { this.props.children }
      </Modal>
    )
  }
}

export default CrudFormModal