import React, { Component } from 'react'
import Dialog from 'react-toolbox/lib/dialog'

export class Modal extends Component {

  render () {
    const actions = [
      { label: this.props.cancelTitle || "Cancel", onClick: this.props.onCancel },
      { label: this.props.confirmTitle || "Confirm", onClick: this.props.onConfirm, raised: true, primary: true }
    ]
    return (
      <Dialog
        actions={actions}
        active={this.props.active}
        onEscKeyDown={this.props.onCancel}
        onOverlayClick={this.props.onCancel}
        title={this.props.title}
        type={this.props.type}
      >
        { this.props.children }
      </Dialog>
    )
  }
}

export default Modal