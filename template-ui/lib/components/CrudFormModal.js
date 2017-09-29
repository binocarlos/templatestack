import React, { Component, PropTypes } from 'react'

import Modal from './Modal'

class CrudFormModal extends Component {

  render() {
    const actions = [
      { label: this.props.cancelTitle || "Cancel", onClick: this.props.onCancel },
      { label: this.props.confirmTitle || "Save", onClick: this.props.onConfirm, raised: this.props.valid, primary: this.props.valid }
    ]

    return (
      <Modal
        actions={actions}
        active={this.props.active}
        onEscKeyDown={this.props.onCancel}
        onOverlayClick={this.props.onCancel}
        title={this.props.title}
        type={this.props.type}
      >
        { this.props.children }
      </Modal>
    )
  }
}

export default CrudFormModal